import os
import sys
import json
import django

# 🔧 Django vorbereiten
sys.path.append('/app')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.dev")
django.setup()

# 📦 Modelle importieren
from core.models import PlzOrt, Strasse, Bundesland
from django.db import connection

# 📥 JSON-Datei laden
json_path = os.path.join(os.path.dirname(__file__), "../data/plz_ort_strasse.json")
with open(json_path, encoding='utf-8') as f:
    data = json.load(f)

# 🧹 Alte Daten löschen
Strasse.objects.all().delete()
PlzOrt.objects.all().delete()
print("🧹 Bestehende Daten gelöscht.")

# 🔁 ID-Sequenzen robust zurücksetzen
from django.db import connection

def reset_sequence(table_name):
    with connection.cursor() as cursor:
        cursor.execute(f"""
            SELECT setval(pg_get_serial_sequence('"core_{table_name}"', 'id'), 1, false);
        """)
    print(f"🔁 Sequenz für '{table_name}' zurückgesetzt.")

reset_sequence("plzort")
reset_sequence("strasse")

# 🧱 Daten trennen
plzorts = []
strassen_roh = []

# 🌍 Dummy-Bundesland zuweisen (alle = Hessen)
hessen = Bundesland.objects.get(pk=1)

# 🚧 PlzOrt-Objekte vorbereiten
for entry in data:
    model = entry["model"]
    fields = entry["fields"]
    fields.pop("id", None)

    if model == "core.plzort":
        fields["land"] = hessen
        plzorts.append(PlzOrt(**fields))
    elif model == "core.strasse":
        strassen_roh.append(fields)  # später verknüpfen

# 💾 PlzOrt speichern
PlzOrt.objects.bulk_create(plzorts, batch_size=10000)
print(f"✅ {len(plzorts)} PLZ-Ort importiert.")

# 🔄 Aktuelle PlzOrt-Objekte aus DB laden (Mapping nach PK)
plzort_map = {po.id: po for po in PlzOrt.objects.all()}

# 🏗️ Strasse-Objekte verarbeiten in Batches
BATCH_SIZE = 100_000
total = len(strassen_roh)
print(f"🚚 Starte Import von {total} Straßen in Batches von {BATCH_SIZE}...")

for i in range(0, total, BATCH_SIZE):
    batch = strassen_roh[i:i + BATCH_SIZE]
    strassen = []

    for fields in batch:
        plzort_id = fields.pop("plz_ort")
        plzort_instance = plzort_map.get(plzort_id)

        if not plzort_instance:
            raise ValueError(f"❌ Kein PlzOrt mit ID {plzort_id} gefunden!")

        fields["plz_ort"] = plzort_instance
        strassen.append(Strasse(**fields))

    Strasse.objects.bulk_create(strassen, batch_size=10000)
    print(f"✅ Batch {i // BATCH_SIZE + 1}: {len(strassen)} Straßen importiert ({i + len(strassen)} / {total})")

print("🎉 Alle Straßen erfolgreich importiert.")
