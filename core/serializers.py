from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, ServiceType, ProviderProfile, Request, ClientProfile
from core.utils.email import send_confirmation_email
import re

# 🔐 Serializator pentru utilizator (read-only)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_client', 'is_provider']

# ✅ Serializator pentru ServiceType
class ServiceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceType
        fields = ['id', 'name']

# 🧑‍🔧 Serializator pentru ProviderProfile (cu nested user + servicii)
class ProviderProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    service = ServiceTypeSerializer(many=True)

    class Meta:
        model = ProviderProfile
        fields = ['id', 'user', 'region', 'service', 'project_examples']

# 🧑‍💼 Serializator pentru ClientProfile
class ClientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientProfile
        fields = '__all__'
        read_only_fields = ['user']

# 📨 Serializator pentru cereri (Request)
class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'
        read_only_fields = ['client', 'status', 'created_at']

# 📝 Serializator pentru înregistrare (cu validări)
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
        validate_password(attrs['password'])
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')

        user = User(**validated_data)
        user.set_password(password)
        user.is_active = False
        user.save()

        print(f"✅ Email wird gesendet an: {user.email}")
        send_confirmation_email(user)

        return user
