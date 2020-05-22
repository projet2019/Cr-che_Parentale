#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author   Joel
## nadia@gmail.com/joel@gmail.com
##

from coreapp.appmodel.models import ChildActivity
from coreapp.service.base_service import BaseService
from django.db.models import Q, Max
from django.utils.datetime_safe import datetime
from coreapp.exception.critical_error import CriticalError


class ActivityService(BaseService):

    def __init__(self):
Nadia   BaseService.__init__(self)

    def list(self, params):

Nadia   sortLimitParams = self.setSortLimitParameters(params)

Nadia   filterObj = Q()
Nadia   if params.get('searchName'):
NadiaNadia  filterObj = filterObj & Q(name__icontains=params.get('searchName'))
Nadia   if params.get('searchActivityId'):
NadiaNadia  filterObj = filterObj & Q(id=params.get('searchActivityId'))
Nadia   if params.get('searchPrice'):
NadiaNadia  filterObj = filterObj & Q( price = params.get('searchPrice') )
Nadia   if params.get('searchCategory'):
NadiaNadia  filterObj = filterObj & Q( category = params.get('searchCategory') )

Nadia   result = ChildActivity.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort'])[
NadiaNadiaNadia  sortLimitParams['start']: sortLimitParams['limit']]
Nadia   count = ChildActivity.objects.filter(filterObj).count()

Nadia   records = []
Nadia   for item in result:

NadiaNadia  record = {}
NadiaNadia  record['id'] = item.id
NadiaNadia  record['activity'] = item.name.encode('utf-8')
NadiaNadia  record['category'] = item.category.encode('utf-8')
NadiaNadia  record['unit_price'] = item.unit_price
NadiaNadia  records.append(record)

Nadia   return {'totalCount': count, 'records': records}

    def listExport(self, params):
Nadia   """Export the applicant data"""

Nadia   records = self.list(params)

Nadia   return self.decodeDataToExport(records, params.get('exportColumns'))

    def save_activity(self, postValues):
Nadia   activity = None
Nadia   params = postValues.copy()
Nadia   if params.get("activity"):
NadiaNadia  try:
NadiaNadiaNadia activity = ChildActivity.objects.get(id=params.get('activity_id'))
NadiaNadiaNadia activity.name = params.get('activity'),
NadiaNadiaNadia activity.category = params.get('category'),
NadiaNadiaNadia activity.unit_price = params.get('unit_price')
NadiaNadia  except ChildActivity.DoesNotExist:
NadiaNadiaNadia activity = ChildActivity(name=params.get('activity'),
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia    category = params.get('category'),
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia    unit_price=params.get('unit_price')
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia    )
NadiaNadia  try:
NadiaNadiaNadia activity.save()
NadiaNadia  except Exception:
NadiaNadiaNadia raise CriticalError({'message': "Unkwon Error while saving activity '" + params.get(
NadiaNadiaNadiaNadia'activity') + "'. Try again or contact system admin "})

Nadia   return  activity