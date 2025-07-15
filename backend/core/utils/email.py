# 📁 core/utils/email.py

from django.core.mail import EmailMultiAlternatives
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings

# 📩 Funktion zum Versand der Bestätigungs-E-Mail nach der Registrierung
def send_confirmation_email(user, request):
    # 🔐 Nutzer-ID (Primärschlüssel) als base64-codierter String kodieren
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    # 🔑 Generiere eindeutigen Token für die Bestätigung
    token = default_token_generator.make_token(user)

    # 🌐 URL zur Bestätigungsseite im Frontend (aus settings geladen)
    confirm_url = f"{settings.FRONTEND_URL}/confirm-email/{uid}/{token}/"

    # 📧 Betreff, Absender und Empfänger definieren
    subject = "Bitte bestätige dein Konto bei ecoMatch"
    from_email = settings.DEFAULT_FROM_EMAIL
    to = [user.email]

    # 📝 Textversion für E-Mail-Clients, die kein HTML unterstützen
    text_content = (
        f"Hallo {user.username},\n\n"
        f"bitte bestätige dein Konto über folgenden Link:\n{confirm_url}\n\n"
        "Wenn du dich nicht bei ecoMatch registriert hast, kannst du diese Nachricht ignorieren.\n"
    )

    # 🌍 HTML-Version der E-Mail für moderne Clients
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 2rem;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 2rem; border-radius: 8px;">
          <h2 style="color: #2b6cb0;">Willkommen bei ecoMatch 👋</h2>
          <p>Hallo <strong>{user.username}</strong>,</p>
          <p>vielen Dank für deine Registrierung! Um dein Konto zu aktivieren, bestätige bitte deine E-Mail-Adresse über den folgenden Button:</p>
          <p style="text-align: center;">
            <a href="{confirm_url}" style="background-color: #2b6cb0; color: white; padding: 0.75rem 1.5rem; border-radius: 5px; text-decoration: none; display: inline-block;">
              Konto bestätigen
            </a>
          </p>
          <p>Wenn du dich nicht bei ecoMatch registriert hast, kannst du diese E-Mail ignorieren.</p>
          <p>Viele Grüße,<br>Dein <strong>ecoMatch-Team</strong></p>
        </div>
      </body>
    </html>
    """

    # ✉️ E-Mail mit Text- und HTML-Version versenden
    msg = EmailMultiAlternatives(subject, text_content, from_email, to)
    msg.attach_alternative(html_content, "text/html")
    msg.send()
