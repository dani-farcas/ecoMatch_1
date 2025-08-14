# 📁 backend/config/urls.py
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from core.admin import custom_admin_site
from core.views import EmailTokenObtainPairView, ResendActivationEmailView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
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

# 🟣 Statische/Media-Dateien (nur für DEBUG ohne NGINX)
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
