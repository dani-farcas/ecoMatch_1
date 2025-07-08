from django.contrib.auth.forms import AuthenticationForm

# 📝 Angepasstes Login-Formular mit geändertem Label für das Benutzerfeld
class CustomAdminLoginForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # 🔄 Feldname 'Email' in 'User' umbenennen
        self.fields['username'].label = 'User'
