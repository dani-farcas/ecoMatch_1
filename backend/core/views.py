# 📁 core/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.http import HttpResponseRedirect

# 📦 Modelle & Serializer importieren
from .models import (
    Subscription, ServiceType,
    ProviderProfile, Request, Offer
)
from .serializers import (
    RegisterSerializer, UserSerializer, SubscriptionSerializer,
    ServiceTypeSerializer, ProviderProfileSerializer,
    RequestSerializer, OfferSerializer
)

# 🔧 Eigene Berechtigungen
from core.utils.permissions import role_required

# 📩 Import der E-Mail-Funktion (du musst sie in utils/email.py definieren)
from core.utils.email import send_confirmation_email

# 🔄 Aktuelles User-Modell laden
User = get_user_model()

# 🔐 Benutzerverwaltung
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


# 💳 Abonnements
class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]


# 🛠 Öffentliche Servicetypen
class ServiceTypeViewSet(viewsets.ModelViewSet):
    queryset = ServiceType.objects.all()
    serializer_class = ServiceTypeSerializer
    permission_classes = [permissions.AllowAny]


# 🧑‍🔧 Anbieterprofile
class ProviderProfileViewSet(viewsets.ModelViewSet):
    queryset = ProviderProfile.objects.all()
    serializer_class = ProviderProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# 📩 Kundenanfragen
class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)


# 💬 Angebote von Dienstleistern
class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(provider=self.request.user)


# 📝 Registrierung eines neuen Benutzers (GAST)
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = False  # Konto bleibt inaktiv bis Bestätigung
            user.save()
            send_confirmation_email(user, request)  # 📩 E-Mail mit Link senden
            return Response({'message': 'Bitte bestätige deine E-Mail-Adresse.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Kontoaktivierung per Link (aus E-Mail)
class ConfirmEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, uidb64, token):
        try:
            # 🔓 Nutzer-ID decodieren
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)

            # 🔐 Token validieren
            if default_token_generator.check_token(user, token):
                user.is_active = True
                user.save()
                # 🌐 Weiterleitung zum Frontend nach erfolgreicher Aktivierung
                return HttpResponseRedirect("https://ecoMatch.vercel.app/confirm-email/success")
            else:
                return HttpResponseRedirect("https://ecoMatch.vercel.app/confirm-email/invalid")
        except Exception:
            return HttpResponseRedirect("https://ecoMatch.vercel.app/confirm-email/invalid")


# 🔒 Beispiel für Client-Zugriff mit Rollenprüfung
@api_view(['GET'])
@role_required('client')  # erlaubt Zugriff für Clients & Superuser
def client_dashboard(request):
    return Response({'nachricht': 'Willkommen im Client-Dashboard'})
