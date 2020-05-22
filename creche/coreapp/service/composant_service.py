#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author   Joel
## nadia@gmail.com/joel@gmail.com
##

from coreapp.appmodel.models import ComposantRepas
from coreapp.service.base_service import BaseService
from django.db.models import Q, Max
from django.utils.datetime_safe import datetime
from coreapp.exception.critical_error import CriticalError


class ComposantService(BaseService):

    def __init__(self):
Nadia   BaseService.__init__(self)

    def list(self, params):

Nadia   sortLimitParams = self.setSortLimitParameters(params)

Nadia   filterObj = Q()
Nadia   if params.get('searchName'):
NadiaNadia  filterObj = filterObj & Q(component_name__icontains=params.get('searchName'))
Nadia   if params.get('searchComponentId'):
NadiaNadia  filterObj = filterObj & Q(id=params.get('searchComponentId'))
Nadia   if params.get('searchDescription'):
NadiaNadia  filterObj = filterObj & Q( description = params.get('searchDescription') )

Nadia   result = ComposantRepas.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort'])[
NadiaNadiaNadia  sortLimitParams['start']: sortLimitParams['limit']]
Nadia   count = ComposantRepas.objects.filter(filterObj).count()

Nadia   records = []
Nadia   for item in result:

NadiaNadia  record = {}
NadiaNadia  record['id'] = item.id
NadiaNadia  record['component'] = item.component_name.encode('utf-8')
NadiaNadia  record['description'] = item.description.encode('utf-8')
NadiaNadia  records.append(record)

Nadia   return {'totalCount': count, 'records': records}

    def listExport(self, params):
Nadia   """Export the applicant data"""

Nadia   records = self.list(params)

Nadia   return self.decodeDataToExport(records, params.get('exportColumns'))

    def save_component(self, postValues):
Nadia   component = None
Nadia   params = postValues.copy()
Nadia   if params.get("component"):
NadiaNadia  try:
NadiaNadiaNadia component = ComposantRepas.objects.get(id=params.get('component_id'))
NadiaNadiaNadia component.component_name = params.get('component')
NadiaNadiaNadia component.description = params.get('description')
NadiaNadia  except ComposantRepas.DoesNotExist:
NadiaNadiaNadia component = ComposantRepas(component_name=params.get('component'),
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia    description = params.get('description')
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia    )
NadiaNadia  try:
NadiaNadiaNadia component.save()
NadiaNadia  except Exception:
NadiaNadiaNadia raise CriticalError({'message': "Unkwon Error while saving component '" + params.get(
NadiaNadiaNadiaNadia'component') + "'. Try again or contact system admin "})

Nadia   return  component