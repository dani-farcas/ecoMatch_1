from rest_framework import viewsets, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from core.utils.email import confirm_token
from django.contrib.auth import get_user_model

from .models import User, ServiceType, ProviderProfile, Request
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    ServiceTypeSerializer,
    ProviderProfileSerializer,
    RequestSerializer,
)

User = get_user_model()

# ✅ Endpoint pentru confirmarea emailului cu token
class ConfirmEmailView(APIView):
    def get(self, request, token):
        email = confirm_token(token)
        if not email:
            return Response({"detail": "Token invalid sau expirat"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(email=email)
            if user.is_active:
                return Response({"detail": "Contul a fost deja activat"}, status=status.HTTP_200_OK)
            user.is_active = True
            user.save()
            return Response({"detail": "Cont activat cu succes!"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"detail": "Utilizatorul nu există"}, status=status.HTTP_404_NOT_FOUND)

# 🔐 ViewSet pentru utilizatori (permite și înregistrarea)
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == "create":
            return RegisterSerializer
        return UserSerializer

# 🔧 ViewSet pentru tipuri de servicii
class ServiceTypeViewSet(viewsets.ModelViewSet):
    queryset = ServiceType.objects.all()
    serializer_class = ServiceTypeSerializer
    permission_classes = [permissions.IsAuthenticated]

# 🛠️ ViewSet pentru profiluri de furnizor
class ProviderProfileViewSet(viewsets.ModelViewSet):
    queryset = ProviderProfile.objects.all()
    serializer_class = ProviderProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_provider:
            raise PermissionDenied("Nur Nutzer mit Provider-Rolle dürfen ein Provider-Profil erstellen.")
        serializer.save(user=user)

    def get_queryset(self):
        user = self.request.user
        if user.is_provider:
            return ProviderProfile.objects.filter(user=user)
        return ProviderProfile.objects.all()

# 📨 ViewSet pentru cereri de la clienți
class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_client:
            raise PermissionDenied("Nur Nutzer mit Client-Rolle dürfen Anfragen senden.")
        serializer.save(client=user)

    def get_queryset(self):
        user = self.request.user
        if user.is_client:
            return Request.objects.filter(client=user)
        return Request.objects.all()
