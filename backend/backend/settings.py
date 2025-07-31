# your_project/settings.py

from pathlib import Path
import os
import sys
from decouple import config, Csv
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY')

# --- Start of Modified Section ---

# Ensure DEBUG is defined immediately using decouple
DEBUG = config('DEBUG', default=False, cast=bool)

# Add a single debug print for DATABASE_URL and DEBUG status
# This is for debugging the build process on Render.
print(f"DEBUGGING (settings.py): DATABASE_URL value is: {os.environ.get('DATABASE_URL')}")
print(f"DEBUGGING (settings.py): Current DEBUG value is: {DEBUG}")

# Configure ALLOWED_HOSTS based on DEBUG and Render environment
RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')

if DEBUG: # For local development, allow all hosts
    ALLOWED_HOSTS = ['*']
elif RENDER_EXTERNAL_HOSTNAME: # For Render production, use Render's hostname
    ALLOWED_HOSTS = [RENDER_EXTERNAL_HOSTNAME]
else: # Fallback for other production environments or if RENDER_EXTERNAL_HOSTNAME isn't set
    ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='', cast=Csv())

# --- End of Modified Section ---


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
    'megamall',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

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

WSGI_APPLICATION = 'backend.wsgi.application'

# Database configuration (already good from previous fix)
DATABASE_URL = os.environ.get('DATABASE_URL')

if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            ssl_require=True,
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'masterpiece',
            'USER': 'jeff',
            'PASSWORD': 'Ilovethings7949',
            'HOST': 'localhost',
            'PORT': '5432',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://masterpiece-ecommerce-44ez.vercel.app',
    'https://masterpiece-ecommerce.onrender.com', # Assuming this is your frontend on Render
]

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.onrender\.com$",
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

AUTH_USER_MODEL = 'megamall.GuestUser'

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = config('EMAIL_HOST', default='smtp.sendgrid.net')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_USE_SSL = config('EMAIL_USE_SSL', default=False, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='apikey')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL')
SERVER_EMAIL = config('DEFAULT_FROM_EMAIL')

SENDGRID_API_KEY = config('SENDGRID_API_KEY')
COURIER_ORDERS_RECIPIENT = config("COURIER_ORDERS_RECIPIENT", default="masterpiecempireorders@gmail.com")

# This block is okay for local dev, but should ideally be combined with the main DEBUG logic.
# However, given the current error, let's keep it simple and ensure DEBUG is defined at the top.
# if 'runserver' in sys.argv:
#     DEBUG = True
#     ALLOWED_HOSTS = ['*'] # This is redundant if DEBUG is handled higher up.