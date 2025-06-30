from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    ServiceTypeViewSet,
    ProviderProfileViewSet,
    RequestViewSet,
    ConfirmEmailView,
)

# 🔧 Router pentru ViewSet-uri
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'service-types', ServiceTypeViewSet)
router.register(r'provider-profiles', ProviderProfileViewSet)
router.register(r'requests', RequestViewSet)

# ✅ Toate rutele
urlpatterns = [
    # Rutele generate automat de DRF
    path('', include(router.urls)),

    # Ruta pentru confirmare email
    path('confirm-email/<str:token>/', ConfirmEmailView.as_view(), name='confirm-email'),
]
