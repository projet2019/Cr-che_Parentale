#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author Nadia
## nadia@gmail.com/joel@gmail.com
##

from coreapp.appmodel.models import CrechePrincipal, PRINCIPAL_ROLE
from coreapp.service.base_service import BaseService
from django.db.models import Q, Max
from django.utils.datetime_safe import datetime
from coreapp.exception.critical_error import CriticalError


class PrincipalService(BaseService):

    def __init__(self):
        BaseService.__init__(self)

    def list(self, params):

        sortLimitParams = self.setSortLimitParameters(params)

        filterObj = Q()
        if params.get('searchName'):
            filterObj = filterObj & Q(names__icontains=params.get('searchName'))
        if params.get('searchPrincipalId'):
            filterObj = filterObj & Q(id=params.get('searchPrincipalId'))
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


        result = CrechePrincipal.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort'])[
                 sortLimitParams['start']: sortLimitParams['limit']]
        count = CrechePrincipal.objects.filter(filterObj).count()

        records = []
        for item in result:
            record = {}
            record['id'] = item.id
            record['names'] = item.names.encode('utf-8')
            record['id_number'] = item.identity_document
            record['full_address'] = item.full_address.encode('utf-8')
            record['telephone'] = item.telephone
            record['role'] = item.role.encode('utf-8')
            record['email'] = item.email.encode('utf-8')
            record['date_created'] = item.date_created.isoformat()
            records.append(record)

        return {'totalCount': count, 'records': records}

    def listExport(self, params):
        """Export the applicant data"""

        records = self.list(params)

        return self.decodeDataToExport(records, params.get('exportColumns'))


    def save_principal(self, postValues):
        principal = None
        params = postValues.copy()
        if params.get("principal_names"):
            try:
                principal = CrechePrincipal.objects.get(id=params.get('principal_id'))
                principal.names = params.get('principal_names')
                principal.telephone = params.get('telephone')
                principal.identity_document = params.get('id_number')
                principal.role = params.get('role')
                principal.full_address = params.get('full_address')
                principal.email = params.get('email')
                principal.last_updated = datetime.now()
            except CrechePrincipal.DoesNotExist:
                principal = CrechePrincipal(   names = params.get('principal_names'),
                                       telephone = params.get('telephone'),
                                       identity_document = params.get('id_number'),
                                       role=params.get('role'),
                                       full_address=params.get('full_address'),
                                       email=params.get('email'),
                                       date_created=datetime.now(),
                                       last_updated = datetime.now()
                                    )
            try:
                principal.save()
            except Exception:
                raise CriticalError({'message': "Unkwon Error while saving principal '" + params.get(
                    'principal_names') + "'. Try again or contact system admin "})

        return  principal

    def get_principal(self, idno = None, email = None, principal_id = None):
        principal = None
        if idno: principal =  CrechePrincipal.objects.get(identity_document = idno)
        if email: principal = CrechePrincipal.objects.get(email=email)
        if principal_id: principal = CrechePrincipal.objects.get(id = principal_id)
        return  principal