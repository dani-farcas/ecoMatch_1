# 📁 backend/config/prod.py

from .base import *         # 🔁 Lade Basiseinstellungen
import os
import dj_database_url      # 📦 Verwendet DATABASE_URL für PostgreSQL in Produktion

# 🔐 Sicherheitseinstellungen für HTTPS (z. B. auf Render oder Heroku)
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = env.bool('SESSION_COOKIE_SECURE', default=True)
CSRF_COOKIE_SECURE = env.bool('CSRF_COOKIE_SECURE', default=True)
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_SECONDS = 3600
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# ⚙️ Debug-Modus deaktivieren in Produktion
DEBUG = False

# 🌍 Erlaube nur definierte Hosts
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['.onrender.com'])

# 🗄️ Datenbankverbindung über Umgebungsvariable
DATABASES = {
    'default': dj_database_url.config(conn_max_age=600, ssl_require=True)
}

# 🎨 Statische Dateien für Admin & App
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# ✅ Aktivieren von WhiteNoise für CSS/JS/Fonts
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# 📦 Media-Dateien (optional, falls du Uploads hast)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'mediafiles'

# 🛠️ Logging für Produktion (zeigt nur Warnungen und Fehler)
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    },
}
