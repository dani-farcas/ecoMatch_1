from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # 🧠 include core.urls aici
    path('', include('core.urls')),
]
