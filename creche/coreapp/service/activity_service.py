#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author Nadia
## nadia@gmail.com/joel@gmail.com
##

from coreapp.appmodel.models import ChildActivity
from coreapp.service.base_service import BaseService
from django.db.models import Q, Max
from django.utils.datetime_safe import datetime
from coreapp.exception.critical_error import CriticalError


class ActivityService(BaseService):

    def __init__(self):
        BaseService.__init__(self)

    def list(self, params):

        sortLimitParams = self.setSortLimitParameters(params)

        filterObj = Q()
        if params.get('searchName'):
            filterObj = filterObj & Q(name__icontains=params.get('searchName'))
        if params.get('searchActivityId'):
            filterObj = filterObj & Q(id=params.get('searchActivityId'))
        if params.get('searchPrice'):
            filterObj = filterObj & Q( price = params.get('searchPrice') )
        if params.get('searchCategory'):
            filterObj = filterObj & Q( category = params.get('searchCategory') )

        result = ChildActivity.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort'])[
                 sortLimitParams['start']: sortLimitParams['limit']]
        count = ChildActivity.objects.filter(filterObj).count()

        records = []
        for item in result:

            record = {}
            record['id'] = item.id
            record['activity'] = item.name.encode('utf-8')
            record['category'] = item.category.encode('utf-8')
            record['unit_price'] = item.unit_price
            records.append(record)

        return {'totalCount': count, 'records': records}

    def listExport(self, params):
        """Export the applicant data"""

        records = self.list(params)

        return self.decodeDataToExport(records, params.get('exportColumns'))

    def save_activity(self, postValues):
        activity = None
        params = postValues.copy()
        if params.get("activity"):
            try:
                activity = ChildActivity.objects.get(id=params.get('activity_id'))
                activity.name = params.get('activity'),
                activity.category = params.get('category'),
                activity.unit_price = params.get('unit_price')
            except ChildActivity.DoesNotExist:
                activity = ChildActivity(name=params.get('activity'),
                                            category = params.get('category'),
                                            unit_price=params.get('unit_price')
                                            )
            try:
                activity.save()
            except Exception:
                raise CriticalError({'message': "Unkwon Error while saving activity '" + params.get(
                    'activity') + "'. Try again or contact system admin "})

        return  activity