from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Admin-Bereich
    path('admin/', admin.site.urls),

    # API-Endpunkte der App "core"
    path('api/', include('core.urls')),

    # JWT-Authentifizierung (Login und Token-Refresh)
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
