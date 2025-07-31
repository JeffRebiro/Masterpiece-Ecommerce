# your_project/settings.py

from pathlib import Path
import os
import sys
from decouple import config, Csv
import dj_database_url # This import is good

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY')

# Use environment variable for DEBUG, default to False for production
DEBUG = config('DEBUG', default=False, cast=bool)

# Configure ALLOWED_HOSTS for Render deployment
# Render automatically sets RENDER_EXTERNAL_HOSTNAME.
# If DEBUG is True (local), allow all hosts. Otherwise, rely on RENDER_EXTERNAL_HOSTNAME and Csv.
RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')

if DEBUG: # For local development
    ALLOWED_HOSTS = ['*']
elif RENDER_EXTERNAL_HOSTNAME: # For Render production
    ALLOWED_HOSTS = [RENDER_EXTERNAL_HOSTNAME]
else: # Fallback for other production environments (or if RENDER_EXTERNAL_HOSTNAME isn't set for some reason)
    ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='', cast=Csv()) # Use an empty string default if not found

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
    'whitenoise.middleware.WhiteNoiseMiddleware', # Make sure WhiteNoise is correctly configured for static files
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
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# ⬇️ ⬇️ ⬇️  CRITICAL CHANGE FOR DATABASE CONNECTION ⬇️ ⬇️ ⬇️
# Use DATABASE_URL from environment for Render, fall back to local settings
DATABASE_URL = os.environ.get('DATABASE_URL')

if DATABASE_URL:
    # Production database on Render
    DATABASES = {
        'default': dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600, # Keep connections alive for performance
            ssl_require=True, # Important for secure connections to Render's PostgreSQL
        )
    }
else:
    # Local development database
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'masterpiece',         # Your local PostgreSQL DB name
            'USER': 'jeff',                # Your local PostgreSQL user
            'PASSWORD': 'Ilovethings7949', # Your local PostgreSQL password
            'HOST': 'localhost',           # Connect to local PostgreSQL server
            'PORT': '5432',                # Default PostgreSQL port
        }
    }
# ⬆️ ⬆️ ⬆️  END OF CRITICAL DATABASE CHANGE ⬆️ ⬆️ ⬆️


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

# ✅ CORS SETTINGS
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://masterpiece-ecommerce-44ez.vercel.app',
    # Dynamically add your Render frontend URL or use a wildcard for Render's subdomains if needed
    'https://masterpiece-ecommerce.onrender.com', # <--- Add your actual Render frontend URL here
]

# If you need to allow a wildcard for Render frontend for testing (less secure for prod)
# You might consider using CORS_ALLOWED_ORIGIN_REGEXES for more dynamic Render subdomains
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.onrender\.com$", # Allows any subdomain on .onrender.com for CORS
]


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

AUTH_USER_MODEL = 'megamall.GuestUser'

# ✅ EMAIL SETTINGS - These are correctly using decouple
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

# ✅ Optional: Override for local dev - This section is good for local debugging
if 'runserver' in sys.argv:
    DEBUG = True # Ensure DEBUG is True when running locally
    # No need for ALLOWED_HOSTS = ['*'] here if DEBUG is already handling it above.
    # The `if DEBUG: ALLOWED_HOSTS = ['*']` block above covers this.