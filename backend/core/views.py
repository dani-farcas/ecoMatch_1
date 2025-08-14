# 📁 core/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.conf import settings
import secrets
import logging

# 🗄️ Modelle
from core.models import (
    Subscription, ServiceType, ProviderProfile, Request, Offer,
    Lead, Bundesland, Region, PlzOrt, Strasse
)

# 🛠️ Serializer
from .serializers import (
    RegisterSerializer, UserSerializer, SubscriptionSerializer,
    ServiceTypeSerializer, ProviderProfileSerializer, RequestSerializer,
    OfferSerializer, LeadInitiateSerializer, GuestRequestSerializer,
    BundeslandSerializer, RegionSerializer, EmailTokenObtainPairSerializer
)

# 🔒 Eigene Utils
from core.utils.permissions import role_required
from core.utils.email import send_confirmation_email, send_guest_confirmation_email

User = get_user_model()
logger = logging.getLogger(__name__)

# =====================================================
# 🔐 AUTHENTIFIZIERUNG
# =====================================================

class EmailTokenObtainPairView(TokenObtainPairView):
    """
    🇩🇪 JWT-Login per E-Mail oder Benutzername.
    - Verwendet EmailTokenObtainPairSerializer.
    - Verweigert Login für inaktive Konten.
    """
    serializer_class = EmailTokenObtainPairSerializer


class ResendActivationEmailView(APIView):
    """
    🇩🇪 Sendet den Aktivierungslink erneut, wenn das Konto existiert, aber inaktiv ist.
    Gibt aus Sicherheitsgründen nur generische Meldungen zurück.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").strip().lower()
        if not email:
            return Response({"detail": "E-Mail ist erforderlich."}, status=400)

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            # Keine Existenz preisgeben
            return Response({"detail": "Falls ein Konto existiert, wurde eine E-Mail gesendet."}, status=200)

        if user.is_active:
            return Response({"detail": "Dieses Konto ist bereits aktiviert."}, status=200)

        try:
            send_confirmation_email(user)
        except Exception:
            pass  # Keine Details leaken

        return Response({"detail": "Falls ein Konto existiert, wurde eine E-Mail gesendet."}, status=200)


class RegisterView(APIView):
    """
    🇩🇪 API zur Benutzerregistrierung:
    - Existiert E-Mail aktiv → Fehler
    - Existiert E-Mail inaktiv (GAST) → aktualisieren + Bestätigungslink senden
    - Neue E-Mail → neuer User inaktiv + Bestätigungslink senden
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        username = request.data.get("username", "").strip()
        password = request.data.get("password", "")

        try:
            user = User.objects.get(email__iexact=email)
            if user.is_active:
                return Response({"detail": "Diese E-Mail ist bereits registriert."}, status=400)

            user.username = username or user.username
            user.set_password(password)
            user.save()

            send_confirmation_email(user, request)
            return Response({"message": "✅ Bitte bestätige deine E-Mail-Adresse (erneut gesendet)."}, status=200)

        except User.DoesNotExist:
            serializer = RegisterSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                user.is_active = False
                user.save()

                send_confirmation_email(user, request)
                return Response({"message": "✅ Bitte bestätige deine E-Mail-Adresse."}, status=201)

            return Response(serializer.errors, status=400)


class ConfirmEmailView(APIView):
    """
    🇩🇪 Bestätigt die E-Mail-Adresse über UID und Token.
    """
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"message": "❌ Ungültiger Bestätigungslink."}, status=400)

        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({"message": "✅ Deine E-Mail-Adresse wurde erfolgreich bestätigt."}, status=200)

        return Response({"message": "❌ Der Token ist ungültig oder abgelaufen."}, status=400)

# =====================================================
# 👤 USER / ABO / SERVICES
# =====================================================

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]


class ServiceTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceType.objects.all()
    serializer_class = ServiceTypeSerializer


class ProviderProfileViewSet(viewsets.ModelViewSet):
    queryset = ProviderProfile.objects.all()
    serializer_class = ProviderProfileSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)


class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(provider=self.request.user)

# =====================================================
# 🌍 PUBLIC API: Bundesland / Region / Location
# =====================================================

class BundeslandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Bundesland.objects.all().order_by("name")
    serializer_class = BundeslandSerializer
    permission_classes = [AllowAny]


class RegionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        bundesland_name = self.request.query_params.get("bundesland")
        if bundesland_name:
            qs = qs.filter(land__name=bundesland_name)
        return qs


@api_view(["GET"])
@permission_classes([AllowAny])
def get_location_by_plz(request):
    plz = request.GET.get("plz")
    if not plz:
        return Response([], status=400)

    matches = PlzOrt.objects.filter(plz=plz)
    data = [{"id": p.id, "plz": p.plz, "ort": p.ort} for p in matches]
    return Response(data)


@api_view(["GET"])
@permission_classes([AllowAny])
def strassen_lookup(request):
    plz_ort_id = request.GET.get("plz_ort")
    if not plz_ort_id:
        return Response({"error": "Kein PLZ-Ort angegeben."}, status=400)

    try:
        plz_ort_id = int(plz_ort_id)
    except ValueError:
        return Response({"error": "Ungültige PLZ-Ort-ID."}, status=400)

    namen = (
        Strasse.objects.filter(plz_ort_id=plz_ort_id)
        .values_list("name", flat=True)
        .distinct()
        .order_by("name")
    )
    unique_names = sorted(set(namen))
    return Response({"strassen": unique_names})

# =====================================================
# 🟢 GAST-FLOW
# =====================================================

class GuestInitiateAPIView(APIView):
    """
    🇩🇪 Initialisiert eine GAST-Anfrage:
    - E-Mail + DSGVO-Zustimmung speichern
    - Bestätigungslink per E-Mail versenden
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LeadInitiateSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            consent = serializer.validated_data["consent"]

            lead, _ = Lead.objects.get_or_create(email=email)
            if lead.validated:
                return Response({"detail": "Diese E-Mail wurde bereits bestätigt."}, status=400)
            if lead.used_for_request:
                return Response({"detail": "Diese E-Mail wurde bereits verwendet."}, status=403)

            token = secrets.token_urlsafe(32)
            lead.token = token
            lead.consent_given = consent
            lead.validated = False
            lead.used_for_request = False
            lead.save()

            send_guest_confirmation_email(email, token)
            return Response({"detail": "Bestätigungs-E-Mail wurde gesendet."}, status=200)

        return Response(serializer.errors, status=400)


class GuestConfirmAPIView(APIView):
    """
    🇩🇪 Bestätigt die E-Mail eines GAST und gibt Token + E-Mail zurück.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"detail": "❌ Kein Token übergeben."}, status=400)

        lead = Lead.objects.filter(token=token).first()
        if not lead:
            return Response({"detail": "❌ Ungültiger oder abgelaufener Link."}, status=400)

        if not lead.validated:
            lead.validated = True
            lead.save()

        return Response({"token": lead.token, "email": lead.email}, status=200)


class GuestRequestAPIView(APIView):
    """
    🇩🇪 Speichert eine GAST-Anfrage inkl. Bilder (FormData).
    """
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = GuestRequestSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "✅ Anfrage erfolgreich empfangen."}, status=201)

        logger.error(f"Serializer errors: {serializer.errors}")
        return Response({"errors": serializer.errors}, status=400)

# =====================================================
# 🔒 BEISPIEL-ROUTE NUR FÜR CLIENTS
# =====================================================

@api_view(["GET"])
@role_required("client")
def client_dashboard(request):
    return Response({"nachricht": "Willkommen im Client-Dashboard"})
