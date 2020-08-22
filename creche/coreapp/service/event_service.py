#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author Nadia
## nadia@gmail.com/joel@gmail.com
##

from coreapp.appmodel.models import EmailSchedule, Event
from coreapp.service.base_service import BaseService
from django.db.models import Q
from django.utils.datetime_safe import datetime

class EventService(BaseService):

    def __init__(self):
        BaseService.__init__(self)

    def list(self, params):

        sortLimitParams = self.setSortLimitParameters(params)
        
        filterObj = Q()
        if params.get('searchName'):
            filterObj = filterObj & Q(name__icontains=params.get('searchName'))
        if params.get('searchEventTypeId'):
            filterObj = filterObj & Q(event_type__id=params.get('searchEventTypeId'))
        if params.get('searchDateGenerated'):
            filterObj = filterObj & Q(date_generated__gte=datetime.strptime(params.get('searchDateGenerated') + ' 00:00:59', '%Y-%m-%d %H:%M:%S'))
            filterObj = filterObj & Q(date_generated__lte=datetime.strptime(params.get('searchDateGenerated') + ' 23:59:59', '%Y-%m-%d %H:%M:%S'))
        if params.get('searchProcessed'):
            filterObj = filterObj & Q(processed=1 if 'true' == params.get('searchProcessed') else 0);
        if params.get('searchRefId'):
            filterObj = filterObj & Q(entity_reference_id=params.get('searchRefId'))
        if params.get('searchIds'):
            filterObj = filterObj & Q(id__in=eval(params.get('searchIds')))

        result = Event.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort']) [sortLimitParams['start']: sortLimitParams['limit']]
        count = Event.objects.filter(filterObj).count()

        records = []
        for item in result:
            record = {}

            record['id'] = item.id
            record['event_type'] = item.event_type.name.encode('utf-8')
            record['date_generated'] = item.date_generated.isoformat()
            record['name'] = item.name.encode('utf-8')
            record['entity_reference_id'] = item.entity_reference_id
            record['processed'] = item.processed
            #get the recipients for this event
            record['recipient_count'] = EmailSchedule.objects.filter(event__id=item.id).count()
            
            records.append(record)
        
        return {'totalCount': count, 'records': records}

    def listExport(self, params):
        """Export the applicant data"""

        records = self.list(params)

        return self.decodeDataToExport(records, params.get('exportColumns'))

