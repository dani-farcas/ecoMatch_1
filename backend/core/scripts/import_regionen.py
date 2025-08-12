import sys
import os
import json

sys.path.append('/app')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.dev")

import django
django.setup()

from core.models import Bundesland, Region

# 📥 JSON-Datei laden
json_path = os.path.join(os.path.dirname(__file__), "regionen_deutschland.json")
with open(json_path, encoding="utf-8") as f:
    regionen_data = json.load(f)

# 🔁 Regionen einfügen
for eintrag in regionen_data:
    land_name = eintrag["bundesland"]
    region_name = eintrag["name"]

    land = Bundesland.objects.filter(name=land_name).first()
    if not land:
        print(f"❌ Bundesland nicht gefunden: {land_name}")
        continue

    obj, created = Region.objects.get_or_create(name=region_name, land=land)
    if created:
        print(f"✅ Region erstellt: {region_name} ({land_name})")
    else:
        print(f"ℹ️ Bereits vorhanden: {region_name} ({land_name})")
