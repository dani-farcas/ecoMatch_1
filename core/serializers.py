from rest_framework import serializers
from .models import User, ServiceType, ProviderProfile, Request

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_client', 'is_provider']

class ServiceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceType
        fields = ['id', 'name']

class ProviderProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()  #includes info about user
    service = ServiceTypeSerializer(many=True)

    class Meta:
        model = ProviderProfile
        fields = ['id', 'user', 'region', 'service', 'project_examples']

class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'