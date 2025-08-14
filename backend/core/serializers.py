# 📁 core/serializers.py
# 🇩🇪 Alle Kommentare und Feldnamen sind in Deutsch für klare Dokumentation.

from rest_framework import serializers
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import (
    User, Subscription, ServiceType, ProviderProfile, Request, Offer,
    Lead, RequestImage, Bundesland, Region
)

# 🔄 Benutzer-Modell abrufen
User = get_user_model()


# ============================================================
# 👤 Benutzer-Serializer – Basisdaten für eingeloggte Nutzer
# ============================================================
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id", "email", "username",
            "is_client", "is_provider", "current_mode",
            "region", "postal_code", "subscription"
        ]


# ============================================================
# 📝 Registrierung – inkl. Upgrade von GAST zu aktiviertem Nutzer
# ============================================================
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)  # Passwortbestätigung

    class Meta:
        model = User
        fields = ("username", "email", "password", "password2")

    def validate(self, data):
        """🇩🇪 Prüft, ob beide Passwörter übereinstimmen."""
        if data["password"] != data["password2"]:
            raise serializers.ValidationError({"password": "Passwörter stimmen nicht überein."})
        return data

    def create(self, validated_data):
        """🇩🇪 Erstellt neuen Nutzer oder aktiviert GAST-Account."""
        password = validated_data.pop("password")
        validated_data.pop("password2")
        email = validated_data.get("email")
        username = validated_data.get("username")

        try:
            # 🔄 Falls Nutzer schon existiert, aber inaktiv (GAST)
            existing_user = User.objects.get(email=email)
            if not existing_user.is_active:
                existing_user.username = username
                existing_user.set_password(password)
                existing_user.is_active = True
                existing_user.save()
                return existing_user
            else:
                raise serializers.ValidationError({"email": "Diese E-Mail wird bereits verwendet."})

        except User.DoesNotExist:
            # 🆕 Neuer Nutzer
            return User.objects.create_user(
                username=username,
                email=email,
                password=password
            )


# ============================================================
# 💳 Abonnement-Serializer
# ============================================================
class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ["id", "is_active", "created_at", "expires_at"]


# ============================================================
# 🛠 Dienstleistungsarten
# ============================================================
class ServiceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceType
        fields = ["id", "name", "category"]


# ============================================================
# 👨‍🔧 Anbieterprofil – inkl. Dienstleistungs-Zuordnung
# ============================================================
class ProviderProfileSerializer(serializers.ModelSerializer):
    services = ServiceTypeSerializer(many=True, read_only=True)
    service_ids = serializers.PrimaryKeyRelatedField(
        queryset=ServiceType.objects.all(), many=True, write_only=True, source="services"
    )

    class Meta:
        model = ProviderProfile
        fields = ["id", "user", "coverage_area", "services", "service_ids"]


# ============================================================
# 📩 Kundenanfrage – Standardformular für eingeloggte Nutzer
# ============================================================
class RequestSerializer(serializers.ModelSerializer):
    client_email = serializers.EmailField(source="client.email", read_only=True)
    client = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), allow_null=True, required=False
    )

    class Meta:
        model = Request
        fields = ["id", "client", "client_email", "service_type", "description", "location", "created_at"]

    def validate_client(self, value):
        """🇩🇪 Falls leer, wird None zurückgegeben."""
        if value == "":
            return None
        return value


# ============================================================
# 💬 Angebote von Anbietern
# ============================================================
class OfferSerializer(serializers.ModelSerializer):
    provider_email = serializers.EmailField(source="provider.email", read_only=True)

    class Meta:
        model = Offer
        fields = ["id", "request", "provider", "provider_email", "message", "accepted", "created_at"]


# ============================================================
# 🌍 Bundesland & 🗺 Region – Dropdowns im Formular
# ============================================================
class BundeslandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bundesland
        fields = ["id", "name"]
        read_only_fields = ["id"]


