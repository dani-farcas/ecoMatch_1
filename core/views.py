from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied

from .models import User, ServiceType, ProviderProfile, Request
from .serializers import (
    UserSerializer,
    ServiceTypeSerializer,
    ProviderProfileSerializer,
    RequestSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class ServiceTypeViewSet(viewsets.ModelViewSet):
    queryset = ServiceType.objects.all()
    serializer_class = ServiceTypeSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProviderProfileViewSet(viewsets.ModelViewSet):
    queryset = ProviderProfile.objects.all()
    serializer_class = ProviderProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_provider:
            raise PermissionDenied("Doar utilizatorii cu rol de provider pot crea un profil de furnizor.")
        serializer.save(user=user)

    def get_queryset(self):
        user = self.request.user
        # Un provider își vede doar propriul profil
        if user.is_provider:
            return ProviderProfile.objects.filter(user=user)
        return ProviderProfile.objects.all()


class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_client:
            raise PermissionDenied("Doar utilizatorii cu rol de client pot trimite cereri.")
        serializer.save(client=user)

    def get_queryset(self):
        user = self.request.user
        if user.is_client:
            return Request.objects.filter(client=user)
        return Request.objects.all()
