from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os


class Command(BaseCommand):
    help = "Create a superuser if it does not exist, or update password if it exists"

    def handle(self, *args, **kwargs):
        User = get_user_model()
        uname = os.environ.get("DJANGO_SUPERUSER_USERNAME", "admin")
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@example.com")
        pwd = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "Admin123")

        user, created = User.objects.get_or_create(
            username=uname, defaults={"email": email}
        )
        if created:
            user.set_password(pwd)
            user.is_superuser = True
            user.is_staff = True
            user.save()
            self.stdout.write(self.style.SUCCESS(f"🆕 Superuser '{uname}' created"))
        else:
            user.email = email  # actualizează email-ul dacă s-a schimbat
            user.set_password(pwd)  # resetează parola
            user.save()
            self.stdout.write(self.style.WARNING(f"🔑 Password for '{uname}' updated"))
