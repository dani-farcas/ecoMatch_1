# 📁 core/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter

# 📦 Views importieren
from core.views import (
    RegisterView,
    ConfirmEmailView,
    UserViewSet,
    SubscriptionViewSet,
    ServiceTypeViewSet,
    ProviderProfileViewSet,
    RequestViewSet,
    OfferViewSet,
    client_dashboard  # ✅ optionaler Test-Endpoint für Clients
)

# 🔁 REST-Router: Automatische URL-Generierung für alle ViewSets
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'subscriptions', SubscriptionViewSet)
router.register(r'services', ServiceTypeViewSet)
router.register(r'provider-profiles', ProviderProfileViewSet)
router.register(r'requests', RequestViewSet)
router.register(r'offers', OfferViewSet)

# 🔓 Öffentliche Endpunkte (keine Authentifizierung erforderlich)
urlpatterns = [
    path('', include(router.urls)),                      # Alle ViewSet-URLs
    path('register/', RegisterView.as_view(), name='register'),  # Benutzerregistrierung
    path('confirm-email/<uidb64>/<token>/', ConfirmEmailView.as_view(), name='confirm-email'),  # E-Mail-Bestätigung
]

# 🔐 Geschützte Endpunkte (nur mit gültigem JWT-Token zugänglich)
urlpatterns += [
    path('dashboard/client/', client_dashboard, name='client-dashboard'),  # Beispiel für geschützten Endpunkt
]
