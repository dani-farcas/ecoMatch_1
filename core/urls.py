from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    ServiceTypeViewSet,
    ProviderProfileViewSet,
    RequestViewSet,
    ClientProfileViewSet,
    ConfirmEmailView,
)

# 🔧 Router pentru ViewSet-uri
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'service-types', ServiceTypeViewSet)
router.register(r'provider-profiles', ProviderProfileViewSet)
router.register(r'requests', RequestViewSet)
router.register(r'client-profiles', ClientProfileViewSet)

# ✅ URL-uri
urlpatterns = [
    path('', include(router.urls)),

    # ✅ Corect: confirm-email/<uid>/<token>/
    path('confirm-email/<str:uid>/<str:token>/', ConfirmEmailView.as_view(), name='confirm-email'),
]
