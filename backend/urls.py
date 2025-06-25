from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,   # 🔐 Erstellt ein neues Token-Paar (access & refresh)
    TokenRefreshView       # ♻️ Erstellt ein neues Access-Token mit einem Refresh-Token
)

urlpatterns = [
    path('admin/', admin.site.urls),  # 🛠 Django Admin-Oberfläche

    # 🌐 API-Endpunkte aus der App "core"
    path('api/', include('core.urls')),

    # 🔐 Authentifizierungs-Endpunkte (JWT)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
