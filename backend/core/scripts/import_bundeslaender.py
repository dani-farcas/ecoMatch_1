# 📁 core/scripts/import_bundeslaender.py

import sys
import os

sys.path.append('/app')  # 🔧 asigură contextul corect pentru config
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.dev")

import django
django.setup()

from core.models import Bundesland

bundeslaender = [
    "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg",
    "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen",
    "Rheinland-Pfalz", "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein",
    "Thüringen"
]

for name in bundeslaender:
    obj, created = Bundesland.objects.get_or_create(name=name)
    if created:
        print(f"✅ Erstellt: {name}")
    else:
        print(f"ℹ️ Bereits vorhanden: {name}")
