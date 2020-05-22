#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author Nadia
## nadia@gmail.com/joel@gmail.com
##

from coreapp.appmodel.models import Bill, ACTIVITY_CATEGORY, CHILD_CLASSES
from coreapp.service.base_service import BaseService
from django.db.models import Q, Max
from django.utils.datetime_safe import datetime


class BillService(BaseService):

    def __init__(self):
        BaseService.__init__(self)

    def list(self, params):

        sortLimitParams = self.setSortLimitParameters(params)

        filterObj = Q()
        if params.get('searchRef'):
            filterObj = filterObj & Q(bill_no__icontains=params.get('searchRef'))
        if params.get('searchBillId'):
            filterObj = filterObj & Q(id=params.get('searchBillId'))
        if params.get('searchDateGenerated'):
            filterObj = filterObj & Q(
                date_time__gte=datetime.strptime(params.get('searchDateGenerated') + ' 00:00:59',
                                                      '%Y-%m-%d %H:%M:%S'))
            filterObj = filterObj & Q(
                date_time__lte=datetime.strptime(params.get('searchDateGenerated') + ' 23:59:59',
                                                      '%Y-%m-%d %H:%M:%S'))
        if params.get('searchMonth'):
            filterObj = filterObj & Q(month = params.get('searchMonth'))
        if params.get('searchYear'):
            filterObj = filterObj & Q(year = params.get('searchYear'))
        if params.get('searchChildId'):
            filterObj = filterObj & Q(child__id = params.get('searchChildid'))
        if params.get('searchParentId'):
            filterObj = filterObj & Q( child__parent__id = params.get('searchParentId') )

        result = Bill.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort'])[
                 sortLimitParams['start']: sortLimitParams['limit']]
        count = Bill.objects.filter(filterObj).count()

        records = []
        for item in result:

            record = {}
            record['id'] = item.id
            record['bill_no'] = item.bill_no.encode('utf-8')
            record['date_time'] = item.date_generated.isoformat()
            record['year'] = item.name.encode('utf-8')
            record['child_id'] = item.child.id
            record['child_parent_id'] = item.child.parent.id
            record['month'] = item.month
            record['year'] = item.year
            record['parent_name'] = item.child.parent.names
            record['child_name'] = item.child.names
            records.append(record)

        return {'totalCount': count, 'records': records}

    def listExport(self, params):
        """Export the applicant data"""

        records = self.list(params)

        return self.decodeDataToExport(records, params.get('exportColumns'))

    def generate_bill_no(self):
        max_id = Bill.objects.aggregate(nbr=Max('id'))
        nbr = max_id['nbr'] + 1 if max_id['nbr'] is not None else 1
        today = datetime.now()
        bill_no = '#%s%s%s' % ( today.year, format(today.month, '0>2'), format(nbr, '0>5'),  )
        return bill_no

