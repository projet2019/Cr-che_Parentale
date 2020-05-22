#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author   Joel
## nadia@gmail.com/joel@gmail.com
##

from coreapp.appmodel.models import EmailSchedule, Event
from coreapp.service.base_service import BaseService
from django.db.models import Q
from django.utils.datetime_safe import datetime

class EventService(BaseService):

    def __init__(self):
Nadia   BaseService.__init__(self)

    def list(self, params):

Nadia   sortLimitParams = self.setSortLimitParameters(params)
Nadia   
Nadia   filterObj = Q()
Nadia   if params.get('searchName'):
NadiaNadia  filterObj = filterObj & Q(name__icontains=params.get('searchName'))
Nadia   if params.get('searchEventTypeId'):
NadiaNadia  filterObj = filterObj & Q(event_type__id=params.get('searchEventTypeId'))
Nadia   if params.get('searchDateGenerated'):
NadiaNadia  filterObj = filterObj & Q(date_generated__gte=datetime.strptime(params.get('searchDateGenerated') + ' 00:00:59', '%Y-%m-%d %H:%M:%S'))
NadiaNadia  filterObj = filterObj & Q(date_generated__lte=datetime.strptime(params.get('searchDateGenerated') + ' 23:59:59', '%Y-%m-%d %H:%M:%S'))
Nadia   if params.get('searchProcessed'):
NadiaNadia  filterObj = filterObj & Q(processed=1 if 'true' == params.get('searchProcessed') else 0);
Nadia   if params.get('searchRefId'):
NadiaNadia  filterObj = filterObj & Q(entity_reference_id=params.get('searchRefId'))
Nadia   if params.get('searchIds'):
NadiaNadia  filterObj = filterObj & Q(id__in=eval(params.get('searchIds')))

Nadia   result = Event.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort']) [sortLimitParams['start']: sortLimitParams['limit']]
Nadia   count = Event.objects.filter(filterObj).count()

Nadia   records = []
Nadia   for item in result:
NadiaNadia  record = {}

NadiaNadia  record['id'] = item.id
NadiaNadia  record['event_type'] = item.event_type.name.encode('utf-8')
NadiaNadia  record['date_generated'] = item.date_generated.isoformat()
NadiaNadia  record['name'] = item.name.encode('utf-8')
NadiaNadia  record['entity_reference_id'] = item.entity_reference_id
NadiaNadia  record['processed'] = item.processed
NadiaNadia  #get the recipients for this event
NadiaNadia  record['recipient_count'] = EmailSchedule.objects.filter(event__id=item.id).count()
NadiaNadia  
NadiaNadia  records.append(record)
Nadia   
Nadia   return {'totalCount': count, 'records': records}

    def listExport(self, params):
Nadia   """Export the applicant data"""

Nadia   records = self.list(params)

Nadia   return self.decodeDataToExport(records, params.get('exportColumns'))

