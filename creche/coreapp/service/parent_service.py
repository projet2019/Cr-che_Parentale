#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author   Joel
## nadia@gmail.com/joel@gmail.com
##

from coreapp.appmodel.models import CrecheParent, CrecheChild, PARENT_CHILD_RELATION
from coreapp.service.base_service import BaseService
from coreapp.service.child_service import ChildService, GENDER, CHILD_CLASSES
from coreapp.exception.critical_error import CriticalError
from django.db.models import Q, Max
from django.utils.datetime_safe import datetime


class ParentService(BaseService):

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
NadiaNadia  filterObj = filterObj & Q(identity_document = params.get('searchIDNO'))
Nadia   if params.get('searchEmail'):
NadiaNadia  filterObj = filterObj & Q(email = params.get('searchEmail'))

Nadia   result = CrecheParent.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort'])[
NadiaNadiaNadia  sortLimitParams['start']: sortLimitParams['limit']]
Nadia   count = CrecheParent.objects.filter(filterObj).count()

Nadia   records = []
Nadia   for item in result:

NadiaNadia  record = {}
NadiaNadia  record['id'] = item.id
NadiaNadia  record['telephone'] = item.telephone.encode('utf-8')
NadiaNadia  record['id_number'] = item.identity_document.encode('utf-8')
NadiaNadia  record['date_created'] = item.date_created.isoformat()
NadiaNadia  record['children'] = [ {"names": ch.names, "regno": ch.regno, "id": ch.id} for ch in item.children.all()]
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

    def save_parent(self, postValues):
Nadia   """
Nadia   we assume we will not register a child without a parent, and a parent without a child
Nadia   :param postValues:
Nadia   :return:
Nadia   """
Nadia   parent = None
Nadia   params = postValues.copy()

Nadia   if params.get('parent_names'):

NadiaNadia  try:
NadiaNadiaNadia parent = CrecheParent.objects.get(id = params.get('id_number'))
NadiaNadiaNadia parent.names = params.get('parent_names')
NadiaNadiaNadia parent.telephone = params.get('telephone')
NadiaNadiaNadia parent.identity_number = params.get('id_number')
NadiaNadiaNadia parent.relationship = params.get('relationship')
NadiaNadiaNadia parent.full_address = params.get('full_address')
NadiaNadiaNadia parent.email = params.get('email'),
NadiaNadiaNadia parent.last_updated = datetime.now()
NadiaNadia  except CrecheParent.DoesNotExist:
NadiaNadiaNadia parent = CrecheParent( names = params.get('parent_names'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia    telephone = params.get('telephone'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia    identity_number = params.get('id_number'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia    relationship=params.get('relationship'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia    full_address=params.get('full_address'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia    email=params.get('email'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia    date_created=datetime.now(),
NadiaNadiaNadiaNadiaNadiaNadiaNadia    last_updated = datetime.now()
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia)
NadiaNadia  try:
NadiaNadiaNadia parent.save()
NadiaNadia  except Exception:
NadiaNadiaNadia raise CriticalError({'message': "Unkwon Error while saving parent '" + params.get("parent_names") + "'. Try again or contact system admin "})

Nadia   return parent

    def save_parent_child(self, postValues):
Nadia   """
Nadia   we assume we will not register a child without a parent, and a parent without a child
Nadia   :param postValues:
Nadia   :return:
Nadia   """
Nadia   parent = None
Nadia   child  = None
Nadia   params = postValues.copy()

Nadia   if params.get('parent_names'):

NadiaNadia  try:
NadiaNadiaNadia parent = CrecheParent.objects.get(id = params.get('id_number'))
NadiaNadiaNadia parent.names = params.get('parent_names')
NadiaNadiaNadia parent.telephone = params.get('telephone')
NadiaNadiaNadia parent.identity_document = params.get('id_number')
NadiaNadiaNadia parent.relationship = params.get('relationship')
NadiaNadiaNadia parent.full_address = params.get('full_address')
NadiaNadiaNadia parent.email = params.get('email'),
NadiaNadiaNadia parent.last_updated = datetime.now()
NadiaNadia  except CrecheParent.DoesNotExist:
NadiaNadiaNadia parent = CrecheParent( names = params.get('parent_names'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia    telephone = params.get('telephone'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia    identity_document = params.get('id_number'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia    relationship=params.get('relationship'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia    full_address=params.get('full_address'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia    email=params.get('email'),
NadiaNadiaNadiaNadiaNadiaNadiaNadia    date_created=datetime.now(),
NadiaNadiaNadiaNadiaNadiaNadiaNadia    last_updated = datetime.now()
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia)
NadiaNadia  try:
NadiaNadiaNadia child_service = ChildService()
NadiaNadiaNadia child = child_service.save_child(postValues)
NadiaNadiaNadia print("CHILD : ", child.__dict__)
NadiaNadiaNadia if child:
NadiaNadiaNadiaNadiaparent.save()
NadiaNadiaNadiaNadiaparent.children.add(child)
NadiaNadiaNadiaNadia#parent.save()
NadiaNadiaNadia else:
NadiaNadiaNadiaNadiaraise CriticalError({'message': "The child '" + params.get(
NadiaNadiaNadiaNadia    'child_names') + "' of parent '" + params.get("parent_names") + "' was not saved. Try again "})
NadiaNadia  except Exception as e:
NadiaNadiaNadia try:
NadiaNadiaNadiaNadiachild.delete()
NadiaNadiaNadiaNadiaparent.delete()
NadiaNadiaNadia except Exception as ex:
NadiaNadiaNadiaNadiaprint("ERROR ROLLING BACK", ex)
NadiaNadiaNadia print("PARENT CHILD ERROR ", e)
NadiaNadiaNadia raise CriticalError({'message': "Unkwon Error while saving child '" + params.get(
NadiaNadiaNadiaNadia'child_names') + "' of parent '" + params.get("parent_names") + "'. Try again or contact system admin "})

Nadia   return parent, child

    def add_child(self, parentObj,  child_id = None, regno = None):

Nadia   if child_id:
NadiaNadia  parentObj.children.add(CrecheChild.objects.get(id= child_id))
Nadia   if regno:
NadiaNadia  parentObj.children.add(CrecheChild.objects.get(regno=regno))
Nadia   parentObj.save()

Nadia   return parentObj
