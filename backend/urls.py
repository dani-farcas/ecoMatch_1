from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,   # 🔐 Generează un nou token (access + refresh)
    TokenRefreshView       # ♻️ Reînnoiește token-ul de acces cu token-ul de refresh
)
from core.views import ConfirmEmailView  # ✅ View-ul profesionist pentru confirmare cont

urlpatterns = [
    # 🛠 Panou de administrare Django
    path('admin/', admin.site.urls),

    # 🌐 API principale definite în aplicația "core"
    path('api/', include('core.urls')),

    # 🔐 JWT Auth (autentificare și reîmprospătare token)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ✅ Confirmare cont prin email (format profesional Django: uid/token)
    # ✅ FORMAT CORECT:
path('api/confirm/<str:uid>/<str:token>/', ConfirmEmailView.as_view()),

]
