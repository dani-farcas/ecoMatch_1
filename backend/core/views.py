from rest_framework import viewsets, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from .models import (
    User,
    ServiceType,
    ProviderProfile,
    Request,
    ClientProfile,
)

from .serializers import (
    UserSerializer,
    RegisterSerializer,
    ServiceTypeSerializer,
    ProviderProfileSerializer,
    ClientProfileSerializer,
    RequestSerializer,
)

# JWT serializer personalizat
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

# ========== JWT CUSTOM TOKEN ==========

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['is_client'] = user.is_client
        token['is_provider'] = user.is_provider
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# ========== REGISTER + CONFIRM EMAIL ==========

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'detail': 'Benutzer wurde erfolgreich registriert.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ConfirmEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, uid, token):
        try:
            uid_decoded = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=uid_decoded)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({"detail": "Link-ul de confirmare nu este valid."}, status=status.HTTP_400_BAD_REQUEST)

        if user.is_active:
            return Response({"detail": "Contul a fost deja activat."}, status=status.HTTP_200_OK)

        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Token-ul este invalid sau expirat."}, status=status.HTTP_400_BAD_REQUEST)

        user.is_active = True
        user.save()
        return Response({"detail": "Contul a fost activat cu succes!"}, status=status.HTTP_200_OK)

# ========== USER ==========

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == "create":
            return RegisterSerializer
        return UserSerializer

# ========== SERVICE TYPES ==========

class ServiceTypeViewSet(viewsets.ModelViewSet):
    queryset = ServiceType.objects.all()
    serializer_class = ServiceTypeSerializer
    permission_classes = [permissions.IsAuthenticated]

# ========== PROVIDER PROFILE ==========

class ProviderProfileViewSet(viewsets.ModelViewSet):
    queryset = ProviderProfile.objects.all()
    serializer_class = ProviderProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_provider:
            return ProviderProfile.objects.filter(user=user)
        return ProviderProfile.objects.none()

    def perform_create(self, serializer):
        if not self.request.user.is_provider:
            raise PermissionDenied("Nur Nutzer mit Provider-Rolle dürfen ein Provider-Profil erstellen.")
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

# ========== CLIENT PROFILE ==========

class ClientProfileViewSet(viewsets.ModelViewSet):
    queryset = ClientProfile.objects.all()
    serializer_class = ClientProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        if self.request.user.is_client:
            return ClientProfile.objects.filter(user=self.request.user)
        return ClientProfile.objects.none()

    def get_object(self):
        queryset = self.get_queryset()
        return get_object_or_404(queryset, pk=self.kwargs.get('pk'))

    def perform_create(self, serializer):
        if not self.request.user.is_client:
            raise PermissionDenied("Nur Nutzer mit Client-Rolle dürfen ein Client-Profil erstellen.")
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

# ========== REQUESTS ==========

class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_client:
            return Request.objects.filter(client=user)
        return Request.objects.none()

    def perform_create(self, serializer):
        if not self.request.user.is_client:
            raise PermissionDenied("Nur Nutzer mit Client-Rolle dürfen Anfragen senden.")
        serializer.save(client=self.request.user)

