from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

from core.admin import custom_admin_site
from core.views import EmailTokenObtainPairView, ResendActivationEmailView
from rest_framework_simplejwt.views import TokenRefreshView


# 🏠 Einfache Startseite für Root-URL ("/")
# Diese Ansicht dient nur zur Bestätigung, dass der API-Server läuft
def home_view(request):
    return HttpResponse("EcoMatch API is running 🚀")


urlpatterns = [
    # 🏠 Root-Endpunkt
    path("", home_view, name="home"),

    # 🔐 Eigenes Admin-Panel
    path("admin/", custom_admin_site.urls),

    # 🌐 API-Routen der "core"-App
    path("api/", include("core.urls")),

    # 🔑 JWT Token Endpunkte (E-Mail-Login statt Username)
    path("api/token/", EmailTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # ✉️ Aktivierungslink erneut senden
    path("api/auth/resend-activation/", ResendActivationEmailView.as_view(), name="resend_activation"),
]

# 📂 Statische und Medien-Dateien (nur direkt von Django, z. B. im DEBUG-Modus)
# In Produktion sollten diese von einem Webserver (z. B. Nginx) bedient werden
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
