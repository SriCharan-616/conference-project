from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register),
    path("login/", views.login),
    path("conferences/", views.conferences_list_create),
    path("conferences/<int:pk>/", views.get_conference_details),

    path("papers/submit/", views.submit_paper),
    path("registration/", views.register_for_conference),
]