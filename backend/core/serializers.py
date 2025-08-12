# 📁 core/serializers.py

from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from .models import (
    User, Subscription, ServiceType,
    ProviderProfile, Request, Offer, Lead, RequestImage,
    Bundesland, Region
)

User = get_user_model()

# 🔐 Benutzer-Serializer (eingeloggte Nutzer)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id", "email", "username",
            "is_client", "is_provider", "current_mode",
            "region", "postal_code", "subscription"
        ]

# 📝 Registrierung eines neuen Nutzers (mit verschlüsseltem Passwort)
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = [
            "id", "email", "username", "password",
            "is_client", "is_provider", "region", "postal_code"
        ]

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        return super().create(validated_data)

# 📨 Lead-Initiierung (GAST-E-Mail + DSGVO-Zustimmung)
class LeadInitiateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    consent = serializers.BooleanField()

    def validate(self, data):
        if not data["consent"]:
            raise serializers.ValidationError("Zustimmung zur Datenverarbeitung ist erforderlich.")
        return data

# 💳 Abonnement-Serializer
class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ["id", "is_active", "created_at", "expires_at"]

# 🛠 Dienstleistungsarten
class ServiceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceType
        fields = ["id", "name", "category"]

# 👨‍🔧 Anbieterprofil (inkl. Dienstleistungs-Zuordnung)
class ProviderProfileSerializer(serializers.ModelSerializer):
    services = ServiceTypeSerializer(many=True, read_only=True)
    service_ids = serializers.PrimaryKeyRelatedField(
        queryset=ServiceType.objects.all(), many=True, write_only=True, source="services"
    )

    class Meta:
        model = ProviderProfile
        fields = ["id", "user", "coverage_area", "services", "service_ids"]

# 📩 Kundenanfrage
class RequestSerializer(serializers.ModelSerializer):
    client_email = serializers.EmailField(source="client.email", read_only=True)
    client = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        allow_null=True,
        required=False
    )

    class Meta:
        model = Request
        fields = ["id", "client", "client_email", "service_type", "description", "location", "created_at"]

    def validate_client(self, value):
        if value == "":
            return None
        return value



# 💬 Angebote von Anbietern
class OfferSerializer(serializers.ModelSerializer):
    provider_email = serializers.EmailField(source="provider.email", read_only=True)

    class Meta:
        model = Offer
        fields = ["id", "request", "provider", "provider_email", "message", "accepted", "created_at"]

# 🌍 Bundesland-Serializer
class BundeslandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bundesland
        fields = ["id", "name"]
        read_only_fields = ["id"]

# 🗺️ Region-Serializer
class RegionSerializer(serializers.ModelSerializer):
    bundesland = serializers.StringRelatedField()

    class Meta:
        model = Region
        fields = ["id", "name", "bundesland"]

# 📥 GAST-Anfrage mit Bildern (FormData)
class GuestRequestSerializer(serializers.Serializer):
    token = serializers.CharField(write_only=True)  # 🔐 Token aus localStorage
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
        # 🔄 Bilder und Services extrahieren
        bilder = validated_data.pop("bilder", [])
        service_ids = validated_data.pop("services", [])
        token = validated_data.pop("token", None)

        # 🧾 Adresse zusammensetzen
        location = f"{validated_data['strasse']} {validated_data['hausnummer']}, " \
                   f"{validated_data['plz']} {validated_data['stadt']}, " \
                   f"{validated_data['region']}, {validated_data['land']}"

        # 🔐 Lead validieren
        if not token:
            raise serializers.ValidationError("❌ Kein Token übergeben.")

        try:
            lead = Lead.objects.get(token=token, validated=True, used_for_request=False)
        except Lead.DoesNotExist:
            raise serializers.ValidationError("❌ Ungültiger oder bereits genutzter Token.")

        email = lead.email

        # 👤 Benutzer erstellen oder abrufen
        user, _ = User.objects.get_or_create(
            email=email,
            defaults={"username": email.split("@")[0], "is_active": False}
        )

        # ✅ Services validieren
        service_objs = ServiceType.objects.filter(id__in=service_ids)
        if not service_objs.exists():
            raise serializers.ValidationError("❌ Mindestens ein gültiger Service ist erforderlich.")

        main_service = service_objs.first()

        # 📝 Anfrage speichern (innerhalb eines try/except)
        try:
            request_obj = Request.objects.create(
                client=user,
                service_type=main_service,
                description=validated_data.get("beschreibung", ""),
                location=location
            )

            # ➕ Zusätzliche Services setzen
            request_obj.services.set(service_objs)

            # 📸 Bilder speichern
            for image in bilder:
                RequestImage.objects.create(request=request_obj, image=image)

            # ✅ Nur jetzt token als benutzt markieren
            lead.used_for_request = True
            lead.save()

        except Exception as e:
            # Falls etwas schiefläuft, wird token NICHT verwendet
            raise serializers.ValidationError(f"❌ Fehler beim Speichern der Anfrage: {str(e)}")

        return request_obj

