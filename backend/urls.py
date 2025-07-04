from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # 🛠 Panou de administrare Django
    path('admin/', admin.site.urls),

    # 🌐 Toate rutele API (inclusiv autentificare) din core/urls.py
    path('api/', include('backend.core.urls')),
]
