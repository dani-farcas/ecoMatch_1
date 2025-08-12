# 📁 backend/config/asgi.py
"""
ASGI-Konfiguration für das ecoMatch-Projekt.

Stellt die ASGI-Callable als Modulvariable `application` bereit.
Diese Datei wird für asynchrone Server (z. B. Uvicorn/Daphne) verwendet.
"""

import os
from django.core.asgi import get_asgi_application

# 🟢 Django-Settings-Modul automatisch auswählen
#    - Lokal (docker-compose/.env.dev): DJANGO_SETTINGS_MODULE=config.dev
#    - Produktion (Render/ENV):         DJANGO_SETTINGS_MODULE=config.prod
#    - Fallback, falls nichts gesetzt ist: config.dev
os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    os.getenv("DJANGO_SETTINGS_MODULE", "config.dev")
)

# 🔁 ASGI-Anwendung laden
application = get_asgi_application()
