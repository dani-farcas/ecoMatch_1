import csv
import json
import os
import sys
from collections import defaultdict

# 🔧 Setup Django
sys.path.append('/app')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.dev")

import django
django.setup()

# 📥 Input CSV & 📤 Output JSON
csv_path = os.path.join(os.path.dirname(__file__), "../data/streets.csv")
json_output_path = os.path.join(os.path.dirname(__file__), "../data/plz_ort_strasse.json")

# 📌 Structuri temporare
plz_ort_map = {}       # (plz, ort) -> id
plz_ort_objects = []   # listă de PlzOrt
strasse_objects = []   # listă de Strasse

next_plz_ort_id = 1
next_strasse_id = 1

with open(csv_path, newline='', encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        plz = row.get("PostalCode", "").strip()
        ort = row.get("Locality", "").strip()
        strasse = row.get("Name", "").strip()

        if not (plz and ort and strasse):
            continue

        key = (plz, ort)

        if key not in plz_ort_map:
            plz_ort_map[key] = next_plz_ort_id
            plz_ort_objects.append({
                "model": "core.plzort",
                "pk": next_plz_ort_id,
                "fields": {
                    "plz": plz,
                    "ort": ort,
                    "region": None,
                    "land": 1  # Temporar: toate pe Hessen (id=1), vom schimba ulterior
                }
            })
            next_plz_ort_id += 1

        strasse_objects.append({
            "model": "core.strasse",
            "pk": next_strasse_id,
            "fields": {
                "name": strasse,
                "plz_ort": plz_ort_map[key]
            }
        })
        next_strasse_id += 1

# 🔄 Scriem fișierul JSON
with open(json_output_path, "w", encoding="utf-8") as f:
    json.dump(plz_ort_objects + strasse_objects, f, ensure_ascii=False, indent=2)

print(f"✅ Conversie finalizată: {len(plz_ort_objects)} PlzOrt, {len(strasse_objects)} Strassen")
print(f"📁 Fișier salvat: {json_output_path}")
