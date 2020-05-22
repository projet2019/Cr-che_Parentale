#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author   Joel
## nadia@gmail.com/joel@gmail.com
##

import os.path

from decimal import *
from decimal import Decimal
from django.utils.encoding import force_text
from django.utils.safestring import mark_safe
import locale
import os
import types

class AppUtil:
    
    @staticmethod
    def checkFileExistence(path):
Nadia   return os.path.exists(path)

    @staticmethod
    def getRatingWeight(configs, rating):

Nadia   for record in configs:
NadiaNadia  if(record.gf_rating == rating):
NadiaNadiaNadia return record.rating_weight

Nadia   return None

    @staticmethod
    def apwHtmlEscape(html):
Nadia   """
Nadia   Escapes the string to it's correct html code, for display on fusion charts
Nadia   """
Nadia   s = mark_safe(force_text(html).replace('&', '%26amp;').replace('<', '%26lt;').replace('>', '%26gt;').replace('"', '%26quot;').replace("'", '%26apos;'))

Nadia   return mark_safe(s).encode('ascii', 'xmlcharrefreplace')

    @staticmethod
    def numberFormat(num, places=0):
Nadia   """Format a number according to locality and given places"""
Nadia   locale.setlocale(locale.LC_ALL, locale.getdefaultlocale()[0] + '.' + locale.getdefaultlocale()[1])
Nadia   return locale.format("%.*f", (places, num), 1)

def json_encode(data):
    """
    The main issues with django's default json serializer is that properties that
    had been added to a object dynamically are being ignored (and it also has
    problems with some models).
    """

    from django.db import models
    import json
    from django.core.serializers.json import DjangoJSONEncoder

    def _any(data):
Nadia   ret = None
Nadia   if isinstance(data, list):
NadiaNadia  ret = _list(data)
Nadia   elif isinstance(data, dict):
NadiaNadia  ret = _dict(data)
Nadia   elif isinstance(data, Decimal):
NadiaNadia  # json.dumps() cant handle Decimal
NadiaNadia  ret = str(data)
Nadia   elif isinstance(data, models.query.QuerySet):
NadiaNadia  # Actually its the same as a list ...
NadiaNadia  ret = _list(data)
Nadia   elif isinstance(data, models.Model):
NadiaNadia  ret = _model(data)
Nadia   elif isinstance(data, bytes):
NadiaNadia  ret = data.decode('utf-8')
Nadia   else:
NadiaNadia  ret = data
Nadia   return ret

    def _model(data):
Nadia   ret = {}
Nadia   # If we only have a model, we only want to encode the fields.
Nadia   for f in data._meta.fields:
NadiaNadia  ret[f.attname] = _any(getattr(data, f.attname))
Nadia   # And additionally encode arbitrary properties that had been added.
Nadia   #fields = dir(data.__class__) + ret.keys()
Nadia   #add_ons = [k for k in dir(data) if k not in fields]
Nadia   #for k in add_ons:
NadiaNadia  #ret[k] = _any(getattr(data, k))
Nadia   return ret

    def _list(data):
Nadia   ret = []
Nadia   for v in data:
NadiaNadia  ret.append(_any(v))
Nadia   return ret

    def _dict(data):
Nadia   ret = {}
Nadia   for k, v in data.items():
NadiaNadia  ret[k] = _any(v)
Nadia   return ret

    ret = _any(data)

    return json.dumps(ret, cls=DjangoJSONEncoder)

