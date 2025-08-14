from .base import *  # 🔁 Lade Basiseinstellungen aus base.py
import dj_database_url

# ⚙️ Debug in Produktion deaktivieren
DEBUG = False

# 🌍 Erlaubte Hosts (muss in Render ENV gesetzt werden)
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[".onrender.com"])

# 🗄️ Datenbankverbindung (Render DATABASE_URL)
DATABASES = {
    "default": dj_database_url.config(conn_max_age=600, ssl_require=True)
}

# 🎨 Statische Dateien für Admin & App (Produktion)
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# 📦 Media-Dateien (nur falls auf Render Disk oder S3)
MEDIA_ROOT = BASE_DIR / "mediafiles"
MEDIA_URL = "/media/"

# 🔐 Sicherheitseinstellungen für HTTPS
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = env.bool("SESSION_COOKIE_SECURE", default=True)
CSRF_COOKIE_SECURE = env.bool("CSRF_COOKIE_SECURE", default=True)
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_SECONDS = 3600
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# 🛠️ Logging für Produktion (nur Warnungen/Fehler)
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
}
