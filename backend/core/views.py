# 📁 core/views.py
# 🇩🇪 Views für Authentifizierung, Benutzerverwaltung, Dashboard, GAST-Flow und öffentliche Endpunkte.

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView

from django.db.models import Q
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
import secrets
import logging

# 🗄️ Modelle
from core.models import (
    Subscription,
    ServiceType,
    ProviderProfile,
    Request,
    Offer,
    Lead,
    Bundesland,
    Region,
    PlzOrt,
    Strasse,
    RequestImage,
)

# 🛠️ Serializer
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    SubscriptionSerializer,
    ServiceTypeSerializer,
    ProviderProfileSerializer,
    RequestSerializer,
    OfferSerializer,
    LeadInitiateSerializer,
    GuestRequestSerializer,
    BundeslandSerializer,
    RegionSerializer,
    EmailTokenObtainPairSerializer,
)

# 🔧 Setup
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
            return Response(
                {"detail": "Falls ein Konto existiert, wurde eine E-Mail gesendet."},
                status=200,
            )

        if user.is_active:
            return Response(
                {"detail": "Dieses Konto ist bereits aktiviert."}, status=200
            )

        try:
            from core.utils.email import send_confirmation_email

            send_confirmation_email(user)
        except Exception:
            logger.warning("⚠️ Fehler beim Senden der Aktivierungs-E-Mail (Resend).")

        return Response(
            {"detail": "Falls ein Konto existiert, wurde eine E-Mail gesendet."},
            status=200,
        )


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
                return Response(
                    {"detail": "Diese E-Mail ist bereits registriert."}, status=400
                )

            # Inaktiven User updaten
            user.username = username or user.username
            user.set_password(password)
            user.save()

            from core.utils.email import send_confirmation_email

            send_confirmation_email(user, request)
            return Response(
                {
                    "message": "✅ Bitte bestätige deine E-Mail-Adresse (erneut gesendet)."
                },
                status=200,
            )

        except User.DoesNotExist:
            serializer = RegisterSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                user.is_active = False
                user.save()

                from core.utils.email import send_confirmation_email

                send_confirmation_email(user, request)
                return Response(
                    {"message": "✅ Bitte bestätige deine E-Mail-Adresse."}, status=201
                )

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
            return Response(
                {"message": "✅ Deine E-Mail-Adresse wurde erfolgreich bestätigt."},
                status=200,
            )

        return Response(
            {"message": "❌ Der Token ist ungültig oder abgelaufen."}, status=400
        )


# =====================================================
# 👤 USER / ABO / SERVICES
# =====================================================

class UserViewSet(viewsets.ModelViewSet):
    """
    🇩🇪 Verwaltung der Benutzer
    - Admin/Staff: volle Verwaltung
    - Normaler User: nur Zugriff auf eigene Daten über /me/
    - Zusatzaktion: Modus wechseln (Client <-> Provider)
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["get", "patch"], url_path="me")
    def me(self, request):
        """
        🇩🇪 Gibt das eigene Benutzerprofil zurück oder erlaubt Updates (PATCH).
        """
        user = request.user
        if request.method == "GET":
            serializer = self.get_serializer(user, context={"request": request})
            return Response(serializer.data)

        elif request.method == "PATCH":
            serializer = self.get_serializer(
                user, data=request.data, partial=True, context={"request": request}
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], url_path="switch-mode")
    def switch_mode(self, request):
        """
        🇩🇪 Wechsel zwischen Client- und Provider-Modus.
        - Client: immer erlaubt
        - Provider: nur falls ein ProviderProfile existiert
        """
        mode = request.data.get("mode")
        user = request.user

        if mode not in ["client", "provider"]:
            return Response({"detail": "Ungültiger Modus."}, status=400)

        if mode == "provider" and not hasattr(user, "providerprofile"):
            return Response({"detail": "Kein Anbieter-Profil vorhanden."}, status=403)

        # 💾 Modus in DB speichern (optional)
        user.current_mode = mode
        user.save()

        return Response(
            {"detail": f"Modus gewechselt: {mode}", "current_mode": mode}, status=200
        )



class CurrentUserView(APIView):
    """
    🇩🇪 Gibt den aktuell eingeloggten Benutzer zurück (/api/me/).
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(serializer.data)


