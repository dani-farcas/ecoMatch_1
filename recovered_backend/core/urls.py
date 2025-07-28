# 📁 core/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter

# 📦 Import aller Views (API-Endpunkte)
from core.views import (
    RegisterView,
    ConfirmEmailView,
    UserViewSet,
    SubscriptionViewSet,
    ServiceTypeViewSet,
    ProviderProfileViewSet,
    RequestViewSet,
    OfferViewSet,
    client_dashboard,  # ✅ Beispiel für geschützten Client-Endpunkt
)

# 🔁 REST-API Router: automatische Generierung von CRUD-URLs für ViewSets
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'subscriptions', SubscriptionViewSet)
router.register(r'services', ServiceTypeViewSet)
router.register(r'provider-profiles', ProviderProfileViewSet)
router.register(r'requests', RequestViewSet)
router.register(r'offers', OfferViewSet)

# 🔓 Öffentliche Endpunkte (kein Login erforderlich)
urlpatterns = [
    # ➡️ Alle ViewSet-Endpunkte über Router (CRUD-Operationen)
    path('', include(router.urls)),

    # ➡️ Benutzer-Registrierung (POST)
    path('register/', RegisterView.as_view(), name='register'),

    # ➡️ E-Mail-Bestätigung nach Registrierung (GET via Link)
    path('confirm-email/<str:uidb64>/<str:token>/', ConfirmEmailView.as_view(), name='confirm-email'),
]

# 🔐 Authentifizierte Endpunkte (erfordern JWT-Token)
urlpatterns += [
    # ➡️ Beispiel für geschützten API-Endpunkt (Client-Dashboard)
    path('dashboard/client/', client_dashboard, name='client-dashboard'),
]
