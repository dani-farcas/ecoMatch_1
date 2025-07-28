from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.conf import settings  # ✅ FRONTEND_URL wird bei Bedarf verwendet

from .models import Subscription, ServiceType, ProviderProfile, Request, Offer
from .serializers import (
    RegisterSerializer, UserSerializer, SubscriptionSerializer,
    ServiceTypeSerializer, ProviderProfileSerializer,
    RequestSerializer, OfferSerializer
)
from core.utils.permissions import role_required
from core.utils.email import send_confirmation_email

# 🔐 Eigenes User-Modell laden
User = get_user_model()

# ✅ Benutzerverwaltung via API
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

# ✅ Abonnements-Management via API
class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

# ✅ Öffentliche API für Servicetypen
class ServiceTypeViewSet(viewsets.ModelViewSet):
    queryset = ServiceType.objects.all()
    serializer_class = ServiceTypeSerializer
    permission_classes = [permissions.AllowAny]

# ✅ Anbieterprofile nur für authentifizierte Anbieter
class ProviderProfileViewSet(viewsets.ModelViewSet):
    queryset = ProviderProfile.objects.all()
    serializer_class = ProviderProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ✅ Kundenanfragen nur für authentifizierte Clients
class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

# ✅ Angebote von Anbietern nur für eingeloggte Anbieter
class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(provider=self.request.user)

# ✅ Registrierung eines neuen Benutzers inkl. E-Mail-Bestätigung
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = False  # Benutzer bleibt inaktiv bis E-Mail bestätigt
            user.save()
            send_confirmation_email(user, request)
            return Response({'message': '✅ Bitte bestätige deine E-Mail-Adresse.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ E-Mail Bestätigung via API-Endpoint (JSON Response für React)
class ConfirmEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"message": "❌ Ungültiger Bestätigungslink."}, status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({"message": "✅ Deine E-Mail-Adresse wurde erfolgreich bestätigt."}, status=status.HTTP_200_OK)
        return Response({"message": "❌ Der Token ist ungültig oder abgelaufen."}, status=status.HTTP_400_BAD_REQUEST)

# 🔒 Beispiel: Nur Clients haben Zugriff
@api_view(['GET'])
@role_required('client')
def client_dashboard(request):
    return Response({'nachricht': 'Willkommen im Client-Dashboard'})
