from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ServiceTypeViewSet, ProviderProfileViewSet, RequestViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'services', ServiceTypeViewSet)
router.register(r'providers', ProviderProfileViewSet)
router.register(r'requests', RequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
