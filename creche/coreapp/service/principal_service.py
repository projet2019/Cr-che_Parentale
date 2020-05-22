#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author   Joel
## nadia@gmail.com/joel@gmail.com
##

from coreapp.appmodel.models import CrechePrincipal, PRINCIPAL_ROLE
from coreapp.service.base_service import BaseService
from django.db.models import Q, Max
from django.utils.datetime_safe import datetime
from coreapp.exception.critical_error import CriticalError


class PrincipalService(BaseService):

    def __init__(self):
Nadia   BaseService.__init__(self)

    def list(self, params):

Nadia   sortLimitParams = self.setSortLimitParameters(params)

Nadia   filterObj = Q()
Nadia   if params.get('searchName'):
NadiaNadia  filterObj = filterObj & Q(names__icontains=params.get('searchName'))
Nadia   if params.get('searchPrincipalId'):
NadiaNadia  filterObj = filterObj & Q(id=params.get('searchPrincipalId'))
Nadia   if params.get('searchDateCreated'):
NadiaNadia  filterObj = filterObj & Q(
NadiaNadiaNadia date_created__gte=datetime.strptime(params.get('searchDateCreated') + ' 00:00:59',
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia    '%Y-%m-%d %H:%M:%S'))
NadiaNadia  filterObj = filterObj & Q(
NadiaNadiaNadia date_created__lte=datetime.strptime(params.get('searchDateCreated') + ' 23:59:59',
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia    '%Y-%m-%d %H:%M:%S'))
Nadia   if params.get('searchTelephone'):
NadiaNadia  filterObj = filterObj & Q(telephone = params.get('searchTelephone'))
Nadia   if params.get('searchIDNO'):
NadiaNadia  filterObj = filterObj & Q(identity_document = params.get('searchIDNO'))
Nadia   if params.get('searchEmail'):
NadiaNadia  filterObj = filterObj & Q(email = params.get('searchEmail'))


Nadia   result = CrechePrincipal.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort'])[
NadiaNadiaNadia  sortLimitParams['start']: sortLimitParams['limit']]
Nadia   count = CrechePrincipal.objects.filter(filterObj).count()

Nadia   records = []
Nadia   for item in result:
NadiaNadia  record = {}
NadiaNadia  record['id'] = item.id
NadiaNadia  record['names'] = item.names.encode('utf-8')
NadiaNadia  record['id_number'] = item.identity_document
NadiaNadia  record['full_address'] = item.full_address.encode('utf-8')
NadiaNadia  record['telephone'] = item.telephone
NadiaNadia  record['role'] = item.role.encode('utf-8')
NadiaNadia  record['email'] = item.email.encode('utf-8')
NadiaNadia  record['date_created'] = item.date_created.isoformat()
NadiaNadia  records.append(record)

Nadia   return {'totalCount': count, 'records': records}

    def listExport(self, params):
Nadia   """Export the applicant data"""

Nadia   records = self.list(params)

Nadia   return self.decodeDataToExport(records, params.get('exportColumns'))


    def save_principal(self, postValues):
Nadia   principal = None
Nadia   params = postValues.copy()
Nadia   if params.get("principal_names"):
NadiaNadia  try:
NadiaNadiaNadia principal = CrechePrincipal.objects.get(id=params.get('principal_id'))
NadiaNadiaNadia principal.names = params.get('principal_names')
NadiaNadiaNadia principal.telephone = params.get('telephone')
NadiaNadiaNadia principal.identity_document = params.get('id_number')
NadiaNadiaNadia principal.role = params.get('role')
NadiaNadiaNadia principal.full_address = params.get('full_address')
NadiaNadiaNadia principal.email = params.get('email')
NadiaNadiaNadia principal.last_updated = datetime.now()
NadiaNadia  except CrechePrincipal.DoesNotExist:
NadiaNadiaNadia principal = CrechePrincipal(   names = params.get('principal_names'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia    telephone = params.get('telephone'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia    identity_document = params.get('id_number'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia    role=params.get('role'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia    full_address=params.get('full_address'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia    email=params.get('email'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia    date_created=datetime.now(),
NadiaNadiaNadiaNadiaNadiaNadiaNadia    last_updated = datetime.now()
NadiaNadiaNadiaNadiaNadiaNadiaNadia )
NadiaNadia  try:
NadiaNadiaNadia principal.save()
NadiaNadia  except Exception:
NadiaNadiaNadia raise CriticalError({'message': "Unkwon Error while saving principal '" + params.get(
NadiaNadiaNadiaNadia'principal_names') + "'. Try again or contact system admin "})

Nadia   return  principal

    def get_principal(self, idno = None, email = None, principal_id = None):
Nadia   principal = None
Nadia   if idno: principal =  CrechePrincipal.objects.get(identity_document = idno)
Nadia   if email: principal = CrechePrincipal.objects.get(email=email)
Nadia   if principal_id: principal = CrechePrincipal.objects.get(id = principal_id)
Nadia   return  principal