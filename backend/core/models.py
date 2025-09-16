from django.contrib.auth.models import AbstractUser
from django.db import models


# 🔐 Benutzerdefiniertes User-Modell (Standard: alle sind Clients, Provider über ProviderProfile)
class User(AbstractUser):
    email = models.EmailField(unique=True)  # eindeutige E-Mail
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    street = models.CharField(max_length=255, blank=True, null=True)
    house_number = models.CharField(max_length=10, blank=True, null=True)
    postal_code = models.CharField(max_length=10, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    

    # Geografische Zuordnung
    region = models.ForeignKey(
        "Region", on_delete=models.SET_NULL, null=True, blank=True
    )

    # Abonnement (optional, 1:1 zum User)
    subscription = models.OneToOneField(
        "Subscription",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="user",
    )

    # Standard ist Client, Provider wird durch ProviderProfile erkannt
    current_mode = models.CharField(
        max_length=10, choices=[("provider", "Provider")], blank=True, null=True
    )

    # 🖼️ Profilbild des Benutzers
    profile_image = models.ImageField(
        upload_to="profile_images/",  # 📂 Ordner innerhalb von MEDIA_ROOT
        null=True,
        blank=True,
        verbose_name="Profilbild",
    )

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.email

    @property
    def is_provider(self):
        """Gibt True zurück, wenn der User ein ProviderProfile hat."""
        return hasattr(self, "providerprofile")


# 💳 Modell für Benutzer-Abonnements
class Subscription(models.Model):
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        status = "aktiv" if self.is_active else "inaktiv"
        return f"Abonnement ({status}), gültig bis: {self.expires_at}"


# 🛠 Modell für Dienstleistungstypen
class ServiceType(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# 🧑‍🔧 Provider-Profil mit Dienstleistungen und Abdeckungsgebiet
class ProviderProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="providerprofile"
    )
    firma = models.CharField(max_length=255, blank=True, null=True)

    # ✅ Neue Felder
    services = models.ManyToManyField(
        "ServiceType",
        related_name="providers",
        blank=True
    )
    coverage_regions = models.ManyToManyField(
        "Region",
        related_name="providers",
        blank=True
    )

    def __str__(self):
        return f"ProviderProfile({self.user.email})"

# 📨 Anfrage eines Users
class Request(models.Model):
    client = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="requests"
    )
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)
    services = models.ManyToManyField(ServiceType, related_name="requests", blank=True)

    # 🇩🇪 NEU: Pflichtfeld für klaren, durchsuchbaren Titel
    title = models.CharField(max_length=160)

    # 🇩🇪 Status für Workflow/Filter (einfach gehalten, erweiterbar)
    status = models.CharField(max_length=32, default="neu", blank=True)

    # 🇩🇪 Bestehend: Freitext-Beschreibung (lassen wir unverändert)
    description = models.TextField(blank=True)

    # 🇩🇪 Bestehend: Freitext-Ortsangabe (bleibt)
    location = models.CharField(max_length=255)

    # 🇩🇪 NEU: Schnappschuss der Adresse für Reporting/Filter (optional)
    plz = models.CharField(max_length=10, blank=True)
    stadt = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)
    land = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # 👇 behalten wir die bestehende Logik (kein Breaking Change)
        return f"Anfrage von {self.client} für {self.service_type} am {self.created_at}"


# 💬 Angebot eines Providers zu einer Anfrage
class Offer(models.Model):
    request = models.ForeignKey(
        Request, on_delete=models.CASCADE, related_name="offers"
    )
    provider = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="offers_sent"
    )
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    accepted = models.BooleanField(default=False)

    def __str__(self):
        status = "akzeptiert" if self.accepted else "offen"
        return f"Angebot von {self.provider} für Anfrage {self.request.id} ({status})"


# 👁️ Gastzugriffe nach IP
class AccessLog(models.Model):
    ip_address = models.GenericIPAddressField()
    view_type = models.CharField(max_length=20)  # 'provider' oder andere
    view_count = models.IntegerField(default=0)
    last_access = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Zugriffe {self.view_type} von {self.ip_address}: {self.view_count}"


# 🔐 Leads aus Gast-Anfragen
class Lead(models.Model):
    email = models.EmailField(unique=True)
    consent_given = models.BooleanField(default=False)
    token = models.CharField(max_length=64, unique=True, null=True, blank=True)
    validated = models.BooleanField(default=False)
    used_for_request = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


# 🟢 Bundesland
class Bundesland(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Bundesland"
        verbose_name_plural = "Bundesländer"

    def __str__(self):
        return self.name


# 🟢 Region
class Region(models.Model):
    name = models.CharField(max_length=100)
    land = models.ForeignKey(
        Bundesland, on_delete=models.CASCADE, related_name="regionen"
    )

    class Meta:
        unique_together = ("name", "land")
        verbose_name = "Region"
        verbose_name_plural = "Regionen"

    def __str__(self):
        return f"{self.name} ({self.land.name})"


# 🟢 PLZ + Ort
class PlzOrt(models.Model):
    plz = models.CharField(max_length=5)
    ort = models.CharField(max_length=100)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)
    land = models.ForeignKey(Bundesland, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("plz", "ort", "region")
        verbose_name = "PLZ + Ort"
        verbose_name_plural = "PLZ + Orte"

    def __str__(self):
        return f"{self.plz} {self.ort}"


# 🟢 Straße
class Strasse(models.Model):
    name = models.CharField(max_length=255)
    plz_ort = models.ForeignKey(
        PlzOrt, on_delete=models.CASCADE, related_name="strassen"
    )

    def __str__(self):
        return f"{self.name}, {self.plz_ort}"


# 🖼️ Bilder zu Anfragen
class RequestImage(models.Model):
    request = models.ForeignKey(
        Request, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="request_images/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Bild für Anfrage {self.request.id}"
