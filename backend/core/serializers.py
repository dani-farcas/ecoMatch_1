# 📁 core/serializers.py
# 🇩🇪 Alle Kommentare und Feldnamen sind in Deutsch für klare Dokumentation.

from rest_framework import serializers
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import (
    User,
    Subscription,
    ServiceType,
    ProviderProfile,
    Request,
    Offer,
    Lead,
    RequestImage,
    Bundesland,
    Region,
)

# 🔄 Benutzer-Modell abrufen
User = get_user_model()


# ============================================================
# 👤 Benutzer-Serializer – Basisdaten für eingeloggte Nutzer
# ============================================================
class UserSerializer(serializers.ModelSerializer):
    """
    Serializer für eingeloggte Benutzer
    - Stellt die Felder so dar, wie das Frontend sie erwartet (deutsche Namen)
    - Input über englische Feldnamen (wie im Modell)
    """

    # Deutsche Aliase (read_only): werden im Output angezeigt
    telefon = serializers.CharField(source="phone_number", read_only=True)
    firma = serializers.CharField(source="company", read_only=True)
    strasse = serializers.CharField(source="street", read_only=True)
    hausnummer = serializers.CharField(source="house_number", read_only=True)
    plz = serializers.CharField(source="postal_code", read_only=True)
    stadt = serializers.CharField(source="city", read_only=True)

    # Englische Felder (write_only): werden für Input erwartet
    phone_number = serializers.CharField(
        write_only=True, required=False, allow_blank=True
    )
    company = serializers.CharField(write_only=True, required=False, allow_blank=True)
    street = serializers.CharField(write_only=True, required=False, allow_blank=True)
    house_number = serializers.CharField(
        write_only=True, required=False, allow_blank=True
    )
    postal_code = serializers.CharField(
        write_only=True, required=False, allow_blank=True
    )
    city = serializers.CharField(write_only=True, required=False, allow_blank=True)

    land = serializers.CharField(allow_blank=True, required=False)
    ueber_mich = serializers.CharField(allow_blank=True, required=False)

    profile_image = serializers.ImageField(required=False, allow_null=True)
    has_providerprofile = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            # Aliase für Output
            "telefon",
            "firma",
            "strasse",
            "hausnummer",
            "plz",
            "stadt",
            # Original-Felder für Input
            "phone_number",
            "company",
            "street",
            "house_number",
            "postal_code",
            "city",
            "land",
            "region",
            "ueber_mich",
            "subscription",
            "current_mode",
            "has_providerprofile",
            "avatar_url",
            "profile_image",
        ]

    def get_has_providerprofile(self, obj):
        return hasattr(obj, "providerprofile")

    def get_avatar_url(self, obj):
        request = self.context.get("request")
        if obj.profile_image and hasattr(obj.profile_image, "url"):
            return request.build_absolute_uri(obj.profile_image.url)
        return None


# ============================================================
# 📝 Registrierung – inkl. GAST→aktiv (tolerant gegenüber Zusatzfeldern)
# ============================================================
class RegisterSerializer(serializers.ModelSerializer):
    # Pflichtfelder
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    # Optionale Felder, die vom Frontend gesendet werden können
    # (werden aktuell nicht verarbeitet, nur toleriert)
    avatar = serializers.DictField(write_only=True, required=False)
    photos = serializers.ListField(
        child=serializers.DictField(), write_only=True, required=False, allow_empty=True
    )

    class Meta:
        model = User
        fields = ("username", "email", "password", "password2", "avatar", "photos")

    def validate(self, data):
        # 🇩🇪 Passwörter müssen übereinstimmen
        if data["password"] != data["password2"]:
            raise serializers.ValidationError(
                {"password": "Passwörter stimmen nicht überein."}
            )
        return data

    def create(self, validated_data):
        # 🇩🇪 Unbenutzte Zusatzfelder verwerfen
        validated_data.pop("avatar", None)
        validated_data.pop("photos", None)

        password = validated_data.pop("password")
        validated_data.pop("password2")
        email = validated_data.get("email")
        username = validated_data.get("username")

        # 🇩🇪 Bestehenden, inaktiven GAST aktivieren oder neuen Benutzer anlegen
        try:
            existing_user = User.objects.get(email=email)
            if not existing_user.is_active:
                existing_user.username = username
                existing_user.set_password(password)
                existing_user.is_active = True
                existing_user.save()
                return existing_user
            # 🇩🇪 Bereits aktiver Benutzer mit gleicher E-Mail
            raise serializers.ValidationError(
                {"email": "Diese E-Mail wird bereits verwendet."}
            )
        except User.DoesNotExist:
            return User.objects.create_user(
                username=username, email=email, password=password
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


class ServiceTypeMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceType
        fields = ["id", "name"]


# ============================================================
# 👨‍🔧 Anbieterprofil – inkl. Dienstleistungs-Zuordnung
# ============================================================
# ============================================================
# 👨‍🔧 Anbieterprofil – inkl. Dienstleistungs- & Regions-Zuordnung
# ============================================================
class ProviderProfileSerializer(serializers.ModelSerializer):
    # Services → lesbar (Objekte)
    services = ServiceTypeSerializer(many=True, read_only=True)
    # Services → schreibbar (IDs)
    service_ids = serializers.PrimaryKeyRelatedField(
        queryset=ServiceType.objects.all(),
        many=True,
        write_only=True,
        source="services",
    )

    # Regionen → lesbar (Objekte)
    coverage_regions = serializers.StringRelatedField(many=True, read_only=True)
    # Regionen → schreibbar (IDs)
    coverage_region_ids = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(),
        many=True,
        write_only=True,
        source="coverage_regions",
    )

    class Meta:
        model = ProviderProfile
        fields = [
            "id",
            "user",
            "firma",
            "services",
            "service_ids",
            "coverage_regions",
            "coverage_region_ids",
        ]


