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

class EmailScheduleService(BaseService):

    def __init__(self):
Nadia   BaseService.__init__(self)

    def list(self, params):

Nadia   sortLimitParams = self.setSortLimitParameters(params)
Nadia   
Nadia   filterObj = Q()
Nadia   if params.get('searchToEmail'):
NadiaNadia  filterObj = filterObj & Q(to_email__icontains = params.get('searchToEmail'));
Nadia   if params.get('searchDateSent'):
NadiaNadia  filterObj = filterObj & Q(sent_at__gte=datetime.strptime(params.get('searchDateSent') + ' 00:00:59', '%Y-%m-%d %H:%M:%S'))
NadiaNadia  filterObj = filterObj & Q(sent_at__lte=datetime.strptime(params.get('searchDateSent') + ' 23:59:59', '%Y-%m-%d %H:%M:%S'))
Nadia   if params.get('searchSender'):
NadiaNadia  filterObj = filterObj & Q(from_email__icontains = params.get('searchSender'));
Nadia   if params.get('searchSubject'):
NadiaNadia  filterObj = filterObj & Q(subject__icontains = params.get('searchSubject'));
Nadia   if params.get('searchMessage'):
NadiaNadia  filterObj = filterObj & Q(message_body__icontains = params.get('searchMessage'));
Nadia   if params.get('searchDateDelivered'):
NadiaNadia  filterObj = filterObj & Q(delivery_date__gte=datetime.strptime(params.get('searchDateDelivered') + ' 00:00:59', '%Y-%m-%d %H:%M:%S'))
NadiaNadia  filterObj = filterObj & Q(delivery_date__lte=datetime.strptime(params.get('searchDateDelivered') + ' 23:59:59', '%Y-%m-%d %H:%M:%S'))
Nadia   if params.get('searchRelay'):
NadiaNadia  filterObj = filterObj & Q(scheduled_for_relay=1 if 'true' == params.get('searchRelay') else 0);
Nadia   if params.get('searchIds'):
NadiaNadia  filterObj = filterObj & Q(id__in=eval(params.get('searchIds')))
Nadia   if params.get('searchEventId'):
NadiaNadia  filterObj = filterObj & Q(event__id=params.get('searchEventId'))

Nadia   result = EmailSchedule.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort']) [sortLimitParams['start']: sortLimitParams['limit']]
Nadia   count = EmailSchedule.objects.filter(filterObj).count()

Nadia   records = []
Nadia   for item in result:
NadiaNadia  record = {}

NadiaNadia  record['id'] = item.id
NadiaNadia  record['to_email'] = item.to_email
NadiaNadia  record['scheduled_for_relay'] = item.scheduled_for_relay
NadiaNadia  
NadiaNadia  if item.sent_at:
NadiaNadiaNadia record['sent_at'] = item.sent_at.isoformat()
NadiaNadia  record['from_email'] = item.from_email
NadiaNadia  record['subject'] = item.subject
NadiaNadia  record['message_body'] = item.message_body
NadiaNadia  if item.delivery_date:
NadiaNadiaNadia record['delivery_date'] = item.delivery_date.isoformat()
NadiaNadia  record['date_created'] = item.date_created.isoformat()
NadiaNadia  if item.event_id:
NadiaNadiaNadia record['event'] = Event.objects.get(pk=item.event_id).name

NadiaNadia  records.append(record)
NadiaNadiaNadia 
Nadia   return {'totalCount': count, 'records': records}

    def listExport(self, params):
Nadia   """Export the applicant data"""

Nadia   records = self.list(params)

Nadia   return self.decodeDataToExport(records, params.get('exportColumns'))

