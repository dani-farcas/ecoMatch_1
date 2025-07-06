from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CustomTokenObtainPairView,
    UserViewSet,
    ServiceTypeViewSet,
    ProviderProfileViewSet,
    RequestViewSet,
    ClientProfileViewSet,
    RegisterView,
    ConfirmEmailView,
)

# 🔄 Router für REST-API-Endpunkte (CRUD)
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'service-types', ServiceTypeViewSet)
router.register(r'provider-profiles', ProviderProfileViewSet)
router.register(r'requests', RequestViewSet)
router.register(r'client-profiles', ClientProfileViewSet)

urlpatterns = [
    # 📦 API-Endpunkte für Modelle (CRUD via Router)
    path('', include(router.urls)),

    # 📝 Registrierung + E-Mail-Bestätigung
    path('register/', RegisterView.as_view(), name='register'),
    path('confirm-email/<str:uid>/<str:token>/', ConfirmEmailView.as_view(), name='confirm-email'),

    # 🔐 JWT-Authentifizierung (mit aktiven Benutzerprüfung)
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
