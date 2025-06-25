from rest_framework import viewsets, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import User, ServiceType, ProviderProfile, Request
from .serializers import (
    UserSerializer,
    ServiceTypeSerializer,
    ProviderProfileSerializer,
    RequestSerializer,
    RegisterSerializer,  # Serializer für die Registrierung
)

# ViewSet für Benutzerverwaltung
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]  # Nur authentifizierte Benutzer dürfen zugreifen

# ViewSet für ServiceType-Verwaltung
class ServiceTypeViewSet(viewsets.ModelViewSet):
    queryset = ServiceType.objects.all()
    serializer_class = ServiceTypeSerializer
    permission_classes = [permissions.IsAuthenticated]

# ViewSet für ProviderProfile-Verwaltung
class ProviderProfileViewSet(viewsets.ModelViewSet):
    queryset = ProviderProfile.objects.all()
    serializer_class = ProviderProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        # Nur Nutzer mit Provider-Rolle dürfen Profile anlegen
        if not user.is_provider:
            raise PermissionDenied("Nur Nutzer mit Provider-Rolle dürfen ein Provider-Profil erstellen.")
        serializer.save(user=user)

    def get_queryset(self):
        user = self.request.user
        # Provider sehen nur ihr eigenes Profil
        if user.is_provider:
            return ProviderProfile.objects.filter(user=user)
        # Andere sehen alle Profile
        return ProviderProfile.objects.all()

# ViewSet für Request-Verwaltung
class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        # Nur Nutzer mit Client-Rolle dürfen Anfragen erstellen
        if not user.is_client:
            raise PermissionDenied("Nur Nutzer mit Client-Rolle dürfen Anfragen senden.")
        serializer.save(client=user)

    def get_queryset(self):
        user = self.request.user
        # Clients sehen nur ihre eigenen Anfragen
        if user.is_client:
            return Request.objects.filter(client=user)
        # Andere sehen alle Anfragen
        return Request.objects.all()

# API-View für Benutzerregistrierung (Signup)
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]  # Jeder darf sich registrieren

    def post(self, request):
        # Registrierungsdaten werden übergeben und validiert
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Neuer Benutzer wird angelegt
            return Response({
                "message": "Benutzer wurde erfolgreich registriert.",
                "user": UserSerializer(user).data  # Rückgabe der Benutzerdaten (ohne Passwort)
            }, status=status.HTTP_201_CREATED)
        # Bei Fehlern werden diese zurückgegeben
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
