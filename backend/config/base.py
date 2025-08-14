import environ
import os
from pathlib import Path

# 📌 Basisverzeichnis (root/backend)
BASE_DIR = Path(__file__).resolve(strict=True).parent.parent

# 🟢 Environment-Variablen laden (.env im BASE_DIR)
env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

# 🔐 Sicherheitseinstellungen (Standardwerte für Entwicklung)
SECRET_KEY = env("SECRET_KEY")
DEBUG = env.bool("DEBUG", default=True)
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[])

# 🔑 Benutzerdefiniertes User-Modell
AUTH_USER_MODEL = "core.User"

# 🌐 Root-URL-Konfiguration
ROOT_URLCONF = "config.urls"

# 📦 Installierte Apps
INSTALLED_APPS = [
    # Django-Standard-Apps
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Drittanbieter-Apps
    "rest_framework",
    "corsheaders",
    "import_export",  # Für CSV/Excel-Import und -Export

    # Eigene Apps
    "core",
]

# ⚙️ Middleware (WhiteNoise direkt nach SecurityMiddleware)
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",  # ✅ für statische Dateien in Produktion
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# 📁 Templates
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "core" / "templates"],  # Eigene Templates
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

# 📌 WSGI-Anwendung
WSGI_APPLICATION = "config.wsgi.application"

# 🟣 Django REST Framework Einstellungen
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}

# 🟢 CORS Einstellungen
CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=[])
CORS_ALLOW_CREDENTIALS = True

# 📧 E-Mail Einstellungen
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = env("EMAIL_HOST", default="")
EMAIL_PORT = env.int("EMAIL_PORT", default=587)
EMAIL_USE_TLS = env.bool("EMAIL_USE_TLS", default=True)
EMAIL_HOST_USER = env("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD", default="")
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", default="")

# 🌐 Frontend-URL (z. B. für Bestätigungslinks)
FRONTEND_URL = env("FRONTEND_URL", default="http://localhost:5173")

# 🌍 Internationalisierung
LANGUAGE_CODE = "de"
TIME_ZONE = "Europe/Berlin"
USE_I18N = True
USE_TZ = True

# 🎨 Statische Dateien (nur in Entwicklung verwendet)
STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]  # nur dev
# In Produktion wird STATIC_ROOT in prod.py definiert

# 📦 Media-Dateien
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# 🛠️ Logging (Standard: nur Warnungen und Fehler)
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "WARNING",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "WARNING",
            "propagate": False,
        },
        "core": {
            "handlers": ["console"],
            "level": "DEBUG",
            "propagate": False,
        },
    },
}
