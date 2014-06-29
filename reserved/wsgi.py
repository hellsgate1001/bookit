"""
WSGI config for reserved project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/howto/deployment/wsgi/
"""
import os, sys, site
from unipath import Path

# We defer to a DJANGO_SETTINGS_MODULE already in the environment. This breaks
# if running multiple sites in the same mod_wsgi process. To fix this, use
# mod_wsgi daemon mode with each site in its own daemon process, or use
# os.environ["DJANGO_SETTINGS_MODULE"] = "reserved.settings"
if 'DJANGO_SETTINGS_MODULE' not in os.environ:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "reserved.settings")

import django.core.handlers.wsgi
_application = django.core.handlers.wsgi.WSGIHandler()

def application(environ, start_response):
    #os.environ['RESERVED_DB_PASS'] = environ['CORE_DB_PASS']
    #os.environ['DJANGO_SETTINGS_MODULE'] = environ['DJANGO_SETTINGS_MODULE']
    #os.environ['SECRET_KEY_RESERVED'] = environ['SECRET_KEY_RESERVED']

    try:
        return _application(environ, start_response)
    except ImportError:
        # Remember the original sys.path
        prev_sys_path = sys.path
        # Add the project folder to path
        mp = Path(__file__).ancestor(2)
        site.addsitedir(mp)
        # Reorder sys.path so new directory is at front
        new_sys_path = []
        for item in list(sys.path):
            if item not in prev_sys_path:
                new_sys_path.append(item)
                sys.path.remove(item)
        sys.path[:0] = new_sys_path
        return _application(environ, start_response)

def add_to_path(new_path):
    # Remember the original sys.path
    prev_sys_path = sys.path
    # Add the project folder to path
    site.addsitedir(mp)
    # Reorder sys.path so new directory is at front
    new_sys_path = []
    for item in list(sys.path):
        if item not in prev_sys_path:
            new_sys_path.append(item)
            sys.path.remove(item)
    sys.path[:0] = new_sys_path

try:
    import reserved.monitor
except ImportError:
    mp = Path(__file__).ancestor(2)
    add_to_path(mp)
    import reserved.monitor
reserved.monitor.start(interval=1.0)
