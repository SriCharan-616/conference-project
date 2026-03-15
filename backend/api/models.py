from django.db import models
from django.contrib.auth.models import AbstractUser

# -------------------------------------------------------
# CUSTOM USER MODEL (with conflict-free related names)
# -------------------------------------------------------
class User(AbstractUser):
    role = models.CharField(max_length=20, default="viewer")

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

# -------------------------------------------------------
# CONFERENCE MODEL
# -------------------------------------------------------
class Conference(models.Model):
    title = models.CharField(max_length=200)
    date = models.DateField()
    location = models.CharField(max_length=200)

    def __str__(self):
        return self.title

# -------------------------------------------------------
# PAPER SUBMISSION MODEL
# -------------------------------------------------------
class Paper(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    conference = models.ForeignKey(Conference, on_delete=models.CASCADE)
    file = models.FileField(upload_to="papers/")
    status = models.CharField(max_length=20, default="Submitted")

# -------------------------------------------------------
# REGISTRATION MODEL
# -------------------------------------------------------
class Registration(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    conference = models.ForeignKey(Conference, on_delete=models.CASCADE)
    reg_date = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(max_length=20, default="Pending")