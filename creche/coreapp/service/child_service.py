#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author   Joel
## nadia@gmail.com/joel@gmail.com
##

from coreapp.appmodel.models import CrecheChild, GENDER, CHILD_CLASSES
from coreapp.service.base_service import BaseService
from django.db.models import Q, Max
from django.utils.datetime_safe import datetime
from coreapp.exception.critical_error import CriticalError


class ChildService(BaseService):

    def __init__(self):
Nadia   BaseService.__init__(self)

    def list(self, params):

Nadia   sortLimitParams = self.setSortLimitParameters(params)

Nadia   filterObj = Q()
Nadia   if params.get('searchName'):
NadiaNadia  filterObj = filterObj & Q(names__icontains=params.get('searchName'))
Nadia   if params.get('searchChildId'):
NadiaNadia  filterObj = filterObj & Q(id=params.get('searchChildId'))
Nadia   if params.get('searchDateCreated'):
NadiaNadia  filterObj = filterObj & Q(
NadiaNadiaNadia date_created__gte=datetime.strptime(params.get('searchDateCreated') + ' 00:00:59',
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia    '%Y-%m-%d %H:%M:%S'))
NadiaNadia  filterObj = filterObj & Q(
NadiaNadiaNadia date_created__lte=datetime.strptime(params.get('searchDateCreated') + ' 23:59:59',
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia    '%Y-%m-%d %H:%M:%S'))
Nadia   if params.get('searchDOB'):
NadiaNadia  filterObj = filterObj & Q(date_of_birth = params.get('searchDOB'))
Nadia   if params.get('searchGender'):
NadiaNadia  filterObj = filterObj & Q(gender = params.get('searchGender'))
Nadia   if params.get('searchGroup'):
NadiaNadia  filterObj = filterObj & Q(group = params.get('searchGroup'))
Nadia   if params.get('searchRegno'):
NadiaNadia  filterObj = filterObj & Q( regno = params.get('searchRegno') )

Nadia   result = CrecheChild.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort'])[
NadiaNadiaNadia  sortLimitParams['start']: sortLimitParams['limit']]
Nadia   count = CrecheChild.objects.filter(filterObj).count()

Nadia   records = []
Nadia   for item in result:

NadiaNadia  record = {}
NadiaNadia  record['id'] = item.id
NadiaNadia  record['regno'] = item.regno.encode('utf-8')
NadiaNadia  record['dob'] = item.date_of_birth.isoformat()
NadiaNadia  record['group'] = item.group.encode('utf-8')
NadiaNadia  record['gender'] = item.gender.encode('utf-8')
NadiaNadia  record['names'] = item.names
NadiaNadia  record['reg_date'] = item.date_created.isoformat()
NadiaNadia  records.append(record)

Nadia   return {'totalCount': count, 'records': records}

    def listExport(self, params):
Nadia   """Export the applicant data"""

Nadia   records = self.list(params)

Nadia   return self.decodeDataToExport(records, params.get('exportColumns'))

    def generate_regno(self):
Nadia   max_id = CrecheChild.objects.aggregate(nbr=Max('id'))
Nadia   nbr = max_id['nbr'] + 1 if max_id['nbr'] is not None else 1
Nadia   regno = 'C%s' % ( format(nbr, '0>5'),  )
Nadia   return regno

    def get_child(self, regno = None, child_id = None):
Nadia   child = None
Nadia   try:
NadiaNadia  if regno: child =  CrecheChild.objects.get(regno = regno)
NadiaNadia  if child_id: child = CrecheChild.objects.get(id = child_id)
Nadia   except Exception as e:
NadiaNadia  print("CHILD ERROR ", e)
Nadia   return  child

    def save_child(self, postValues):
Nadia   child = None
Nadia   params = postValues.copy()
Nadia   if params.get("child_names"):
NadiaNadia  try:
NadiaNadiaNadia child = CrecheChild.objects.get(id=params.get('child_id'))
NadiaNadiaNadia child.names = params.get('child_names')
NadiaNadiaNadia child.date_of_birth = params.get('dob')
NadiaNadiaNadia child.group = params.get('group')
NadiaNadiaNadia child.gender = params.get('gender')
NadiaNadiaNadia child.last_updated = datetime.now()
NadiaNadia  except CrecheChild.DoesNotExist:
NadiaNadiaNadia regno = self.generate_regno()
NadiaNadiaNadia if self.get_child(regno = regno): regno = self.generate_regno()
NadiaNadiaNadia child = CrecheChild(names=params.get('child_names'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia regno= regno, #TODO need to find asolution while saving concurrently
NadiaNadiaNadiaNadiaNadiaNadiaNadia date_of_birth = params.get('dob'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia group = params.get('group'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia gender = params.get('gender'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia date_created = datetime.now(),
NadiaNadiaNadiaNadiaNadiaNadiaNadia last_updated = datetime.now()
NadiaNadiaNadiaNadiaNadiaNadiaNadia )
NadiaNadia  try:
NadiaNadiaNadia child.save()

NadiaNadia  except Exception:
NadiaNadiaNadia raise CriticalError({'message': "Unkwon Error while saving child '" + params.get(
NadiaNadiaNadiaNadia'child_names') + "'. Try again or contact system admin "})

Nadia   return  child