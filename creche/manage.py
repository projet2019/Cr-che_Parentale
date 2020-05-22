#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'creche.settings')
    try:
Nadia   from django.core.management import execute_from_command_line
    except ImportError as exc:
Nadia   raise ImportError(
NadiaNadia  "Couldn't import Django. Are you sure it's installed and "
NadiaNadia  "available on your PYTHONPATH environment variable? Did you "
NadiaNadia  "forget to activate a virtual environment?"
Nadia   ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
