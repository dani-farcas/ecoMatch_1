from django.core.mail import EmailMultiAlternatives
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings

def send_confirmation_email(user):
    # UID generieren (base64-codiert)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    # Token für Bestätigung erstellen
    token = default_token_generator.make_token(user)
    
    # URL zur Bestätigungsseite (Frontend)
    confirm_url = f"{settings.FRONTEND_URL}/confirm-email/{uid}/{token}/"

    # 📧 E-Mail-Inhalte definieren
    subject = "Bitte bestätige dein Konto bei ecoMatch"
    from_email = settings.DEFAULT_FROM_EMAIL
    to = [user.email]

    # 📝 Fallback-Text (für Mail-Clients ohne HTML)
    text_content = (
        f"Hallo {user.username},\n"
        f"bitte bestätige dein Konto unter folgendem Link:\n{confirm_url}\n\n"
        "Falls du dich nicht bei ecoMatch registriert hast, kannst du diese Nachricht ignorieren."
    )

    # 💅 HTML-Version der E-Mail
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
          <p>Viele Grüße,<br>Dein ecoMatch-Team</p>
        </div>
      </body>
    </html>
    """

    # ✉️ E-Mail mit HTML + Text senden
    msg = EmailMultiAlternatives(subject, text_content, from_email, to)
    msg.attach_alternative(html_content, "text/html")
    msg.send()
