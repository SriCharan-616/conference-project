from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Conference, Session, Paper, Registration, Payment
import re


# -------------------------------------------------------
# USER SERIALIZERS
# -------------------------------------------------------

class UserSerializer(serializers.ModelSerializer):
    """Standard user serializer for list/detail views."""
    
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "phone", "role", "status", "created_at"]
        read_only_fields = ["id", "created_at"]


class UserDetailSerializer(serializers.ModelSerializer):
    """Detailed user serializer with all fields."""
    
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "phone", "role", "status", "is_active", "created_at"]
        read_only_fields = ["id", "created_at", "is_active"]


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(write_only=True, min_length=8, required=True)
    password_confirm = serializers.CharField(write_only=True, min_length=8, required=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, required=True)
    
    class Meta:
        model = User
        fields = ["username", "email", "first_name", "last_name", "password", "password_confirm", "phone", "role"]
    
    def validate(self, data):
        if data["password"] != data.pop("password_confirm"):
            raise serializers.ValidationError({"password": "Passwords do not match"})
        
        # Email validation
        if User.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError({"email": "Email already registered"})
        
        # Username validation
        if User.objects.filter(username=data["username"]).exists():
            raise serializers.ValidationError({"username": "Username already taken"})
        
        return data
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            phone=validated_data.get("phone", ""),
            role=validated_data.get("role", "attendee"),
        )
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


# -------------------------------------------------------
# CONFERENCE SERIALIZERS
# -------------------------------------------------------

class ConferenceListSerializer(serializers.ModelSerializer):
    """Serializer for conference list view."""
    
    organiser_name = serializers.CharField(source="organiser.get_full_name", read_only=True)
    
    class Meta:
        model = Conference
        fields = ["id", "title", "start_date", "end_date", "location", "organiser_name", "status", "created_at"]


class ConferenceDetailSerializer(serializers.ModelSerializer):
    """Serializer for conference detail view."""
    
    organiser = UserSerializer(read_only=True)
    papers_count = serializers.SerializerMethodField()
    registrations_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Conference
        fields = [
            "id", "title", "theme", "start_date", "end_date", "submission_deadline",
            "location", "organiser", "status", "papers_count", "registrations_count", "created_at"
        ]
    
    def get_papers_count(self, obj):
        return obj.papers.count()
    
    def get_registrations_count(self, obj):
        return obj.registrations.count()


class ConferenceWriteSerializer(serializers.ModelSerializer):
    """Serializer for conference create/update."""
    
    class Meta:
        model = Conference
        fields = ["title", "theme", "start_date", "end_date", "submission_deadline", "location", "status"]
    
    def validate(self, data):
        if data["end_date"] <= data["start_date"]:
            raise serializers.ValidationError({"end_date": "End date must be after start date"})
        if data["submission_deadline"] > data["start_date"]:
            raise serializers.ValidationError({"submission_deadline": "Submission deadline must be before conference start date"})
        return data


# -------------------------------------------------------
# SESSION SERIALIZERS
# -------------------------------------------------------

class SessionSerializer(serializers.ModelSerializer):
    """Serializer for session model."""
    
    panel_members = UserSerializer(many=True, read_only=True)
    panel_member_ids = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        many=True,
        required=False,
        source="panel_members"
    )
    
    class Meta:
        model = Session
        fields = ["id", "conference", "title", "date", "time_slot", "location", "session_type", "panel_members", "panel_member_ids", "created_at"]
        read_only_fields = ["id", "created_at"]


# -------------------------------------------------------
# PAPER SERIALIZERS
# -------------------------------------------------------

class PaperListSerializer(serializers.ModelSerializer):
    """Serializer for paper list view."""
    
    author_name = serializers.CharField(source="author.get_full_name", read_only=True)
    conference_title = serializers.CharField(source="conference.title", read_only=True)
    
    class Meta:
        model = Paper
        fields = ["id", "title", "author_name", "conference_title", "status", "submission_date"]


class PaperDetailSerializer(serializers.ModelSerializer):
    """Serializer for paper detail view."""
    
    author = UserSerializer(read_only=True)
    conference = ConferenceListSerializer(read_only=True)
    
    class Meta:
        model = Paper
        fields = ["id", "title", "abstract", "author", "conference", "file_url", "status", "submission_date", "updated_at"]


class PaperSubmitSerializer(serializers.ModelSerializer):
    """Serializer for paper submission (with file upload)."""
    
    file = serializers.FileField(write_only=True, required=True)
    
    class Meta:
        model = Paper
        fields = [
            "id",
            "title",
            "abstract",
            "conference",
            "file",
            "file_url",
        ]
        read_only_fields = ["file_url"]
    
    def validate_file(self, value):
        if not value.name.lower().endswith('.pdf'):
            raise serializers.ValidationError("Only PDF files are allowed")
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("File size exceeds maximum allowed size of 10MB")
        return value
    def create(self, validated_data):
        validated_data.pop("file", None)   # remove file before model save
        return super().create(validated_data)


class PaperStatusUpdateSerializer(serializers.ModelSerializer):
    """Serializer for paper status update (organiser only)."""
    
    class Meta:
        model = Paper
        fields = ["status"]


# -------------------------------------------------------
# REGISTRATION SERIALIZERS
# -------------------------------------------------------

class RegistrationListSerializer(serializers.ModelSerializer):
    """Serializer for registration list view."""
    
    user_name = serializers.CharField(source="user.get_full_name", read_only=True)
    conference_title = serializers.CharField(source="conference.title", read_only=True)
    
    class Meta:
        model = Registration
        fields = ["id", "user_name", "conference_title", "registration_date", "payment_status", "amount_paid"]


class RegistrationDetailSerializer(serializers.ModelSerializer):
    """Serializer for registration detail view."""
    
    user = UserSerializer(read_only=True)
    conference = ConferenceListSerializer(read_only=True)
    
    class Meta:
        model = Registration
        fields = ["id", "user", "conference", "registration_date", "payment_status", "amount_paid"]


class RegistrationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating registration."""
    
    class Meta:
        model = Registration
        fields = ["conference"]
    
    def validate(self, data):
        user = self.context["request"].user
        conference = data["conference"]
        
        # Check if already registered
        if Registration.objects.filter(user=user, conference=conference).exists():
            raise serializers.ValidationError("You are already registered for this conference")
        
        return data


# -------------------------------------------------------
# PAYMENT SERIALIZERS
# -------------------------------------------------------

class PaymentListSerializer(serializers.ModelSerializer):
    """Serializer for payment list view."""
    
    conference_title = serializers.CharField(source="registration.conference.title", read_only=True)
    
    class Meta:
        model = Payment
        fields = ["id", "conference_title", "amount", "method", "status", "payment_date"]


class PaymentDetailSerializer(serializers.ModelSerializer):
    """Serializer for payment detail view."""
    
    registration = RegistrationDetailSerializer(read_only=True)
    
    class Meta:
        model = Payment
        fields = ["id", "registration", "amount", "method", "transaction_id", "status", "payment_date"]


class PaymentCreateSerializer(serializers.ModelSerializer):
    """Serializer for payment creation."""
    
    class Meta:
        model = Payment
        fields = ["registration", "amount", "method", "transaction_id"]
    
    def validate_transaction_id(self, value):
        if Payment.objects.filter(transaction_id=value).exists():
            raise serializers.ValidationError("Transaction ID already exists")
        return value