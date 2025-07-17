"""
ASGI config for ecoMatch project.

It exposes the ASGI callable as a module-level variable named ``application``.
"""

import os
from django.core.asgi import get_asgi_application

# 🟢 Setează fișierul de configurare Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.prod')

application = get_asgi_application()
