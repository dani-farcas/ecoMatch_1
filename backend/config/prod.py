# 🔁 Importiere benötigte Module
from pathlib import Path
import os
from dotenv import load_dotenv

# 🔐 Lade Umgebungsvariablen aus .env
load_dotenv()

# 📁 Projektverzeichnis
BASE_DIR = Path(__file__).resolve().parent.parent

# 🔑 Geheimer Schlüssel (aus Umgebungsvariable)
SECRET_KEY = os.getenv("SECRET_KEY", "unsicherer-default")

# 🚫 Debug-Modus deaktivieren (für Produktion)
DEBUG = False

# 🌍 Erlaubte Hosts (aus Umgebungsvariable)
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "*").split(",")

# 🧩 Installierte Apps
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "core",  # ⛏️ Ersetze durch deinen App-Namen
]

# 🧱 Middleware-Konfiguration
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# 🔀 URL-Konfiguration
ROOT_URLCONF = "config.urls"

# 🎨 Templates (HTML-Rendering)
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# 🔥 WSGI-Anwendung (für gunicorn)
WSGI_APPLICATION = "config.wsgi.application"

# 🗃️ Datenbank (SQLite, kann später ersetzt werden mit PostgreSQL)
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# 🔐 Passwort-Validierung
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# 🌐 Internationale Einstellungen
LANGUAGE_CODE = "de-de"
TIME_ZONE = "Europe/Berlin"
USE_I18N = True
USE_TZ = True

# 🗂️ Statische Dateien
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

# 🆔 Standard-Auto-Feld
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# 🌐 CORS (Cross-Origin Resource Sharing)
CORS_ALLOWED_ORIGINS = [
    "https://ecomatch-10.vercel.app",
]

CORS_ALLOW_CREDENTIALS = True


# 🔑 JWT-Authentifizierung (SimpleJWT)
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    )
}

# 👤 Benutzerdefiniertes User-Modell (wenn verwendet)
AUTH_USER_MODEL = "core.User"
