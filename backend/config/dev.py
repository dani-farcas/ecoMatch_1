# 📁 config/dev.py

from .base import *

# 🧪 Debug-Modus aktivieren (für Entwicklung)
DEBUG = True

# 🌐 Erlaube alle Hosts im lokalen Modus (für einfache Tests)
ALLOWED_HOSTS = ['*']

# 💾 Einfache SQLite-Datenbank für lokale Entwicklung
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# 📨 E-Mail-Backend auf SMTP umstellen für echten Versand
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# 📧 SMTP Einstellungen für Gmail
EMAIL_HOST = 'smtp.gmail.com'                 # SMTP Server von Gmail
EMAIL_PORT = 587                              # Port für TLS
EMAIL_USE_TLS = True                          # TLS aktivieren
EMAIL_HOST_USER = 'dlm33730@gmail.com'    # Deine Gmail-Adresse hier eintragen
EMAIL_HOST_PASSWORD = 'rfua wycw zolu gwpa'  # Dein Google App-Passwort hier eintragen

# 📤 Standard Absenderadresse für ausgehende E-Mails
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# 🌍 Frontend URL für Bestätigungslinks (z.B. Vercel Deployment)
FRONTEND_URL = "https://ecoMatch-10.vercel.app"

# 🔐 CORS-Konfiguration für lokale Entwicklung (Vite Default Port 5173)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://ecomatch-10.vercel.app",  
]

# ⚠️ Erlaube Credentials (Cookies, Auth Header) bei CORS
CORS_ALLOW_CREDENTIALS = True
