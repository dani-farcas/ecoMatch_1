✅ Was bisher erledigt wurde
🔧 Backend (Django + DRF)
 Django-Projekt + App core erstellt

 Benutzerdefiniertes User-Modell mit Rollen: is_client, is_provider

 Datenmodelle implementiert:

ServiceType

ProviderProfile

Request

 ViewSets für:

User (inkl. Registrierung mit RegisterSerializer)

ServiceType

ProviderProfile

Request

 E-Mail-Bestätigung implementiert:

Token-Generierung

Versand per Gmail (App Password)

Link zur Aktivierung des Kontos: api/confirm-email/<token>/

 Aktivierung des Kontos nach Klick: user.is_active = True

 .env-Datei eingerichtet + Variablen in settings.py geladen

 Alle API-Routen sauber mit DefaultRouter registriert

💻 Frontend (React + TypeScript)
 React-Projekt mit TypeScript eingerichtet

 Komponenten:

Signup.tsx mit Validierung, Dark Mode, Show/Hide Passwort

Login.tsx (funktioniert, nutzt JWT)

ConfirmEmail.tsx mit Rückmeldung + Button „Zum Login”

ProtectedRoute.tsx zur Absicherung geschützter Routen

 JWT-Authentifizierung vollständig eingerichtet

 Registrierung inkl. Bestätigung per E-Mail funktioniert

 Nach Bestätigung erscheint Erfolgsmeldung + Login-Button

🔜 Nächste Schritte
🎯 Für Kunden (Clients):
 Dashboard für Kunden mit:

Anfrageformular (Request)

Anfrage senden an /api/requests/

 Anzeige: eigene Anfragen (optional)

🎯 Für Dienstleister (Provider):
 Dashboard für Anbieter:

Erstellen + Bearbeiten des ProviderProfile

Auswahl von ServiceType

Angabe der Region

🤝 Matching-Funktion:
 Backend-Logik für automatisches Matching:

nach Region + ServiceType

📬 Benachrichtigungen:
 E-Mail an Anbieter bei passender Anfrage

⚙️ Admin-Funktionen:
 Django Admin-Panel für Superuser

 Verwaltung von Usern, Anfragen, Profilen

🧪 Tests:
 API-Tests mit Postman

 End-to-End Tests im Frontend

