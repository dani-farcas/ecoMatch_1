from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import User, ServiceType, ProviderProfile, ClientProfile, Request
from backend.core.utils.email import send_confirmation_email
import re

# ========== USER SERIALIZERS ==========

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_client', 'is_provider']
        read_only_fields = ['id', 'is_client', 'is_provider']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text="Passwort des Benutzers"
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        label="Passwort bestätigen",
        help_text="Passwort zur Bestätigung erneut eingeben"
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'is_client', 'is_provider']

    def validate_username(self, value):
        # Permitem doar caractere acceptabile
        pattern = r'^[\w\s@./+-]+$'
        if not re.match(pattern, value):
            raise serializers.ValidationError(
                "Der Benutzername darf nur Buchstaben, Zahlen, Leerzeichen und @/./+/-/_ enthalten."
            )
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Dieser Benutzername ist bereits vergeben.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwörter stimmen nicht überein."})
        try:
            validate_password(attrs['password'])
        except DjangoValidationError as e:
            raise serializers.ValidationError({"password": e.messages})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')

        user = User(**validated_data)
        user.set_password(password)
        user.is_active = False  # dezactivăm contul până la confirmarea prin email
        user.save()

        send_confirmation_email(user)
        return user

# ========== SERVICE TYPE ==========

class ServiceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceType
        fields = ['id', 'name']

# ========== PROVIDER PROFILE ==========

class ProviderProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderProfile
        fields = '__all__'

# ========== CLIENT PROFILE ==========

class ClientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientProfile
        fields = '__all__'

# ========== REQUEST ==========

class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'
