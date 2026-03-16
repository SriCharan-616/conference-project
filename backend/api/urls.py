from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for ViewSets
router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'conferences', views.ConferenceViewSet, basename='conference')
router.register(r'sessions', views.SessionViewSet, basename='session')
router.register(r'papers', views.PaperViewSet, basename='paper')
router.register(r'registrations', views.RegistrationViewSet, basename='registration')
router.register(r'payments', views.PaymentViewSet, basename='payment')

# Auth endpoints
auth_urls = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('token/refresh/', views.token_refresh_view, name='token_refresh'),
]

urlpatterns = [
    path('auth/', include(auth_urls)),
    path('', include(router.urls)),
]