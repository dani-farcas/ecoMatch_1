from django.contrib import admin
from django.contrib.admin import AdminSite
from .forms import CustomAdminLoginForm
from .models import (
    User, Subscription, ServiceType,
    ProviderProfile, Request, Offer, AccessLog
)
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# 🛠 Benutzerdefinierte AdminSite mit angepasstem Login-Formular
class CustomAdminSite(AdminSite):
    login_form = CustomAdminLoginForm

# 🏁 Neue Admin-Site-Instanz
custom_admin_site = CustomAdminSite(name='custom_admin')


# 🔐 Benutzer-Admin
class UserAdmin(BaseUserAdmin):
    model = User
    list_display = (
    'email', 'username', 'is_client', 'is_provider',
    'current_mode', 'is_active', 'is_staff', 'is_superuser'
)
    list_filter = ('is_client', 'is_provider', 'current_mode', 'is_active')
    search_fields = ('email', 'username')
    ordering = ('email',)

    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Rollen & Status', {'fields': ('is_client', 'is_provider', 'current_mode', 'is_active', 'is_staff', 'is_superuser')}),
        ('Region', {'fields': ('region', 'postal_code')}),
        ('Abonnement', {'fields': ('subscription',)}),
        ('Berechtigungen', {'fields': ('groups', 'user_permissions')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'is_client', 'is_provider')}
        ),
    )
     # 🛡️ Wenn der Benutzer ein Superuser ist, erhält er automatisch beide Rollen (Client & Provider)
    def save_model(self, request, obj, form, change):
        if obj.is_superuser:
            obj.is_client = True
            obj.is_provider = True
        super().save_model(request, obj, form, change)


# 🔁 Registrierung aller Modelle über custom_admin_site
custom_admin_site.register(User, UserAdmin)
custom_admin_site.register(Subscription)
custom_admin_site.register(ServiceType)
custom_admin_site.register(ProviderProfile)
custom_admin_site.register(Request)
custom_admin_site.register(Offer)
custom_admin_site.register(AccessLog)
