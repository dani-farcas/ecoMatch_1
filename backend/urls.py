from django.contrib import admin
from django.urls import path, include  # 🟢 add include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
    


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),  # 🟢 add this line
    path('api/token/', TokenObtainPairView.as_view(), name='token_optain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

