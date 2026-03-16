from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

# -------------------------------------------------------
# CUSTOM USER MODEL (with conflict-free related names)
# -------------------------------------------------------
class User(AbstractUser):
    ROLE_CHOICES = [
        ("admin", "Administrator"),
        ("organiser", "Conference Organiser"),
        ("author", "Paper Author"),
        ("attendee", "Conference Attendee"),
    ]
    
    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="attendee")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="api_user_set",
        blank=True,
        help_text=("The groups this user belongs to."),
    )

    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="api_user_permissions_set",
        blank=True,
        help_text=("Specific permissions for this user."),
    )

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"


# -------------------------------------------------------
# CONFERENCE MODEL
# -------------------------------------------------------
class Conference(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("published", "Published"),
    ]
    
    title = models.CharField(max_length=200)
    theme = models.CharField(max_length=255, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    submission_deadline = models.DateField()
    location = models.CharField(max_length=200)
    organiser = models.ForeignKey(User, on_delete=models.CASCADE, related_name="organised_conferences")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-start_date"]

    def __str__(self):
        return f"{self.title} ({self.start_date.year})"


# -------------------------------------------------------
# SESSION MODEL
# -------------------------------------------------------
class Session(models.Model):
    SESSION_TYPE_CHOICES = [
        ("keynote", "Keynote"),
        ("workshop", "Workshop"),
        ("panel", "Panel Discussion"),
        ("talk", "Talk"),
    ]
    
    conference = models.ForeignKey(Conference, on_delete=models.CASCADE, related_name="sessions")
    title = models.CharField(max_length=255)
    date = models.DateField()
    time_slot = models.CharField(max_length=20)  # e.g., "09:00-10:30"
    location = models.CharField(max_length=200)
    session_type = models.CharField(max_length=20, choices=SESSION_TYPE_CHOICES)
    panel_members = models.ManyToManyField(User, blank=True, related_name="sessions")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["date", "time_slot"]

    def __str__(self):
        return f"{self.title} - {self.conference.title}"


# -------------------------------------------------------
# PAPER SUBMISSION MODEL
# -------------------------------------------------------
class Paper(models.Model):
    STATUS_CHOICES = [
        ("submitted", "Submitted"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    ]
    
    title = models.CharField(max_length=300)
    abstract = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="papers")
    conference = models.ForeignKey(Conference, on_delete=models.CASCADE, related_name="papers")
    file_url = models.URLField()  # Supabase public URL
    submission_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="submitted")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-submission_date"]

    def __str__(self):
        return f"{self.title} by {self.author.get_full_name()}"


# -------------------------------------------------------
# REGISTRATION MODEL
# -------------------------------------------------------
class Registration(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("failed", "Failed"),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="registrations")
    conference = models.ForeignKey(Conference, on_delete=models.CASCADE, related_name="registrations")
    registration_date = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default="pending")
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    class Meta:
        unique_together = ["user", "conference"]
        ordering = ["-registration_date"]

    def __str__(self):
        return f"{self.user.username} - {self.conference.title}"


# -------------------------------------------------------
# PAYMENT MODEL
# -------------------------------------------------------
class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ("card", "Credit/Debit Card"),
        ("upi", "UPI"),
        ("netbanking", "Net Banking"),
        ("cash", "Cash"),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("failed", "Failed"),
    ]
    
    registration = models.ForeignKey(Registration, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    transaction_id = models.CharField(max_length=255, unique=True)
    payment_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default="pending")

    class Meta:
        ordering = ["-payment_date"]

    def __str__(self):
        return f"Payment {self.transaction_id} - {self.amount}"