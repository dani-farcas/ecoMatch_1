from .base import *

DEBUG = False
ALLOWED_HOSTS = ['ecomatch-backend.onrender.com']  # Numele real

CORS_ALLOWED_ORIGINS = [
    "https://echo-match-frontend.vercel.app",
]

CORS_ALLOW_CREDENTIALS = True  # Aceasta este esențială!

CSRF_TRUSTED_ORIGINS = [
    "https://echo-match-frontend.vercel.app",
]

REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = [
    'rest_framework.renderers.JSONRenderer',
]

STATIC_ROOT = BASE_DIR / 'staticfiles'
