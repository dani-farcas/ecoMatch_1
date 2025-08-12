from django.contrib.auth.models import AbstractUser
from django.db import models

# 🔐 Benutzerdefiniertes User-Modell mit erweiterten Rollen- und Abo-Feldern
class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    
    # Relații geografice corecte
    region = models.ForeignKey("Region", on_delete=models.SET_NULL, null=True, blank=True)
    postal_code = models.CharField(max_length=10, blank=True, null=True)

    # Abonament (unic)
    subscription = models.OneToOneField(
        "Subscription",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="user"
    )

    # Roluri și moduri de utilizare
    is_client = models.BooleanField(default=True)
    is_provider = models.BooleanField(default=False)

    current_mode = models.CharField(
        max_length=10,
        choices=[("client", "Client"), ("provider", "Provider")],
        default="client"
    )

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.email


# 💳 Modell für Benutzer-Abonnements
class Subscription(models.Model):
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        status = "aktiv" if self.is_active else "inaktiv"
        return f"Abonnement ({status}), gültig bis: {self.expires_at}"


# 🛠 Modell für verschiedene Dienstleistungstypen (z.B. Gartenarbeit, Reinigung)
# core/models.py
class ServiceType(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# 🧑‍🔧 Profil eines Providers mit zugeordneten Dienstleistungen und Abdeckungsgebieten
class ProviderProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    services = models.ManyToManyField(ServiceType)
    coverage_area = models.CharField(max_length=255)  # z.B. Landkreis, PLZ

    def __str__(self):
        return f"Provider-Profil von {self.user}"


# 📨 Anfrage eines Clients für eine Dienstleistung
class Request(models.Model):
    client = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="requests")
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)
    services = models.ManyToManyField(ServiceType, related_name="requests", blank=True)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Anfrage von {self.client} für {self.service_type} am {self.created_at}"


# 💬 Angebot eines Providers als Antwort auf eine Client-Anfrage
class Offer(models.Model):
    request = models.ForeignKey(Request, on_delete=models.CASCADE, related_name="offers")
    provider = models.ForeignKey(User, on_delete=models.CASCADE, related_name="offers_sent")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    accepted = models.BooleanField(default=False)

    def __str__(self):
        status = "akzeptiert" if self.accepted else "offen"
        return f"Angebot von {self.provider} für Anfrage {self.request.id} ({status})"


# 👁️ Tracking der Zugriffe von Gästen via IP-Adresse, mit Zählung
class AccessLog(models.Model):
    ip_address = models.GenericIPAddressField()
    view_type = models.CharField(max_length=20)  # 'client' oder 'provider'
    view_count = models.IntegerField(default=0)
    last_access = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Zugriffe {self.view_type} von {self.ip_address}: {self.view_count}"


# 🔐 Speicherung von Leads (Gast-Anfragen) mit DSGVO-Zustimmung und Token-Verwaltung
class Lead(models.Model):
    email = models.EmailField(unique=True)
    consent_given = models.BooleanField(default=False)  # DSGVO-Zustimmung
    token = models.CharField(max_length=64, unique=True, null=True, blank=True)
    validated = models.BooleanField(default=False)        # Email bestätigt?
    used_for_request = models.BooleanField(default=False) # Anfrage gestellt?
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


# 🟢 Bundesland (z.B. Hessen, Bayern)
class Bundesland(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Bundesland"
        verbose_name_plural = "Bundesländer"

    def __str__(self):
        return self.name


# 🟢 Region (z.B. Darmstadt, Oberbayern), zugeordnet zu einem Bundesland
class Region(models.Model):
    name = models.CharField(max_length=100)
    land = models.ForeignKey(Bundesland, on_delete=models.CASCADE, related_name="regionen")

    class Meta:
        unique_together = ("name", "land")
        verbose_name = "Region"
        verbose_name_plural = "Regionen"

    def __str__(self):
        return f"{self.name} ({self.land.name})"


# 🟢 Postleitzahl + Ort, zugeordnet zu Region und Bundesland
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


# 🟢 Straße, zugeordnet zu PLZ + Ort (1:N Beziehung)
class Strasse(models.Model):
    name = models.CharField(max_length=255)
    plz_ort = models.ForeignKey(PlzOrt, on_delete=models.CASCADE, related_name="strassen")

    def __str__(self):
        return f"{self.name}, {self.plz_ort}"


# 🖼️ Hochgeladene Bilder zu einer Anfrage
class RequestImage(models.Model):
    request = models.ForeignKey(Request, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="request_images/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Bild für Anfrage {self.request.id}"
