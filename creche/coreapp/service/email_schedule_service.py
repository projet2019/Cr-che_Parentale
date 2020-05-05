<<<<<<< Updated upstream

=======
#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author UWANTWALI ZIGAMA Didier
## d.zigama@pivotaccess.com/zigdidier@gmail.com
##
>>>>>>> Stashed changes

from coreapp.appmodel.models import EmailSchedule, Event
from coreapp.service.base_service import BaseService
from django.db.models import Q
from django.utils.datetime_safe import datetime

class EmailScheduleService(BaseService):

    def __init__(self):
        BaseService.__init__(self)

    def list(self, params):

        sortLimitParams = self.setSortLimitParameters(params)
        
        filterObj = Q()
        if params.get('searchToEmail'):
            filterObj = filterObj & Q(to_email__icontains = params.get('searchToEmail'));
        if params.get('searchDateSent'):
            filterObj = filterObj & Q(sent_at__gte=datetime.strptime(params.get('searchDateSent') + ' 00:00:59', '%Y-%m-%d %H:%M:%S'))
            filterObj = filterObj & Q(sent_at__lte=datetime.strptime(params.get('searchDateSent') + ' 23:59:59', '%Y-%m-%d %H:%M:%S'))
        if params.get('searchSender'):
            filterObj = filterObj & Q(from_email__icontains = params.get('searchSender'));
        if params.get('searchSubject'):
            filterObj = filterObj & Q(subject__icontains = params.get('searchSubject'));
        if params.get('searchMessage'):
            filterObj = filterObj & Q(message_body__icontains = params.get('searchMessage'));
        if params.get('searchDateDelivered'):
            filterObj = filterObj & Q(delivery_date__gte=datetime.strptime(params.get('searchDateDelivered') + ' 00:00:59', '%Y-%m-%d %H:%M:%S'))
            filterObj = filterObj & Q(delivery_date__lte=datetime.strptime(params.get('searchDateDelivered') + ' 23:59:59', '%Y-%m-%d %H:%M:%S'))
        if params.get('searchRelay'):
            filterObj = filterObj & Q(scheduled_for_relay=1 if 'true' == params.get('searchRelay') else 0);
        if params.get('searchIds'):
            filterObj = filterObj & Q(id__in=eval(params.get('searchIds')))
        if params.get('searchEventId'):
            filterObj = filterObj & Q(event__id=params.get('searchEventId'))

        result = EmailSchedule.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort']) [sortLimitParams['start']: sortLimitParams['limit']]
        count = EmailSchedule.objects.filter(filterObj).count()

        records = []
        for item in result:
            record = {}

            record['id'] = item.id
            record['to_email'] = item.to_email
            record['scheduled_for_relay'] = item.scheduled_for_relay
            
            if item.sent_at:
                record['sent_at'] = item.sent_at.isoformat()
            record['from_email'] = item.from_email
            record['subject'] = item.subject
            record['message_body'] = item.message_body
            if item.delivery_date:
                record['delivery_date'] = item.delivery_date.isoformat()
            record['date_created'] = item.date_created.isoformat()
            if item.event_id:
                record['event'] = Event.objects.get(pk=item.event_id).name

            records.append(record)
                
        return {'totalCount': count, 'records': records}

    def listExport(self, params):
        """Export the applicant data"""

        records = self.list(params)

        return self.decodeDataToExport(records, params.get('exportColumns'))