class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]


class ServiceTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceType.objects.all()
    serializer_class = ServiceTypeSerializer



class ProviderProfileViewSet(viewsets.ModelViewSet):
    """
    🇩🇪 ViewSet für Anbieterprofile:
    - Jeder User kann nur sein eigenes Profil sehen/bearbeiten
    - Erstellen löst Bestätigungsmail aus
    - Zusatzaktionen: passende Anfragen, Anfrage akzeptieren
    """
    queryset = ProviderProfile.objects.all()
    serializer_class = ProviderProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # 👉 Nur das eigene ProviderProfile anzeigen
        return ProviderProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        profile = serializer.save(user=self.request.user)

        # 📧 Bestätigungsmail nach Erstellung des Profils
        if profile.user.email:
            from django.core.mail import send_mail
            subject = "Ihr Anbieter-Profil wurde erstellt"
            message = (
                f"Hallo {profile.user.first_name or ''},\n\n"
                f"Ihr Anbieter-Profil '{profile.firma}' wurde erfolgreich erstellt.\n"
                f"Sie können ab sofort Anfragen erhalten und akzeptieren.\n\n"
                f"Viele Grüße,\nIhr ecoMatch-Team"
            )
            send_mail(
                subject,
                message,
                "noreply@ecomatch.de",
                [profile.user.email],
                fail_silently=True,
            )

    @action(detail=False, methods=["get"], url_path="matches")
    def matches(self, request):
        """🇩🇪 Gibt passende Anfragen für den eingeloggten Provider zurück"""
        try:
            provider = request.user.providerprofile
        except ProviderProfile.DoesNotExist:
            return Response({"detail": "Kein Provider-Profil vorhanden."}, status=404)

        services = provider.services.all()
        regions = provider.coverage_regions.all()

        # Matching: offene Requests, die Service + Region enthalten
        matches = Request.objects.filter(
            services__in=services,
            region__in=[r.name for r in regions],  # ⚠️ Request.region ist CharField
            status="neu",
        ).distinct()

        serializer = RequestSerializer(matches, many=True)
        return Response(serializer.data, status=200)

    @action(detail=True, methods=["post"], url_path="accept")
    def accept_request(self, request, pk=None):
        """🇩🇪 Provider akzeptiert eine Anfrage und Kunde wird benachrichtigt"""
        try:
            req = Request.objects.get(pk=pk, status="neu")
        except Request.DoesNotExist:
            return Response(
                {"detail": "Anfrage nicht gefunden oder nicht offen."},
                status=status.HTTP_404_NOT_FOUND,
            )

        req.status = "akzeptiert"
        req.save()

        # 📧 E-Mail an den Client senden
        if req.client and req.client.email:
            from django.core.mail import send_mail
            subject = "Ihre Anfrage wurde akzeptiert"
            message = (
                f"Guten Tag {req.client.first_name or ''},\n\n"
                f"Ihre Anfrage '{req.title}' wurde von einem Anbieter akzeptiert.\n"
                f"Bitte loggen Sie sich in Ihr Dashboard ein, um weitere Details zu sehen.\n\n"
                f"Viele Grüße,\nIhr ecoMatch-Team"
            )
            try:
                send_mail(
                    subject,
                    message,
                    "noreply@ecomatch.de",
                    [req.client.email],
                    fail_silently=True,
                )
            except Exception as e:
                return Response(
                    {"detail": f"Anfrage akzeptiert, aber E-Mail konnte nicht gesendet werden: {e}"},
                    status=200,
                )

        return Response({"detail": "Anfrage akzeptiert und Kunde benachrichtigt."}, status=200)

