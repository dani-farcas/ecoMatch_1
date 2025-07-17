from django.urls import path, include
from core.admin import custom_admin_site
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # 🔐 Eigenes Admin-Panel mit Custom Admin Site
    path('admin/', custom_admin_site.urls),

    # 🌐 API-Routen der "core"-App
    path('api/', include('core.urls')),

    # 🔑 JWT Token Endpunkte für Authentifizierung
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# 🟣 Optional: statische Dateien auch in Produktion ohne NGINX ausliefern
from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    # 🟢 Development: local staticfiles direkt aus /static/ Ordner
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
else:
    # 🔴 Production: staticfiles gesammelt in STATIC_ROOT (z.B. /staticfiles/)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
