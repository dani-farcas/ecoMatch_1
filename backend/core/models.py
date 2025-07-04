from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    is_client = models.BooleanField(default=False)
    is_provider = models.BooleanField(default=False)

    # Poți adăuga alte câmpuri personalizate aici

class ServiceType(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class ProviderProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='provider_profile')
    region = models.CharField(max_length=100)
    service = models.ManyToManyField(ServiceType)
    project_examples = models.TextField(blank=True, default="")  # Am adăugat default="" pentru migrații

    def __str__(self):
        return f'ProviderProfile: {self.user.username}'

class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    # poți adăuga câmpuri specifice clientului aici

    def __str__(self):
        return f'ClientProfile: {self.user.username}'

class Request(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requests')
    service_type = models.ForeignKey(ServiceType, on_delete=models.SET_NULL, null=True)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Request from {self.client.username} - {self.status}'
