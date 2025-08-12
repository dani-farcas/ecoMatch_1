from .base import *

# 🟢 Lokale statische Dateien für Entwicklung
STATICFILES_DIRS = [BASE_DIR / 'static']

# 📁 Datenbankeinstellungen – Entwicklung mit DATABASE_URL
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
