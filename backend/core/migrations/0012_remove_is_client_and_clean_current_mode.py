from django.db import migrations, models

def clean_current_mode(apps, schema_editor):
    """Setzt current_mode auf NULL, wenn es 'client' ist."""
    User = apps.get_model("core", "User")
    User.objects.filter(current_mode="client").update(current_mode=None)

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_servicetype_category'),
    ]

    operations = [
        # 1️⃣ Temporär current_mode auf NULL erlauben (verhindert NOT NULL-Fehler)
        migrations.AlterField(
            model_name='user',
            name='current_mode',
            field=models.CharField(
                max_length=10,
                choices=[("client", "Client"), ("provider", "Provider")],
                null=True,
                blank=True
            ),
        ),

        # 2️⃣ Datenbereinigung
        migrations.RunPython(clean_current_mode, reverse_code=migrations.RunPython.noop),

        # 3️⃣ Feld `is_client` entfernen
        migrations.RemoveField(
            model_name='user',
            name='is_client',
        ),

        # 4️⃣ current_mode nur noch 'provider' oder NULL erlauben
        migrations.AlterField(
            model_name='user',
            name='current_mode',
            field=models.CharField(
                max_length=10,
                choices=[("provider", "Provider")],
                null=True,
                blank=True
            ),
        ),
    ]
