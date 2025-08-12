# 📁 core/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter

# 📦 API-Views & ViewSets
from core.views import (
    RegisterView,
    ConfirmEmailView,
    UserViewSet,
    SubscriptionViewSet,
    ServiceTypeViewSet,
    ProviderProfileViewSet,
    RequestViewSet,
    OfferViewSet,
    GuestInitiateAPIView,
    GuestConfirmAPIView,
    client_dashboard,
    strassen_lookup,
    GuestRequestAPIView,
    BundeslandViewSet,        # ✅ Bundesländer: dropdown im Formular
    RegionViewSet,            # 🔄 Regionen gefiltert nach Bundesland
    get_location_by_plz,
)

# 🔁 DRF-Router mit allen ViewSets
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'subscriptions', SubscriptionViewSet)
router.register(r'services', ServiceTypeViewSet)
router.register(r'provider-profiles', ProviderProfileViewSet)
router.register(r'requests', RequestViewSet)
router.register(r'offers', OfferViewSet)
router.register(r'bundeslaender', BundeslandViewSet)
router.register(r'regionen', RegionViewSet)

# 🔓 Öffentliche Endpunkte (z. B. Registrierung, GAST-Anfrage)
urlpatterns = [
    path('', include(router.urls)),

    path('register/', RegisterView.as_view(), name='register'),
    path('confirm-email/<str:uidb64>/<str:token>/', ConfirmEmailView.as_view(), name='confirm-email'),

    path('gast/initiate/', GuestInitiateAPIView.as_view(), name='gast-initiate'),
    path('gast/confirm/', GuestConfirmAPIView.as_view(), name='gast-confirm'),
    path("strassen/", strassen_lookup, name="strassen-lookup"),
    path("gast/request/", GuestRequestAPIView.as_view(), name="gast-request"),
    path("plz/", get_location_by_plz),
]

# 🔐 Geschützte Endpunkte (nur mit Authentifizierung)
urlpatterns += [
    path('dashboard/client/', client_dashboard, name='client-dashboard'),
]
