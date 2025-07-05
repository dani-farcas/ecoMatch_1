"""
WSGI config for backend project.

It exposes the WSGI callable as a module-level variable named ``application``.
"""

import os
import sys
from pathlib import Path

# 🔧 Adaugă folderul root/backend în sys.path pentru importuri corecte
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR / "backend"))

# 🛠 Setează fișierul de configurare Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.prod')

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()
