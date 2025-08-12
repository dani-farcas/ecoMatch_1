# scripts/import_streets.py

import os
import sys
import csv
import re
import logging
from django.db import transaction

# Django-Setup
sys.path.append("/app")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
import django
django.setup()

from core.models import PlzOrt, Strasse

CSV_PATH = "scripts/extern/strassen_hessen.csv"

logging.basicConfig(
    filename="import_streets.log",
    level=logging.INFO,
    format="%(asctime)s %(levelname)s: %(message)s"
)

def clean(s):
    return " ".join(s.strip().lower().split())

@transaction.atomic
def import_streets():
    count_new = 0
    count_skipped = 0
    seen = set()

    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter=";")
        for row in reader:
            plz = row.get("plz", "").strip()
            ort = clean(row.get("ort", ""))

            raw_strasse = row.get("strasse", "").strip()
            # ✅ Eliminăm numărul de la final (ex. "Goethestraße 123" → "Goethestraße")
            strasse = re.sub(r"\s\d{1,5}$", "", raw_strasse)

            if not (plz and ort and strasse):
                count_skipped += 1
                continue

            try:
                plz_ort = PlzOrt.objects.filter(plz=plz, ort__iexact=ort).first()
                if not plz_ort:
                    count_skipped += 1
                    continue
            except Exception as e:
                logging.warning(f"❌ Fehler bei Ort {plz} {ort}: {e}")
                count_skipped += 1
                continue

            key = (plz_ort.id, strasse.lower())
            if key in seen:
                continue
            seen.add(key)

            Strasse.objects.create(plz_ort=plz_ort, name=strasse)
            count_new += 1

    print(f"✅ {count_new} Straßen importiert, {count_skipped} übersprungen.")

if __name__ == "__main__":
    import_streets()
