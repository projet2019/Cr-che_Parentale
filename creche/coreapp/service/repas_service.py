#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author Nadia
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
            filterObj = filterObj & Q(identity_number = params.get('searchIDNO'))
        if params.get('searchEmail'):
            filterObj = filterObj & Q(email = params.get('searchEmail'))

        result = Repas.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort'])[
                 sortLimitParams['start']: sortLimitParams['limit']]
        count = Repas.objects.filter(filterObj).count()

        records = []
        for item in result:

            record = {}
            record['id'] = item.id
            record['telephone'] = item.telephone.encode('utf-8')
            record['id_number'] = item.identity_number.encode('utf-8')
            record['date_created'] = item.date_created.isoformat()
            record['children'] = [ {"names": ch.names, "regno": ch.regno, "id": ch.id} for ch in item.children]
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

    def register_repas(self, postValues):
        """
        we assume we will not register a child without a parent, and a parent without a child
        :param postValues:
        :return:
        """
        repas = None
        params = postValues.copy()

        if params.get('components'):

            try:
                repas = Repas.objects.get(id = params.get('repas_id'))
                repas.unit_price = params.get('unit_price')
                repas.date_time = datetime.now()
            except Repas.DoesNotExist:
                repas = Repas( unit_price=params.get('unit_price'),
                               date_time=datetime.now()
                                )
            try:
                repas.save()
                components = params.get('components')
                for comp in components:
                    self.add_component(repas, comp_name = comp)

                if repas.menu.count() == 0:
                    raise CriticalError({'message': "The menu was not saved. Try again."})
            except Exception:
                raise CriticalError({'message': "Unkwon Error while saving repas and menu. Try again or contact system admin "})

        return repas

    def add_component(self, repasObj,  comp_id = None, comp_name = None):
        if comp_id:
            repasObj.menu.add(ComposantRepas.objects.get(id = comp_id))
        if comp_name:
            repasObj.menu.add(ComposantRepas.objects.get(name = comp_name))
        repasObj.save()

        return repasObj
