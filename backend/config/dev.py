from .base import *

# 🟢 Lokale statische Dateien für Entwicklung
STATICFILES_DIRS = [BASE_DIR / 'static']

# 📁 Datenbankeinstellungen – Entwicklung mit DATABASE_URL
# Nutzt automatisch die Variable DATABASE_URL aus .env.dev
DATABASES = {
    'default': env.db()
}

# 🟢 Logging für Entwicklung – alles wird in Konsole ausgegeben
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
        'level': 'DEBUG',
    },
}
