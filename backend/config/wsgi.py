# 📁 backend/config/wsgi.py

import os
from django.core.wsgi import get_wsgi_application

# 🟢 Django-Settings-Modul automatisch auswählen
#    - In der lokalen Entwicklung (docker-compose) wird `DJANGO_SETTINGS_MODULE=config.dev` aus `.env.dev` geladen
#    - In der Produktion (Render) wird `DJANGO_SETTINGS_MODULE=config.prod` aus den Environment-Variablen geladen
#    - Falls keine Variable gesetzt ist → Standard: `config.dev`
os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    os.getenv("DJANGO_SETTINGS_MODULE", "config.dev")
)

# 🔁 Django WSGI-Anwendung laden
application = get_wsgi_application()

# 📦 WhiteNoise aktivieren
#    - Dient zum Ausliefern von statischen Dateien (CSS, JS, Bilder) direkt über Django
#    - In der Produktion notwendig, wenn kein separater Webserver (z. B. Nginx) verwendet wird
try:
    from whitenoise import WhiteNoise
    application = WhiteNoise(application)
except ImportError:
    # Falls WhiteNoise im lokalen Setup nicht benötigt oder nicht installiert ist
    pass
