from django.contrib.auth.models import AbstractUser
from django.db import models

# 🔐 Benutzerdefiniertes User-Modell mit zusätzlichen Rollen- und Abonnementfeldern
class User(AbstractUser):
    email = models.EmailField(unique=True)

    # Rollenflags: Benutzer kann gleichzeitig Client und/oder Provider sein
    is_client = models.BooleanField(default=True)
    is_provider = models.BooleanField(default=False)

    # Aktiver Modus – wird im Frontend verwendet zum Umschalten der Ansicht
    current_mode = models.CharField(
        max_length=10,
        choices=[("client", "Client"), ("provider", "Provider")],
        default="client"
    )

    # Regionale Informationen für Matching und Filterung
    region = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=10, blank=True)

    # Verknüpfung zum aktiven Abonnement
    subscription = models.OneToOneField(
        "Subscription",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="user"
    )

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']  # Email bleibt Pflicht für Kompatibilität

    def __str__(self):
        return self.email


# 💳 Modell zur Verwaltung von Benutzerabonnements
class Subscription(models.Model):
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)


# 🛠️ Modell für Dienstleistungsarten (z. B. Gartenarbeit, Reinigung)
class ServiceType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# 🧑‍🔧 Provider-Profil mit zugeordneten Dienstleistungen und Abdeckungsgebiet
class ProviderProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    services = models.ManyToManyField(ServiceType)
    coverage_area = models.CharField(max_length=255)  # z. B. Landkreis, PLZ


# 📨 Client-Anfrage für eine bestimmte Dienstleistung
class Request(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name="requests")
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)


# 💬 Angebot eines Providers als Antwort auf eine Client-Anfrage
class Offer(models.Model):
    request = models.ForeignKey(Request, on_delete=models.CASCADE, related_name="offers")
    provider = models.ForeignKey(User, on_delete=models.CASCADE, related_name="offers_sent")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    accepted = models.BooleanField(default=False)


# 👁️ Tracking von Gastzugriffen basierend auf IP-Adresse
class AccessLog(models.Model):
    ip_address = models.GenericIPAddressField()
    view_type = models.CharField(max_length=20)  # 'client' oder 'provider'
    view_count = models.IntegerField(default=0)
    last_access = models.DateTimeField(auto_now=True)
