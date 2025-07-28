import os
from django.core.wsgi import get_wsgi_application

# 🔧 Schalte auf config.dev oder config.prod je nach Umgebung
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.dev')

application = get_wsgi_application()
