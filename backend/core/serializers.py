from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import (
    User, Subscription, ServiceType,
    ProviderProfile, Request, Offer
)





# 🔐 Serializer für das benutzerdefinierte User-Modell
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username',
            'is_client', 'is_provider', 'current_mode',
            'region', 'postal_code', 'subscription'
        ]


# 💳 Serializer für das Abonnement-Modell
class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['id', 'is_active', 'created_at', 'expires_at']


# 🛠 Serializer für Dienstleistungsarten
class ServiceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceType
        fields = ['id', 'name']


# 🧑‍🔧 Serializer für ProviderProfile mit verknüpften Dienstleistungen
class ProviderProfileSerializer(serializers.ModelSerializer):
    services = ServiceTypeSerializer(many=True, read_only=True)
    service_ids = serializers.PrimaryKeyRelatedField(
        queryset=ServiceType.objects.all(), many=True, write_only=True, source='services'
    )

    class Meta:
        model = ProviderProfile
        fields = ['id', 'user', 'coverage_area', 'services', 'service_ids']


# 📩 Serializer für Client-Anfragen
class RequestSerializer(serializers.ModelSerializer):
    client_email = serializers.EmailField(source='client.email', read_only=True)

    class Meta:
        model = Request
        fields = ['id', 'client', 'client_email', 'service_type', 'description', 'location', 'created_at']


# 💬 Serializer für Provider-Angebote
class OfferSerializer(serializers.ModelSerializer):
    provider_email = serializers.EmailField(source='provider.email', read_only=True)

    class Meta:
        model = Offer
        fields = ['id', 'request', 'provider', 'provider_email', 'message', 'accepted', 'created_at']

        
# 📝 Serializer zur Benutzerregistrierung mit Rollenwahl
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'password',
            'is_client', 'is_provider', 'region', 'postal_code'
        ]

    def create(self, validated_data):
        # Passwort verschlüsseln
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)