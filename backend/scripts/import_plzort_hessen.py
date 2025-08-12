# backend/scripts/import_plzort_hessen.py

# 📦 Importiert PLZ + Ort + Region + Straße aus CSV-Datei (nur für Hessen)

import os
import sys
import csv

# 🛠 Füge das Projektverzeichnis zum Python-Pfad hinzu (für Docker)
sys.path.append("/app")

# ⚙️ Django initialisieren
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")  # ggf. anpassen
import django
django.setup()

# 📥 Modelle importieren
from core.models import Bundesland, Region, PlzOrt, Strasse

# ✅ Hole das Bundesland "Hessen" (muss vorher in der Datenbank existieren)
try:
    bundesland = Bundesland.objects.get(name="Hessen")
except Bundesland.DoesNotExist:
    print("❌ Bundesland 'Hessen' nicht gefunden. Bitte zuerst in der Datenbank anlegen.")
    sys.exit(1)

# 📁 Absoluter Pfad zur CSV-Datei
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
csv_file = os.path.join(BASE_DIR, "scripts", "zuordnung_plz_ort.csv")

# 🔍 Existenz der CSV-Datei prüfen
if not os.path.exists(csv_file):
    print(f"❌ CSV-Datei nicht gefunden: {csv_file}")
    sys.exit(1)

print(f"📥 CSV-Datei gefunden: {csv_file}")
print("⏳ Starte Import...")

# 🔄 Zähler für Statistik
count_plzort = 0
count_strasse = 0
skipped = 0

# 📑 CSV-Datei einlesen
with open(csv_file, newline='', encoding="utf-8") as f:
    reader = csv.DictReader(f)  # Erwartet Header: plz, ort, landkreis, bundesland, strasse

    for row in reader:
        # ⛔ Nur Einträge aus Hessen importieren
        if row.get("bundesland", "").strip().lower() != "hessen":
            skipped += 1
            continue

        # 🔢 Werte extrahieren
        plz = row.get("plz", "").strip()
        ort = row.get("ort", "").strip()
        region_name = row.get("landkreis", "").strip() or "Unbekannt"
        strasse_name = ""

        # ⛔ Leere PLZ oder Ort überspringen
        if not plz or not ort:
            skipped += 1
            continue

        # ✅ Region erstellen oder holen
        region, _ = Region.objects.get_or_create(name=region_name, land=bundesland)

        # ✅ PLZ-Ort erstellen oder holen
        plzort, created = PlzOrt.objects.get_or_create(
            plz=plz,
            ort=ort,
            region=region,
            land=bundesland
        )
        if created:
            count_plzort += 1

        # ✅ Straße speichern (nur wenn vorhanden)
        if strasse_name:
            _, created_str = Strasse.objects.get_or_create(
                name=strasse_name,
                plz_ort=plzort
            )
            if created_str:
                count_strasse += 1

# ✅ Ergebnis anzeigen
print(f"\n✅ Import abgeschlossen:")
print(f"   ➕ Neue PLZ-Ort-Einträge: {count_plzort}")
print(f"   ➕ Neue Straßen: {count_strasse}")
print(f"   ⏭️ Übersprungene Zeilen (ungültig oder anderes Bundesland): {skipped}")
