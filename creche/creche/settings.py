"""
Django settings for creche project.

Generated by 'django-admin startproject' using Django 2.2.2.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

COREAPP_ROOT = os.path.join(BASE_DIR, 'coreapp')
## custom settings 

APPLICATION_SETTINGS = {
    'common': {
        'smtp_host': 'localhost',
        'admin_to_email': 'joel@gmail.com',
        'admin_from_email': 'zigama@localhost',
        'event_notification_from_email': 'noreply@localhost',
        'local_repo': 'data-repo',
        'creche_name':'Creche Parentale',
        'creche_avenue': "Avenue de l'Espinette,16",
        'creche_road':'1348 Louvain-La-Neuve',
        'creche_telephone':'010235487',
        'creche_email':'info@crecheparentale.com',
        'creche_web':'crecheparentale.com',
        'creche_zip':''
    },
    'development': {

    },
    'UNKNOWN_RECORD_EVENT_TYPE': 1,
    'MISSING_FILE_EVENT_TYPE': 2,
    'UNKNOWN_COLUMN_EVENT_TYPE': 3,
    'UNKNOWN_ERROR_EVENT_TYPE': 4,
    'TEST_EMAIL': 5,
    'ENGLISH_EMAIL': 6,
    'FRENCH_EMAIL': 7,
    'COREAPP_HOME': COREAPP_ROOT,
    'EVENT_NOTIFICATION_TPL': '/public/templates/email/significant-event-notification-en.html',
    'EMAIL_HOME': '/data-repo/files/emails', 
    'ROOT_URL': 'http://localhost/creche'
}


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'x)1il2bug2b8o-=((ifhit^-#k&5w!0=rpu%_6ar1j5akjg*3!'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['127.0.0.1', '0.0.0.0', 'localhost', '192.168.43.126']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'coreapp.apps.CoreappConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'coreapp.util.app_session_auth_middleware.AppSessionAuthMiddleware',
]

MIDDLEWARE_CLASSES = [

    #'coreapp.util.app_session_auth_middleware.AppSessionAuthMiddleware',

]

CSRF_USE_SESSIONS = True
ROOT_URLCONF = 'creche.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [APPLICATION_SETTINGS['COREAPP_HOME'] + '/public/templates/html/'],
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

WSGI_APPLICATION = 'creche.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'sqlite3.db',                      # Or path to database file if using sqlite3.
        'USER': '',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}


# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

import dj_database_url
db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)


PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
STATIC_ROOT = os.path.join(PROJECT_ROOT, 'staticfiles')

STATIC_URL = '/static/'

# Extra places for collectstatic to find static files.
STATICFILES_DIRS = (
    os.path.join(PROJECT_ROOT, 'static'),
    APPLICATION_SETTINGS['COREAPP_HOME'] + '/public/'
)

# Simplified static file serving.
# https://warehouse.python.org/project/whitenoise/

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


