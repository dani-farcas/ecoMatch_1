from django.contrib import admin
from django.contrib.admin import AdminSite
from django.utils.html import format_html
from django.urls import path
from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa

from .forms import CustomAdminLoginForm
from .models import (
    User, Subscription, ServiceType,
    ProviderProfile, Request, Offer, AccessLog, RequestImage,
    Bundesland, Region, PlzOrt, Strasse
)
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# 📦 Für Excel/CSV-Export
from import_export.admin import ExportMixin
from import_export import resources


# 🛠 Benutzerdefinierte AdminSite mit Login-Formular
class CustomAdminSite(AdminSite):
    login_form = CustomAdminLoginForm

# 🏁 Neue Admin-Site-Instanz
custom_admin_site = CustomAdminSite(name='custom_admin')


# 🔐 Benutzerverwaltung
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

    def save_model(self, request, obj, form, change):
        if obj.is_superuser:
            obj.is_client = True
            obj.is_provider = True
        super().save_model(request, obj, form, change)


# 🖼️ Einzelbild-Vorschau im Admin
class RequestImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'request', 'preview', 'uploaded_at']
    readonly_fields = ['preview']

    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="120" height="80" style="object-fit: cover;" />', obj.image.url)
        return "-"
    preview.short_description = "Bildvorschau"


# 📎 Inline-Vorschau in Anfrage-Detail
class RequestImageInline(admin.TabularInline):
    model = RequestImage
    readonly_fields = ['preview']
    extra = 0

    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" height="70" style="object-fit: cover;" />', obj.image.url)
        return "-"
    preview.short_description = "Bild"


# 📤 Export-Ressource für Excel/CSV
class RequestResource(resources.ModelResource):
    class Meta:
        model = Request
        fields = (
            "id", "client__email", "client__first_name", "client__last_name",
            "client__phone_number", "client__company",
            "location", "service_type__name", "description", "created_at"
        )


# 📄 Anfrage-PDF-Export-View
def export_request_pdf_view(request, request_id):
    req = Request.objects.get(id=request_id)
    template = get_template("admin/request_pdf_template.html")  # 📄 Muss erstellt werden!
    html = template.render({"request": req})

    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="Anfrage_{req.id}.pdf"'
    pisa.CreatePDF(html, dest=response)
    return response


# 📋 Anfrage-Admin mit Export, Suche, Inline-Bildern und PDF-Button
class RequestAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = RequestResource
    list_display = ['id', 'client', 'service_type', 'location', 'created_at', 'pdf_export_link']
    list_filter = (
        'created_at', 'service_type', 'client__region', 'client__city',
    )
    search_fields = (
        'client__first_name', 'client__last_name',
        'client__email', 'client__phone_number',
        'client__company', 'client__postal_code',
        'location', 'description',
    )
    readonly_fields = ('created_at',)
    inlines = [RequestImageInline]

    # 🧩 Link zum PDF-Export pro Anfrage
    def pdf_export_link(self, obj):
        return format_html(
            '<a class="button" href="export-pdf/{}/" target="_blank">📄 Export PDF</a>',
            obj.id
        )
    pdf_export_link.short_description = "PDF"

    # 🔗 Eigene URL für PDF-Export registrieren
   # 🔗 Eigene URL für PDF-Export registrieren
def get_urls(self):
    urls = super().get_urls()
    custom_urls = [
        path(
            'export-pdf/<int:request_id>/',
            self.admin_site.admin_view(export_request_pdf_view),
            name='export-request-pdf'
        ),
    ]
    return custom_urls + urls



# 🌍 Geografische Modelle
@admin.register(Bundesland, site=custom_admin_site)
class BundeslandAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Region, site=custom_admin_site)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'land')
    list_filter = ('land',)
    search_fields = ('name',)

@admin.register(PlzOrt, site=custom_admin_site)
class PlzOrtAdmin(admin.ModelAdmin):
    list_display = ('id', 'plz', 'ort', 'region', 'land')
    list_filter = ('region', 'land')
    search_fields = ('plz', 'ort')

@admin.register(Strasse, site=custom_admin_site)
class StrasseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'plz_ort')
    list_filter = ('plz_ort',)
    search_fields = ('name',)


# ➕ Registrierung aller Modelle im Custom Admin
custom_admin_site.register(User, UserAdmin)
custom_admin_site.register(Subscription)
custom_admin_site.register(ServiceType)
custom_admin_site.register(ProviderProfile)
custom_admin_site.register(Request, RequestAdmin)
custom_admin_site.register(Offer)
custom_admin_site.register(AccessLog)
custom_admin_site.register(RequestImage, RequestImageAdmin)
