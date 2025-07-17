import environ
import os
from pathlib import Path

# 📌 Root-Verzeichnis (root/backend)
BASE_DIR = Path(__file__).resolve(strict=True).parent.parent.parent

# 🟢 Environment laden
env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# 🔐 Sicherheitseinstellungen
SECRET_KEY = env('SECRET_KEY')
DEBUG = env.bool('DEBUG')
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=[])

# 🔑 Custom User Model
AUTH_USER_MODEL = 'core.User'

# 🌐 Root URL Configuration
ROOT_URLCONF = 'config.urls'

# 📦 Installierte Apps
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'core',
]

# ⚙️ Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# 📁 Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# 📌 WSGI-Anwendung
WSGI_APPLICATION = 'config.wsgi.application'

# 🟣 REST Framework Einstellungen
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

# 🟢 CORS Einstellungen
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=[env('FRONTEND_URL')])
CORS_ALLOW_CREDENTIALS = True

# 📧 E-Mail Einstellungen
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = env('EMAIL_HOST')
EMAIL_PORT = env.int('EMAIL_PORT')
EMAIL_USE_TLS = env.bool('EMAIL_USE_TLS')
EMAIL_HOST_USER = env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL')

# 🌐 Frontend-URL für Bestätigungslinks
FRONTEND_URL = env('FRONTEND_URL')

# 🌐 Internationalisierung
LANGUAGE_CODE = 'de'
TIME_ZONE = 'Europe/Berlin'
USE_I18N = True
USE_TZ = True

# 📁 Static Dateien
STATIC_URL = '/static/'

# 📁 Media Dateien (optional)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