# ============================================================
# 📩 Kundenanfrage – API für eingeloggte Nutzer (GET/POST)
# ============================================================
class RequestSerializer(serializers.ModelSerializer):
    # 🇩🇪 Read-only: Services als kompakte Objekte (id, name)
    services = ServiceTypeMiniSerializer(many=True, read_only=True)

    # 🇩🇪 Write-only: IDs zum Setzen der M2M-Beziehung
    service_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        write_only=True,
        queryset=ServiceType.objects.all(),
        source="services",
        required=False,
    )

    # 🇩🇪 API-Feld „beschreibung” ↔ Modellfeld „description”
    beschreibung = serializers.CharField(
        source="description", required=False, allow_blank=True
    )

    # 🇩🇪 Bilder nur als Liste von URLs (read-only)
    images = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Request
        fields = [
            "id",
            "title",
            "created_at",
            "status",
            "plz",
            "stadt",
            "region",
            "land",
            "beschreibung",
            "services",
            "service_ids",  # nur für POST/PUT/PATCH
            "images",  # read-only
        ]
        read_only_fields = ["id", "created_at", "services", "images"]

    # 🇩🇪 Bild-URLs sammeln (falls vorhanden)
    def get_images(self, obj):
        return [img.image.url for img in obj.images.all()]

    # 🇩🇪 service_type automatisch aus service_ids setzen
    def create(self, validated_data):
        services = validated_data.pop("services", [])
        if not services:
            raise serializers.ValidationError(
                {"services": "Mindestens ein Service ist erforderlich."}
            )

        main_service = services[0]  # erster Service als Hauptservice
        request = Request.objects.create(service_type=main_service, **validated_data)
        request.services.set(services)
        return request


# ============================================================
# 💬 Angebote von Anbietern
# ============================================================
class OfferSerializer(serializers.ModelSerializer):
    provider_email = serializers.EmailField(source="provider.email", read_only=True)

    class Meta:
        model = Offer
        fields = [
            "id",
            "request",
            "provider",
            "provider_email",
            "message",
            "accepted",
            "created_at",
        ]


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

        location = (
            f"{validated_data['strasse']} {validated_data['hausnummer']}, "
            f"{validated_data['plz']} {validated_data['stadt']}, "
            f"{validated_data['region']}, {validated_data['land']}"
        )

        if not token:
            raise serializers.ValidationError("❌ Kein Token übergeben.")

        try:
            lead = Lead.objects.get(token=token, validated=True, used_for_request=False)
        except Lead.DoesNotExist:
            raise serializers.ValidationError(
                "❌ Ungültiger oder bereits genutzter Token."
            )

        email = lead.email
        user, _ = User.objects.get_or_create(
            email=email, defaults={"username": email.split("@")[0], "is_active": False}
        )

        service_objs = ServiceType.objects.filter(id__in=service_ids)
        if not service_objs.exists():
            raise serializers.ValidationError(
                "❌ Mindestens ein gültiger Service ist erforderlich."
            )

        main_service = service_objs.first()

        try:
            request_obj = Request.objects.create(
                client=user,
                service_type=main_service,
                description=validated_data.get("beschreibung", ""),
                location=location,
            )
            request_obj.services.set(service_objs)

            for image in bilder:
                RequestImage.objects.create(request=request_obj, image=image)

            lead.used_for_request = True
            lead.save()

        except Exception as e:
            raise serializers.ValidationError(
                f"❌ Fehler beim Speichern der Anfrage: {str(e)}"
            )

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
    username_field = "username"  # ⚠️ wir akzeptieren sowohl username als auch email

    def validate(self, attrs):
        raw_username = (attrs.get("username") or "").strip()
        password = attrs.get("password")

        if not raw_username or not password:
            raise serializers.ValidationError(
                {"detail": "Benutzername und Passwort sind erforderlich."}
            )

        try:
            # 🔍 Suche nach Username oder E-Mail
            try:
                user = User.objects.get(username__iexact=raw_username)
            except User.DoesNotExist:
                user = User.objects.get(email__iexact=raw_username)
        except User.DoesNotExist:
            raise serializers.ValidationError({"detail": "Benutzer nicht gefunden."})

        if not getattr(user, "is_active", False):
            raise serializers.ValidationError(
                {"detail": "Konto ist noch nicht aktiviert. Bitte E-Mail bestätigen."}
            )

        if not check_password(password, user.password):
            raise serializers.ValidationError({"detail": "Ungültige Anmeldedaten."})

        payload_for_parent = {
            self.username_field: getattr(
                user, self.username_field, user.get_username()
            ),
            "password": password,
        }
        return super().validate(payload_for_parent)
