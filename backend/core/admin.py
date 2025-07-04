from django.contrib import admin
from .models import User, ServiceType, ProviderProfile, Request
from django.contrib.auth.admin import UserAdmin

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('is_client', 'is_provider')}),
    )
    list_display = ('username', 'email', 'is_client', 'is_provider', 'is_staff')

# 🔽 mutăm acestea în afara clasei!
admin.site.register(ServiceType)
admin.site.register(ProviderProfile)
admin.site.register(Request)
