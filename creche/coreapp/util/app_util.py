#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

<<<<<<< Updated upstream
=======
##
##
## @author UWANTWALI ZIGAMA Didier
## d.zigama@pivotaccess.com/zigdidier@gmail.com
##
>>>>>>> Stashed changes

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
        return os.path.exists(path)

    @staticmethod
    def getRatingWeight(configs, rating):

        for record in configs:
            if(record.gf_rating == rating):
                return record.rating_weight

        return None

    @staticmethod
    def apwHtmlEscape(html):
        """
        Escapes the string to it's correct html code, for display on fusion charts
        """
        s = mark_safe(force_text(html).replace('&', '%26amp;').replace('<', '%26lt;').replace('>', '%26gt;').replace('"', '%26quot;').replace("'", '%26apos;'))

        return mark_safe(s).encode('ascii', 'xmlcharrefreplace')

    @staticmethod
    def numberFormat(num, places=0):
        """Format a number according to locality and given places"""
        locale.setlocale(locale.LC_ALL, locale.getdefaultlocale()[0] + '.' + locale.getdefaultlocale()[1])
        return locale.format("%.*f", (places, num), 1)

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
        ret = None
        if isinstance(data, list):
            ret = _list(data)
        elif isinstance(data, dict):
            ret = _dict(data)
        elif isinstance(data, Decimal):
            # json.dumps() cant handle Decimal
            ret = str(data)
        elif isinstance(data, models.query.QuerySet):
            # Actually its the same as a list ...
            ret = _list(data)
        elif isinstance(data, models.Model):
            ret = _model(data)
        elif isinstance(data, bytes):
            ret = data.decode('utf-8')
        else:
            ret = data
        return ret

    def _model(data):
        ret = {}
        # If we only have a model, we only want to encode the fields.
        for f in data._meta.fields:
            ret[f.attname] = _any(getattr(data, f.attname))
        # And additionally encode arbitrary properties that had been added.
        #fields = dir(data.__class__) + ret.keys()
        #add_ons = [k for k in dir(data) if k not in fields]
        #for k in add_ons:
            #ret[k] = _any(getattr(data, k))
        return ret

    def _list(data):
        ret = []
        for v in data:
            ret.append(_any(v))
        return ret

    def _dict(data):
        ret = {}
        for k, v in data.items():
            ret[k] = _any(v)
        return ret

    ret = _any(data)

    return json.dumps(ret, cls=DjangoJSONEncoder)

