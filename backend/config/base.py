import os
from pathlib import Path
from datetime import timedelta

# 🗂 Basisverzeichnis des Projekts
BASE_DIR = Path(__file__).resolve().parent.parent

# 🔐 Django-Geheimschlüssel (in .env Datei auslagern in Produktion)
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-dev-key')

# 🌐 Allgemeine erlaubte Hosts (in dev offen, in prod restriktiv)
ALLOWED_HOSTS = []

# 🧩 Installierte Apps
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # 📦 Drittanbieter
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',

    # 🧠 Eigene Apps
    'core',
]

# ⚙️ Middleware-Konfiguration
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # 🌍 CORS-Unterstützung
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# 🔗 Wurzel-URL-Konfiguration
ROOT_URLCONF = 'config.urls'

# 📦 Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# 🧠 WSGI-Startpunkt
WSGI_APPLICATION = 'config.wsgi.application'

# 🔧 Benutzerdefiniertes User-Modell
AUTH_USER_MODEL = 'core.User'

# 🔐 Authentifizierung mit JWT (SimpleJWT)
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# 🌍 Lokalisierung & Zeitzone
LANGUAGE_CODE = 'de-de'
TIME_ZONE = 'Europe/Berlin'
USE_I18N = True
USE_TZ = True

# 📁 Statische Dateien
STATIC_URL = 'static/'

# 💾 Standard-Datenbank (wird in dev/prod überschrieben)
DATABASES = {}

# 📨 E-Mail-Einstellungen
# ⚠️ In Produktion wird SMTP in prod.py überschrieben
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# 📧 Standardabsender für E-Mails
DEFAULT_FROM_EMAIL = "ecoMatch <dlm33730@gmail.com>"

# 🌐 URL zur Bestätigungsseite im Frontend (wird im Bestätigungs-E-Mail verwendet)
FRONTEND_URL = "http://localhost:5173"
