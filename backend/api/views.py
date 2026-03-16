from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import serializers
from .models import User, Conference, Session, Paper, Registration, Payment
from .serializers import (
    UserSerializer, UserDetailSerializer, RegisterSerializer, LoginSerializer,
    ConferenceListSerializer, ConferenceDetailSerializer, ConferenceWriteSerializer,
    SessionSerializer,
    PaperListSerializer, PaperDetailSerializer, PaperSubmitSerializer, PaperStatusUpdateSerializer,
    RegistrationListSerializer, RegistrationDetailSerializer, RegistrationCreateSerializer,
    PaymentListSerializer, PaymentDetailSerializer, PaymentCreateSerializer,
)
from .permissions import (
    IsAdmin, IsOrganiser, IsAuthor, IsAttendee,
    IsAdminOrReadOnly, IsOwnerOrReadOnly, IsOrganiserOrReadOnly, CanAccessUserData
)
from .utils import upload_paper_to_supabase, send_registration_confirmation_email, send_paper_submission_email, send_paper_status_email, send_payment_confirmation_email


# -------------------------------------------------------
# AUTHENTICATION ENDPOINTS
# -------------------------------------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """User registration endpoint."""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """User login endpoint."""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.check_password(password):
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_active:
            return Response({"error": "Account is inactive"}, status=status.HTTP_403_FORBIDDEN)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def token_refresh_view(request):
    """Refresh JWT token endpoint."""
    refresh_token = request.data.get('refresh')
    if not refresh_token:
        return Response({"error": "Refresh token not provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        refresh = RefreshToken(refresh_token)
        return Response({
            "access": str(refresh.access_token)
        }, status=status.HTTP_200_OK)
    except TokenError:
        return Response({"error": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)


# -------------------------------------------------------
# USER VIEWSET
# -------------------------------------------------------

class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for user management."""
    
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'status']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'username']
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return UserSerializer
        return UserDetailSerializer
    
    def get_queryset(self):
        # Only admin can view all users; others can only view themselves
        if self.request.user.role == 'admin':
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAdmin()]
    
    @action(detail=False, methods=['get', 'put'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Get or update current user profile."""
        if request.method == 'GET':
            serializer = UserDetailSerializer(request.user)
            return Response(serializer.data)
        
        serializer = UserDetailSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        """Delete user (admin only)."""
        user = self.get_object()
        if user == request.user and request.user.role != 'admin':
            return Response({"error": "Cannot delete yourself"}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)


# -------------------------------------------------------
# CONFERENCE VIEWSET
# -------------------------------------------------------

class ConferenceViewSet(viewsets.ModelViewSet):
    """ViewSet for conference management."""
    
    queryset = Conference.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'organiser']
    search_fields = ['title', 'location', 'theme']
    ordering_fields = ['start_date', 'created_at']
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['list']:
            return ConferenceListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ConferenceWriteSerializer
        return ConferenceDetailSerializer
    
    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            return [AllowAny()]
        if self.action == 'create':
            return [IsAuthenticated(), IsOrganiser()]
        return [IsAuthenticated(), IsOrganiserOrReadOnly()]
    
    def perform_create(self, serializer):
        """Set current user as organiser."""
        serializer.save(organiser=self.request.user)
    
    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def sessions(self, request, pk=None):
        """Get all sessions for a conference."""
        conference = self.get_object()
        sessions = conference.sessions.all()
        serializer = SessionSerializer(sessions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def registrations(self, request, pk=None):
        """Get registrations for a conference (organiser only)."""
        conference = self.get_object()
        if conference.organiser != request.user and request.user.role != 'admin':
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        registrations = conference.registrations.all()
        serializer = RegistrationListSerializer(registrations, many=True)
        return Response(serializer.data)


# -------------------------------------------------------
# SESSION VIEWSET
# -------------------------------------------------------

class SessionViewSet(viewsets.ModelViewSet):
    """ViewSet for session management."""
    
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['conference', 'session_type']
    ordering_fields = ['date', 'time_slot']
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            return [AllowAny()]
        return [IsAuthenticated(), IsOrganiser()]


# -------------------------------------------------------
# PAPER VIEWSET
# -------------------------------------------------------

class PaperViewSet(viewsets.ModelViewSet):
    """ViewSet for paper management."""
    
    queryset = Paper.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['conference', 'status', 'author']
    search_fields = ['title', 'abstract']
    ordering_fields = ['submission_date', 'status']
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PaperListSerializer
        elif self.action == 'create':
            return PaperSubmitSerializer
        elif self.action == 'partial_update' or self.action == 'update':
            if 'status' in self.request.data:
                return PaperStatusUpdateSerializer
            return PaperSubmitSerializer
        return PaperDetailSerializer
    
    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            return [AllowAny()]
        if self.action == 'create':
            return [IsAuthenticated(), IsAuthor()]
        if self.action in ['update', 'partial_update']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdmin()]
    
    def perform_create(self, serializer):
        """Handle paper submission with file upload."""
        file = self.request.FILES.get('file')
        file_url = upload_paper_to_supabase(file)
        try:
            # Upload file to Supabase
            file_url = upload_paper_to_supabase(file)
            paper = serializer.save(author=self.request.user, file_url=file_url)
            
            # Send confirmation email
            send_paper_submission_email(self.request.user, paper, paper.conference)
        except ValueError as e:
            raise serializers.ValidationError({"file": str(e)})
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def mine(self, request):
        """Get current user's papers."""
        papers = Paper.objects.filter(author=request.user)
        serializer = PaperListSerializer(papers, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def update_status(self, request, pk=None):
        """Update paper status (organiser only)."""
        paper = self.get_object()
        conference = paper.conference
        
        if conference.organiser != request.user and request.user.role != 'admin':
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = PaperStatusUpdateSerializer(paper, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            
            # Send email notification
            send_paper_status_email(paper.author, paper, paper.status, conference)
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------------------------------------
# REGISTRATION VIEWSET
# -------------------------------------------------------

class RegistrationViewSet(viewsets.ModelViewSet):
    """ViewSet for registration management."""
    
    queryset = Registration.objects.all()
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['conference', 'payment_status']
    ordering_fields = ['registration_date']
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return RegistrationListSerializer
        elif self.action == 'create':
            return RegistrationCreateSerializer
        elif self.action == 'retrieve':
            return RegistrationDetailSerializer
        return RegistrationDetailSerializer
    
    def perform_create(self, serializer):
        """Create registration and send confirmation email."""
        registration = serializer.save(user=self.request.user)
        
        # Send confirmation email
        send_registration_confirmation_email(self.request.user, registration.conference)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def mine(self, request):
        """Get current user's registrations."""
        registrations = Registration.objects.filter(user=request.user)
        serializer = RegistrationDetailSerializer(registrations, many=True)
        return Response(serializer.data)


# -------------------------------------------------------
# PAYMENT VIEWSET
# -------------------------------------------------------

class PaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for payment management."""
    
    queryset = Payment.objects.all()
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'method']
    ordering_fields = ['payment_date']
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PaymentListSerializer
        elif self.action == 'create':
            return PaymentCreateSerializer
        return PaymentDetailSerializer
    
    def perform_create(self, serializer):
        """Create payment and send confirmation email if successful."""
        payment = serializer.save()
        
        if payment.status == 'paid':
            # Update registration payment status
            registration = payment.registration
            registration.payment_status = 'paid'
            registration.amount_paid = payment.amount
            registration.save()
            
            # Send payment confirmation email
            send_payment_confirmation_email(registration.user, registration, payment)