class RegionSerializer(serializers.ModelSerializer):
    bundesland = serializers.StringRelatedField()

    class Meta:
        model = Region
        fields = ["id", "name", "bundesland"]


# ============================================================
# 📥 GAST-Anfrage – inkl. Bild-Upload & Serviceauswahl
# ============================================================
class GuestRequestSerializer(serializers.Serializer):
    token = serializers.CharField(write_only=True)
    email = serializers.EmailField()
    vorname = serializers.CharField()
    nachname = serializers.CharField()
    telefon = serializers.CharField()
    firmenname = serializers.CharField()
    strasse = serializers.CharField()
    hausnummer = serializers.CharField()
    plz = serializers.CharField()
    stadt = serializers.CharField()
    land = serializers.CharField()
    region = serializers.CharField()
    beschreibung = serializers.CharField(allow_blank=True)
    services = serializers.ListField(child=serializers.IntegerField())
    bilder = serializers.ListField(
        child=serializers.ImageField(), required=False, allow_empty=True
    )

    def create(self, validated_data):
        """🇩🇪 Erstellt eine neue Anfrage basierend auf GAST-Daten."""
        bilder = validated_data.pop("bilder", [])
        service_ids = validated_data.pop("services", [])
        token = validated_data.pop("token", None)

        location = f"{validated_data['strasse']} {validated_data['hausnummer']}, " \
                   f"{validated_data['plz']} {validated_data['stadt']}, " \
                   f"{validated_data['region']}, {validated_data['land']}"

        if not token:
            raise serializers.ValidationError("❌ Kein Token übergeben.")

        try:
            lead = Lead.objects.get(token=token, validated=True, used_for_request=False)
        except Lead.DoesNotExist:
            raise serializers.ValidationError("❌ Ungültiger oder bereits genutzter Token.")

        email = lead.email
        user, _ = User.objects.get_or_create(
            email=email,
            defaults={"username": email.split("@")[0], "is_active": False}
        )

        service_objs = ServiceType.objects.filter(id__in=service_ids)
        if not service_objs.exists():
            raise serializers.ValidationError("❌ Mindestens ein gültiger Service ist erforderlich.")

        main_service = service_objs.first()

        try:
            request_obj = Request.objects.create(
                client=user,
                service_type=main_service,
                description=validated_data.get("beschreibung", ""),
                location=location
            )
            request_obj.services.set(service_objs)

            for image in bilder:
                RequestImage.objects.create(request=request_obj, image=image)

            lead.used_for_request = True
            lead.save()

        except Exception as e:
            raise serializers.ValidationError(f"❌ Fehler beim Speichern der Anfrage: {str(e)}")

        return request_obj


# ============================================================
# 📧 Lead-Initialisierung (GAST Start-Formular)
# ============================================================
class LeadInitiateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    consent = serializers.BooleanField()


# ============================================================
# 🔑 JWT-Login mit E-Mail & Aktivierungsprüfung
# ============================================================
class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "username"  # ⚠️ folosim direct username

    def validate(self, attrs):
        raw_username = (attrs.get("username") or "").strip()
        password = attrs.get("password")

        if not raw_username or not password:
            raise serializers.ValidationError({"detail": "Benutzername und Passwort sind erforderlich."})

        try:
            # 🔍 Caută fie după username, fie după email (fallback)
            try:
                user = User.objects.get(username__iexact=raw_username)
            except User.DoesNotExist:
                user = User.objects.get(email__iexact=raw_username)
        except User.DoesNotExist:
            raise serializers.ValidationError({"detail": "Benutzer nicht gefunden."})

        if not getattr(user, "is_active", False):
            raise serializers.ValidationError({"detail": "Konto ist noch nicht aktiviert. Bitte E-Mail bestätigen."})

        if not check_password(password, user.password):
            raise serializers.ValidationError({"detail": "Ungültige Anmeldedaten."})

        payload_for_parent = {
            self.username_field: getattr(user, self.username_field, user.get_username()),
            "password": password,
        }
        return super().validate(payload_for_parent)