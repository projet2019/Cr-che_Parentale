#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author   Joel
## nadia@gmail.com/joel@gmail.com
##

from coreapp.appmodel.models import Repas , ComposantRepas
from coreapp.service.base_service import BaseService
from coreapp.service.composant_service import ComposantService
from coreapp.exception.critical_error import CriticalError
from django.db.models import Q, Max
from django.utils.datetime_safe import datetime


class RepasService(BaseService):

    def __init__(self):
Nadia   BaseService.__init__(self)

    def list(self, params):

Nadia   sortLimitParams = self.setSortLimitParameters(params)

Nadia   filterObj = Q()
Nadia   if params.get('searchName'):
NadiaNadia  filterObj = filterObj & Q(names__icontains=params.get('searchName'))
Nadia   if params.get('searchParentId'):
NadiaNadia  filterObj = filterObj & Q(id=params.get('searchCParentId'))
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
NadiaNadia  filterObj = filterObj & Q(identity_number = params.get('searchIDNO'))
Nadia   if params.get('searchEmail'):
NadiaNadia  filterObj = filterObj & Q(email = params.get('searchEmail'))

Nadia   result = Repas.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort'])[
NadiaNadiaNadia  sortLimitParams['start']: sortLimitParams['limit']]
Nadia   count = Repas.objects.filter(filterObj).count()

Nadia   records = []
Nadia   for item in result:

NadiaNadia  record = {}
NadiaNadia  record['id'] = item.id
NadiaNadia  record['telephone'] = item.telephone.encode('utf-8')
NadiaNadia  record['id_number'] = item.identity_number.encode('utf-8')
NadiaNadia  record['date_created'] = item.date_created.isoformat()
NadiaNadia  record['children'] = [ {"names": ch.names, "regno": ch.regno, "id": ch.id} for ch in item.children]
NadiaNadia  record['address'] = item.full_address.encode('utf-8')
NadiaNadia  record['email'] = item.email.encode('utf-8')
NadiaNadia  record['names'] = item.names
NadiaNadia  record['relationship'] = item.relationship.encode('utf-8')
NadiaNadia  records.append(record)

Nadia   return {'totalCount': count, 'records': records}

    def listExport(self, params):
Nadia   """Export the applicant data"""

Nadia   records = self.list(params)

Nadia   return self.decodeDataToExport(records, params.get('exportColumns'))

    def register_repas(self, postValues):
Nadia   """
Nadia   we assume we will not register a child without a parent, and a parent without a child
Nadia   :param postValues:
Nadia   :return:
Nadia   """
Nadia   repas = None
Nadia   params = postValues.copy()

Nadia   if params.get('components'):

NadiaNadia  try:
NadiaNadiaNadia repas = Repas.objects.get(id = params.get('repas_id'))
NadiaNadiaNadia repas.unit_price = params.get('unit_price')
NadiaNadiaNadia repas.date_time = datetime.now()
NadiaNadia  except Repas.DoesNotExist:
NadiaNadiaNadia repas = Repas( unit_price=params.get('unit_price'),
NadiaNadiaNadiaNadiaNadiaNadia date_time=datetime.now()
NadiaNadiaNadiaNadiaNadiaNadia  )
NadiaNadia  try:
NadiaNadiaNadia repas.save()
NadiaNadiaNadia components = params.get('components')
NadiaNadiaNadia for comp in components:
NadiaNadiaNadiaNadiaself.add_component(repas, comp_name = comp)

NadiaNadiaNadia if repas.menu.count() == 0:
NadiaNadiaNadiaNadiaraise CriticalError({'message': "The menu was not saved. Try again."})
NadiaNadia  except Exception:
NadiaNadiaNadia raise CriticalError({'message': "Unkwon Error while saving repas and menu. Try again or contact system admin "})

Nadia   return repas

    def add_component(self, repasObj,  comp_id = None, comp_name = None):
Nadia   if comp_id:
NadiaNadia  repasObj.menu.add(ComposantRepas.objects.get(id = comp_id))
Nadia   if comp_name:
NadiaNadia  repasObj.menu.add(ComposantRepas.objects.get(name = comp_name))
Nadia   repasObj.save()

Nadia   return repasObj
