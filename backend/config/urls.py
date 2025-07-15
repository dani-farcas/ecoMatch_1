from django.urls import path, include
from core.admin import custom_admin_site
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # 🔐 Eigenes Admin-Panel mit Custom Admin Site (für Branding, Anpassungen)
    path('admin/', custom_admin_site.urls),

    # 🌐 API-Routen der "core"-App
    path('api/', include('core.urls')),

    # 🔑 JWT Token Endpunkte für Authentifizierung
    # POST: Zugangstoken und Refresh-Token erhalten
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # 🔄 Refresh-Token Endpoint: neuen Access-Token mit gültigem Refresh-Token anfordern
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
