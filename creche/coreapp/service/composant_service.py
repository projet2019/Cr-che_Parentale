#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author Nadia
## nadia@gmail.com/joel@gmail.com
##

from coreapp.appmodel.models import ComposantRepas
from coreapp.service.base_service import BaseService
from django.db.models import Q, Max
from django.utils.datetime_safe import datetime
from coreapp.exception.critical_error import CriticalError


class ComposantService(BaseService):

    def __init__(self):
        BaseService.__init__(self)

    def list(self, params):

        sortLimitParams = self.setSortLimitParameters(params)

        filterObj = Q()
        if params.get('searchName'):
            filterObj = filterObj & Q(component_name__icontains=params.get('searchName'))
        if params.get('searchComponentId'):
            filterObj = filterObj & Q(id=params.get('searchComponentId'))
        if params.get('searchDescription'):
            filterObj = filterObj & Q( description = params.get('searchDescription') )

        result = ComposantRepas.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort'])[
                 sortLimitParams['start']: sortLimitParams['limit']]
        count = ComposantRepas.objects.filter(filterObj).count()

        records = []
        for item in result:

            record = {}
            record['id'] = item.id
            record['component'] = item.component_name.encode('utf-8')
            record['description'] = item.description.encode('utf-8')
            records.append(record)

        return {'totalCount': count, 'records': records}

    def listExport(self, params):
        """Export the applicant data"""

        records = self.list(params)

        return self.decodeDataToExport(records, params.get('exportColumns'))

    def save_component(self, postValues):
        component = None
        params = postValues.copy()
        if params.get("component"):
            try:
                component = ComposantRepas.objects.get(id=params.get('component_id'))
                component.component_name = params.get('component')
                component.description = params.get('description')
            except ComposantRepas.DoesNotExist:
                component = ComposantRepas(component_name=params.get('component'),
                                            description = params.get('description')
                                            )
            try:
                component.save()
            except Exception:
                raise CriticalError({'message': "Unkwon Error while saving component '" + params.get(
                    'component') + "'. Try again or contact system admin "})

        return  component