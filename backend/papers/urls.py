from django.urls import path
from .views import upload_paper

urlpatterns = [
    path('upload/', upload_paper),
]