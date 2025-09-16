# 📁 core/urls.py
# 🇩🇪 URL-Routing für die API (DRF + eigene Views)

from django.urls import path, include
from rest_framework.routers import DefaultRouter

# 📦 API-Views & ViewSets
from core.views import (
    RegisterView,
    ConfirmEmailView,
    UserViewSet,
    CurrentUserView,
    DashboardSummaryView,
    SubscriptionViewSet,
    ServiceTypeViewSet,
    ProviderProfileViewSet,
    RequestViewSet,
    OfferViewSet,
    GuestInitiateAPIView,
    GuestConfirmAPIView,
    GuestRequestAPIView,
    strassen_lookup,
    get_location_by_plz,
    BundeslandViewSet,
    RegionViewSet,
)

# =====================================================
# 🔁 DRF-Router mit allen ViewSets
# =====================================================
router = DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"subscriptions", SubscriptionViewSet)
router.register(r"services", ServiceTypeViewSet)
router.register(r"provider-profiles", ProviderProfileViewSet)
router.register(r"requests", RequestViewSet)
router.register(r"offers", OfferViewSet)
router.register(r"bundeslaender", BundeslandViewSet)
router.register(r"regionen", RegionViewSet)

# =====================================================
# 🌍 URL-Muster
# =====================================================
urlpatterns = [
    # 🔄 Alle Router-URLs (Model-ViewSets)
    path("", include(router.urls)),

    # 👤 Auth / Registrierung
    path("register/", RegisterView.as_view(), name="register"),
    path("confirm-email/<str:uidb64>/<str:token>/", ConfirmEmailView.as_view(), name="confirm-email"),

    # 👤 User / Dashboard
    path("me/", CurrentUserView.as_view(), name="current-user"),
    path("dashboard/summary/", DashboardSummaryView.as_view(), name="dashboard-summary"),

    # 🟢 GAST-Flow
    path("gast/initiate/", GuestInitiateAPIView.as_view(), name="gast-initiate"),
    path("gast/confirm/", GuestConfirmAPIView.as_view(), name="gast-confirm"),
    path("gast/request/", GuestRequestAPIView.as_view(), name="gast-request"),

    # 📍 Location-APIs
    path("plz/", get_location_by_plz, name="plz-lookup"),
    path("strassen/", strassen_lookup, name="strassen-lookup"),
]
