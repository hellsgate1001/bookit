"""
Django settings for reserved project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""
import os
from unipath import Path

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Normally you should not import ANYTHING from Django directly
# into your settings, but ImproperlyConfigured is an exception.
from django.core.exceptions import ImproperlyConfigured
def get_env_variable(var_name):
    """ Get the environment variable or return exception """
    try:
        return os.environ[var_name]
    except KeyError:
        error_msg = "Set the %s environment variable" % var_name
        raise ImproperlyConfigured(error_msg)

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_PATH = Path(__file__).ancestor(3)


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/



INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # django / python apps
    'south',
    'userena',
    'guardian',
    'easy_thumbnails',
    'easy_maps',
    'simple_rest',

    'compressor',
    'django_extensions',

    # Project apps
    'reserved',
    'account',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

AUTHENTICATION_BACKENDS = (
    'userena.backends.UserenaAuthenticationBackend',
    'guardian.backends.ObjectPermissionBackend',
    'django.contrib.auth.backends.ModelBackend',
)
ROOT_URLCONF = 'reserved.urls'

WSGI_APPLICATION = 'reserved.wsgi.application'

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/
LANGUAGE_CODE = 'en-gb'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/
MEDIA_ROOT = BASE_PATH.child('media')
MEDIA_URL = '/media/'

STATIC_ROOT = BASE_PATH.child('static')
STATIC_URL = '/static/'

EMAIL_BACKEND = 'django.core.mail.backends.dummy.EmailBackend'

# AUTH_USER_MODEL = 'coordinator.CoordinatorUser'
AUTH_USER_MODEL = 'account.UserProfile'
AUTH_PROFILE_MODULE = 'account.ReservedProfile'

LOGIN_REDIRECT_URL = '/accounts/%(username)s/'
LOGIN_URL = '/accounts/signin/'
LOGOUT_URL = '/accounts/signout/'

ANONYMOUS_USER_ID = -1
# Automatically very private.
USERENA_DEFAULT_PRIVACY ='closed'

# No need to email activate.
USERENA_SIGNIN_AFTER_SIGNUP = True
USERENA_ACTIVATION_REQUIRED = False
# Email only user signup
USERENA_WITHOUT_USERNAMES = True


SECRET_KEY = 'dfoihjehrp'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static"),
)

TEMPLATE_DIRS = (
    os.path.join(BASE_DIR, 'reserved', 'templates'),
    os.path.join(BASE_DIR, "templates"),
)

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/
#
SOUTH_MIGRATION_MODULES = {
        'easy_thumbnails': 'easy_thumbnails.south_migrations',
    }


# Application definition
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    # other finders..
    'compressor.finders.CompressorFinder',
    'static_precompiler.finders.StaticPrecompilerFinder',
)

STATIC_PRECOMPILER_COMPILERS = (
    #'static_precompiler.compilers.CoffeeScript',
    'static_precompiler.compilers.SASS',
    'static_precompiler.compilers.SCSS',
    #'static_precompiler.compilers.LESS',
)

COMPRESS_PRECOMPILERS = (
    #('text/x-scss', 'django_libsass.SassCompiler'),
    # ('text/x-scss', 'sass --scss {infile} {outfile}'),
    ('text/x-scss', 'sass --scss --compass {infile} {outfile}'),
)

SCSS_USE_COMPASS = True

EASY_MAPS_CENTER = (-41.3, 32)

MESSAGE_STORAGE = 'django.contrib.messages.storage.cookie.CookieStorage'
