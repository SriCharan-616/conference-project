from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Conference, Paper, Registration
from .serializers import (
    UserSerializer,
    ConferenceSerializer,
    PaperSerializer,
    RegistrationSerializer,
)

# ---------------- AUTH ----------------

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "User registered"}, status=200)
    return Response(serializer.errors, status=400)


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        user = User.objects.get(email=email)
    except:
        return Response({"error": "User not found"}, status=404)

    if not user.check_password(password):
        return Response({"error": "Incorrect password"}, status=400)

    refresh = RefreshToken.for_user(user)

    return Response({
        "token": str(refresh.access_token),
        "user_id": user.id,
        "role": user.role
    })


# ---------------- CONFERENCES ----------------

@api_view(["GET"])
def get_conferences(request):
    conferences = Conference.objects.all()
    serializer = ConferenceSerializer(conferences, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_conference_details(request, pk):
    conference = Conference.objects.get(id=pk)
    serializer = ConferenceSerializer(conference)
    return Response(serializer.data)


# ---------------- PAPER SUBMISSION ----------------

@api_view(["POST"])
def submit_paper(request):
    serializer = PaperSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Paper submitted"})
    return Response(serializer.errors, status=400)


# ---------------- REGISTRATION ----------------

@api_view(["POST"])
def register_for_conference(request):
    serializer = RegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Registration successful"})
    return Response(serializer.errors, status=400)