# 📁 core/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.parsers import MultiPartParser, FormParser
import secrets

# ✅ Standort-API: Rückgabe von Stadt und Straßen basierend auf PLZ
from core.models import PlzOrt, Strasse
from .models import Subscription, ServiceType, ProviderProfile, Request, Offer, Lead, Bundesland, Region
from .serializers import (
    RegisterSerializer, UserSerializer, SubscriptionSerializer,
    ServiceTypeSerializer, ProviderProfileSerializer,
    RequestSerializer, OfferSerializer, LeadInitiateSerializer, GuestRequestSerializer, BundeslandSerializer, RegionSerializer,
)
from core.utils.permissions import role_required
from core.utils.email import send_confirmation_email, send_guest_confirmation_email



User = get_user_model()
# 🔐 Benutzerdefiniertes User-Modell lade
# ✅ GAST – POST Confirmare Email
class GuestConfirmAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"detail": "❌ Kein Token übergeben."}, status=status.HTTP_400_BAD_REQUEST)

        lead = Lead.objects.filter(token=token).first()

        if not lead:
            return Response({"detail": "❌ Ungültiger oder abgelaufener Link."}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Markiere als validiert (auch wenn schon gesetzt)
        if not lead.validated:
            lead.validated = True
            lead.save()

        # ✅ Returne immer token și email actual (să fie sincronizat cu frontendul)
        return Response({
            "token": lead.token,
            "email": lead.email,
        }, status=status.HTTP_200_OK)



# ✅ Benutzerverwaltung via API
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

# ✅ Abonnementsverwaltung
class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

# ✅ Öffentliche API für Servicetypen
class ServiceTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceType.objects.all()
    serializer_class = ServiceTypeSerializer

# ✅ Anbieterprofile für eingeloggte Anbieter
class ProviderProfileViewSet(viewsets.ModelViewSet):
    queryset = ProviderProfile.objects.all()
    serializer_class = ProviderProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ✅ Kundenanfragen nur für eingeloggte Clients
class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

# ✅ Angebote von Anbietern
class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(provider=self.request.user)

        # ✅ GAST: Anfrage mit Bildern absenden (nach Bestätigung)
import logging

logger = logging.getLogger(__name__)

class GuestRequestAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = GuestRequestSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "✅ Anfrage erfolgreich empfangen."}, status=201)
        else:
            # Loghează erorile detaliat
            logger.error(f"Serializer errors: {serializer.errors}")
            # Returnează erorile explicite în răspuns JSON
            return Response({"errors": serializer.errors}, status=400)



# ✅ Registrierung eines neuen Benutzers inkl. E-Mail-Bestätigung
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = False
            user.save()
            send_confirmation_email(user, request)
            return Response({'message': '✅ Bitte bestätige deine E-Mail-Adresse.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Bestätigung der E-Mail über UID + Token (für reguläre Registrierung)
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

# 🔒 Beispiel: Nur Clients dürfen zugreifen
@api_view(['GET'])
@role_required('client')
def client_dashboard(request):
    return Response({'nachricht': 'Willkommen im Client-Dashboard'})

class BundeslandViewSet(viewsets.ReadOnlyModelViewSet):
    """
    🔓 Öffentliche API: Gibt alle Bundesländer zurück
    """
    queryset = Bundesland.objects.all().order_by("name")
    serializer_class = BundeslandSerializer
    permission_classes = [permissions.AllowAny]


class RegionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Region.objects.all()  # ✅ adăugat pentru router
    serializer_class = RegionSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        bundesland_name = self.request.query_params.get("bundesland")
        if bundesland_name:
            qs = qs.filter(land__name=bundesland_name)
        return qs


# ✅ GAST: Initialisierung mit E-Mail + Zustimmung
class GuestInitiateAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LeadInitiateSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            consent = serializer.validated_data["consent"]

            lead, created = Lead.objects.get_or_create(email=email)

            if lead.validated:
                return Response({"detail": "Diese E-Mail wurde bereits bestätigt."}, status=status.HTTP_400_BAD_REQUEST)
            if lead.used_for_request:
                return Response({"detail": "Diese E-Mail wurde bereits verwendet."}, status=status.HTTP_403_FORBIDDEN)

            # 🔐 Zufälliges Token für Bestätigungslink generieren
            token = secrets.token_urlsafe(32)
            lead.token = token
            lead.consent_given = consent
            lead.validated = False
            lead.used_for_request = False
            lead.save()

            send_guest_confirmation_email(email, token)
            print(f"🔔 send_guest_confirmation_email a fost apelat cu token: {token}")

            return Response({"detail": "Bestätigungs-E-Mail wurde gesendet."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([AllowAny])
def strassen_lookup(request):
    print("📥 Query params:", request.query_params)

    plz_ort_id = request.GET.get("plz_ort")
    if not plz_ort_id:
        return Response({"error": "Kein PLZ-Ort angegeben."}, status=400)

    try:
        plz_ort_id = int(plz_ort_id)
    except ValueError:
        return Response({"error": "Ungültige PLZ-Ort-ID."}, status=400)

    # 📦 Lade alle eindeutigen Straßennamen (vollständig, ohne Hausnummer)
    namen = (
        Strasse.objects
        .filter(plz_ort_id=plz_ort_id)
        .values_list("name", flat=True)
        .distinct()
        .order_by("name")
    )

    # 🧼 Optional: entferne doppelte Namen exakt
    unique_names = sorted(set(namen))

    return Response({"strassen": unique_names})

@api_view(["GET"])
@permission_classes([AllowAny])
def get_location_by_plz(request):
    plz = request.GET.get("plz")
    if not plz:
        return Response([], status=400)

    matches = PlzOrt.objects.filter(plz=plz)
    data = [{"id": p.id, "plz": p.plz, "ort": p.ort} for p in matches]
    return Response(data)

