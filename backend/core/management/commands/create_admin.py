from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os


class Command(BaseCommand):
    help = "Create a superuser if it does not exist"

    def handle(self, *args, **kwargs):
        User = get_user_model()
        uname = os.environ.get("DJANGO_SUPERUSER_USERNAME", "admin")
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "dlm33730@gmail.com")
        pwd = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "Admin123")

        if not User.objects.filter(username=uname).exists():
            User.objects.create_superuser(uname, email, pwd)
            self.stdout.write(self.style.SUCCESS(f"🆕 Superuser '{uname}' created"))
        else:
            self.stdout.write(
                self.style.WARNING(f"✅ Superuser '{uname}' already exists")
            )
