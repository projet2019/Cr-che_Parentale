#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author Nadia
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
        BaseService.__init__(self)

    def list(self, params):

        sortLimitParams = self.setSortLimitParameters(params)

        filterObj = Q()
        if params.get('searchName'):
            filterObj = filterObj & Q(names__icontains=params.get('searchName'))
        if params.get('searchParentId'):
            filterObj = filterObj & Q(id=params.get('searchCParentId'))
        if params.get('searchDateCreated'):
            filterObj = filterObj & Q(
                date_created__gte=datetime.strptime(params.get('searchDateCreated') + ' 00:00:59',
                                                      '%Y-%m-%d %H:%M:%S'))
            filterObj = filterObj & Q(
                date_created__lte=datetime.strptime(params.get('searchDateCreated') + ' 23:59:59',
                                                      '%Y-%m-%d %H:%M:%S'))
        if params.get('searchTelephone'):
            filterObj = filterObj & Q(telephone = params.get('searchTelephone'))
        if params.get('searchIDNO'):
            filterObj = filterObj & Q(identity_document = params.get('searchIDNO'))
        if params.get('searchEmail'):
            filterObj = filterObj & Q(email = params.get('searchEmail'))

        result = CrecheParent.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort'])[
                 sortLimitParams['start']: sortLimitParams['limit']]
        count = CrecheParent.objects.filter(filterObj).count()

        records = []
        for item in result:

            record = {}
            record['id'] = item.id
            record['telephone'] = item.telephone.encode('utf-8')
            record['id_number'] = item.identity_document.encode('utf-8')
            record['date_created'] = item.date_created.isoformat()
            record['children'] = [ {"names": ch.names, "regno": ch.regno, "id": ch.id} for ch in item.children.all()]
            record['address'] = item.full_address.encode('utf-8')
            record['email'] = item.email.encode('utf-8')
            record['names'] = item.names
            record['relationship'] = item.relationship.encode('utf-8')
            records.append(record)

        return {'totalCount': count, 'records': records}

    def listExport(self, params):
        """Export the applicant data"""

        records = self.list(params)

        return self.decodeDataToExport(records, params.get('exportColumns'))

    def save_parent(self, postValues):
        """
        we assume we will not register a child without a parent, and a parent without a child
        :param postValues:
        :return:
        """
        parent = None
        params = postValues.copy()

        if params.get('parent_names'):

            try:
                parent = CrecheParent.objects.get(id = params.get('id_number'))
                parent.names = params.get('parent_names')
                parent.telephone = params.get('telephone')
                parent.identity_number = params.get('id_number')
                parent.relationship = params.get('relationship')
                parent.full_address = params.get('full_address')
                parent.email = params.get('email'),
                parent.last_updated = datetime.now()
            except CrecheParent.DoesNotExist:
                parent = CrecheParent( names = params.get('parent_names'),
                                       telephone = params.get('telephone'),
                                       identity_number = params.get('id_number'),
                                       relationship=params.get('relationship'),
                                       full_address=params.get('full_address'),
                                       email=params.get('email'),
                                       date_created=datetime.now(),
                                       last_updated = datetime.now()
                                        )
            try:
                parent.save()
            except Exception:
                raise CriticalError({'message': "Unkwon Error while saving parent '" + params.get("parent_names") + "'. Try again or contact system admin "})

        return parent

    def save_parent_child(self, postValues):
        """
        we assume we will not register a child without a parent, and a parent without a child
        :param postValues:
        :return:
        """
        parent = None
        child  = None
        params = postValues.copy()

        if params.get('parent_names'):

            try:
                parent = CrecheParent.objects.get(id = params.get('id_number'))
                parent.names = params.get('parent_names')
                parent.telephone = params.get('telephone')
                parent.identity_document = params.get('id_number')
                parent.relationship = params.get('relationship')
                parent.full_address = params.get('full_address')
                parent.email = params.get('email'),
                parent.last_updated = datetime.now()
            except CrecheParent.DoesNotExist:
                parent = CrecheParent( names = params.get('parent_names'),
                                       telephone = params.get('telephone'),
                                       identity_document = params.get('id_number'),
                                       relationship=params.get('relationship'),
                                       full_address=params.get('full_address'),
                                       email=params.get('email'),
                                       date_created=datetime.now(),
                                       last_updated = datetime.now()
                                        )
            try:
                child_service = ChildService()
                child = child_service.save_child(postValues)
                print("CHILD : ", child.__dict__)
                if child:
                    parent.save()
                    parent.children.add(child)
                    #parent.save()
                else:
                    raise CriticalError({'message': "The child '" + params.get(
                        'child_names') + "' of parent '" + params.get("parent_names") + "' was not saved. Try again "})
            except Exception as e:
                try:
                    child.delete()
                    parent.delete()
                except Exception as ex:
                    print("ERROR ROLLING BACK", ex)
                print("PARENT CHILD ERROR ", e)
                raise CriticalError({'message': "Unkwon Error while saving child '" + params.get(
                    'child_names') + "' of parent '" + params.get("parent_names") + "'. Try again or contact system admin "})

        return parent, child

    def add_child(self, parentObj,  child_id = None, regno = None):

        if child_id:
            parentObj.children.add(CrecheChild.objects.get(id= child_id))
        if regno:
            parentObj.children.add(CrecheChild.objects.get(regno=regno))
        parentObj.save()

        return parentObj
