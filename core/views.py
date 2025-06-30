from rest_framework import viewsets, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
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

# ✅ Confirmare cont prin uid/token (metoda profesională Django)
class ConfirmEmailView(APIView):
    def get(self, request, uid, token):
        try:
            uid_decoded = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=uid_decoded)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response(
                {"detail": "Link-ul de confirmare nu este valid."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if user.is_active:
            return Response({"detail": "Contul a fost deja activat."}, status=status.HTTP_200_OK)

        if not default_token_generator.check_token(user, token):
            return Response(
                {"detail": "Token-ul de confirmare este invalid sau expirat."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.is_active = True
        user.save()
        return Response({"detail": "Contul a fost activat cu succes!"}, status=status.HTTP_200_OK)

# 🔐 ViewSet pentru utilizatori (înregistrare + listare)
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
        return ProviderProfile.objects.none()

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
        elif user.is_provider:
            # În viitor: logica de matching
            return Request.objects.none()
        return Request.objects.all()
