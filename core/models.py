from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class User(AbstractUser):
    is_client = models.BooleanField(default=False)
    is_provider = models.BooleanField(default=False)

class ServiceType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class ProviderProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='provider_profile')
    region = models.CharField(max_length=255)
    service = models.ManyToManyField(ServiceType)
    project_examples = models.TextField(blank=True, null=True)

class Request(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requests')
    service_type = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField()
    
    status_choices = [
        ('sent', 'Gesendet'),
        ('processing', 'In Bearbeitung'),
        ('connected', 'Verbunden mit Anbieter')
    ]            
    status = models.CharField(max_length=20, choices=status_choices, default='sent')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request {self.id} by {self.client.username}"

# ✅ Clasa corect poziționată – la același nivel
class ClientProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    institution_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    contact_function = models.CharField(max_length=100, blank=True)
    contact_phone = models.CharField(max_length=30)
    region = models.CharField(max_length=255)  # ex: Hessen – Gießen
    address = models.TextField()
    external_link = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.institution_name
