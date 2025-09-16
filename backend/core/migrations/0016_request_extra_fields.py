from django.db import migrations, models

# 🇩🇪 Backfill für bestehende Requests ohne Titel
def backfill_titles(apps, schema_editor):
    Request = apps.get_model("core", "Request")
    for r in Request.objects.filter(title__isnull=True):
        fallback = f"Anfrage vom {r.created_at:%d.%m.%Y}" if r.created_at else "Anfrage (ohne Datum)"
        r.title = fallback
        r.save(update_fields=["title"])


class Migration(migrations.Migration):

    dependencies = [
    ("core", "0015_user_house_number_user_street"),
]

    operations = [
        # 🇩🇪 Neue Felder hinzufügen
        migrations.AddField(
            model_name="request",
            name="title",
            field=models.CharField(max_length=160, null=True),
        ),
        migrations.AddField(
            model_name="request",
            name="status",
            field=models.CharField(max_length=32, default="neu", blank=True),
        ),
        migrations.AddField(
            model_name="request",
            name="plz",
            field=models.CharField(max_length=10, blank=True),
        ),
        migrations.AddField(
            model_name="request",
            name="stadt",
            field=models.CharField(max_length=100, blank=True),
        ),
        migrations.AddField(
            model_name="request",
            name="region",
            field=models.CharField(max_length=100, blank=True),
        ),
        migrations.AddField(
            model_name="request",
            name="land",
            field=models.CharField(max_length=100, blank=True),
        ),

        # 🇩🇪 Bestehende Datensätze mit Fallback-Titel versorgen
        migrations.RunPython(backfill_titles, migrations.RunPython.noop),

        # 🇩🇪 Titel-Feld endgültig verpflichtend machen
        migrations.AlterField(
            model_name="request",
            name="title",
            field=models.CharField(max_length=160),
        ),
    ]