class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()  # 👈 obligatorisch für Router
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated]

    # 🔎 Nur eigene Anfragen des eingeloggten Benutzers
    def get_queryset(self):
        user = self.request.user
        queryset = Request.objects.filter(client=user).order_by("-created_at")

        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(beschreibung__icontains=search)
                | Q(services__name__icontains=search)
            ).distinct()
        return queryset

    # ➕ Neue Anfrage anlegen
    def perform_create(self, serializer):
        request = serializer.save(client=self.request.user)

        # 📎 Falls Bilder hochgeladen wurden → speichern
        files = self.request.FILES.getlist("images")
        for f in files:
            RequestImage.objects.create(request=request, image=f)

    # 📝 Optional: Update mit Bildern
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # 📎 Neue Bilder anhängen (falls vorhanden)
        files = request.FILES.getlist("images")
        for f in files:
            RequestImage.objects.create(request=instance, image=f)

        return Response(serializer.data, status=status.HTTP_200_OK)


class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(provider=self.request.user)


class DashboardSummaryView(APIView):
    """
    🇩🇪 Einheitliches Dashboard für jeden Nutzer (/api/dashboard/summary/).
    Liefert:
      - user (serialized)
      - has_providerprofile (bool)
      - requests_count (als Client)
      - offers_count (als Provider)
      - providerprofile (falls vorhanden)
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            "user": UserSerializer(user, context={"request": request}).data,
            "has_providerprofile": hasattr(user, "providerprofile"),
            "requests_count": Request.objects.filter(client=user).count(),
            "offers_count": Offer.objects.filter(provider=user).count(),
        }
        if hasattr(user, "providerprofile"):
            data["providerprofile"] = ProviderProfileSerializer(
                user.providerprofile
            ).data
        return Response(data)


# =====================================================
# 🌍 PUBLIC API: Bundesland / Region / Location
# =====================================================


class BundeslandViewSet(viewsets.ReadOnlyModelViewSet):
    """
    🇩🇪 Öffentliche API: gibt alle Bundesländer zurück.
    """

    queryset = Bundesland.objects.all().order_by("name")
    serializer_class = BundeslandSerializer
    permission_classes = [AllowAny]


class RegionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    🇩🇪 Öffentliche API: gibt Regionen zurück.
    Optionales Filter: ?bundesland=<id>
    """

    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        bundesland_id = self.request.query_params.get("bundesland")
        if bundesland_id:
            qs = qs.filter(land_id=bundesland_id)  # ✅ nach ID filtern
        return qs


@api_view(["GET"])
@permission_classes([AllowAny])
def get_location_by_plz(request):
    """
    🇩🇪 Liefert Orte zu einer PLZ.
    """
    plz = request.GET.get("plz")
    if not plz:
        return Response([], status=400)

    matches = PlzOrt.objects.filter(plz=plz)
    data = [{"id": p.id, "plz": p.plz, "ort": p.ort} for p in matches]
    return Response(data)


@api_view(["GET"])
@permission_classes([AllowAny])
def strassen_lookup(request):
    """
    🇩🇪 Liefert Straßennamen für einen PLZ-Ort (ID).
    """
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
                return Response(
                    {"detail": "Diese E-Mail wurde bereits bestätigt."}, status=400
                )
            if lead.used_for_request:
                return Response(
                    {"detail": "Diese E-Mail wurde bereits verwendet."}, status=403
                )

            token = secrets.token_urlsafe(32)
            lead.token = token
            lead.consent_given = consent
            lead.validated = False
            lead.used_for_request = False
            lead.save()

            from core.utils.email import send_guest_confirmation_email

            send_guest_confirmation_email(email, token)
            return Response(
                {"detail": "Bestätigungs-E-Mail wurde gesendet."}, status=200
            )

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
            return Response(
                {"detail": "❌ Ungültiger oder abgelaufener Link."}, status=400
            )

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
        serializer = GuestRequestSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "✅ Anfrage erfolgreich empfangen."}, status=201
            )

        logger.error(f"Serializer errors: {serializer.errors}")
        return Response({"errors": serializer.errors}, status=400)
