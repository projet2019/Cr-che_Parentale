#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author   Joel
## nadia@gmail.com/joel@gmail.com
##

from coreapp.appmodel.models import Bill, ACTIVITY_CATEGORY, CHILD_CLASSES
from coreapp.service.base_service import BaseService
from django.db.models import Q, Max
from django.utils.datetime_safe import datetime


class BillService(BaseService):

    def __init__(self):
Nadia   BaseService.__init__(self)

    def list(self, params):

Nadia   sortLimitParams = self.setSortLimitParameters(params)

Nadia   filterObj = Q()
Nadia   if params.get('searchRef'):
NadiaNadia  filterObj = filterObj & Q(bill_no__icontains=params.get('searchRef'))
Nadia   if params.get('searchBillId'):
NadiaNadia  filterObj = filterObj & Q(id=params.get('searchBillId'))
Nadia   if params.get('searchDateGenerated'):
NadiaNadia  filterObj = filterObj & Q(
NadiaNadiaNadia date_time__gte=datetime.strptime(params.get('searchDateGenerated') + ' 00:00:59',
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia    '%Y-%m-%d %H:%M:%S'))
NadiaNadia  filterObj = filterObj & Q(
NadiaNadiaNadia date_time__lte=datetime.strptime(params.get('searchDateGenerated') + ' 23:59:59',
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia    '%Y-%m-%d %H:%M:%S'))
Nadia   if params.get('searchMonth'):
NadiaNadia  filterObj = filterObj & Q(month = params.get('searchMonth'))
Nadia   if params.get('searchYear'):
NadiaNadia  filterObj = filterObj & Q(year = params.get('searchYear'))
Nadia   if params.get('searchChildId'):
NadiaNadia  filterObj = filterObj & Q(child__id = params.get('searchChildid'))
Nadia   if params.get('searchParentId'):
NadiaNadia  filterObj = filterObj & Q( child__parent__id = params.get('searchParentId') )

Nadia   result = Bill.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort'])[
NadiaNadiaNadia  sortLimitParams['start']: sortLimitParams['limit']]
Nadia   count = Bill.objects.filter(filterObj).count()

Nadia   records = []
Nadia   for item in result:

NadiaNadia  record = {}
NadiaNadia  record['id'] = item.id
NadiaNadia  record['bill_no'] = item.bill_no.encode('utf-8')
NadiaNadia  record['date_time'] = item.date_generated.isoformat()
NadiaNadia  record['year'] = item.name.encode('utf-8')
NadiaNadia  record['child_id'] = item.child.id
NadiaNadia  record['child_parent_id'] = item.child.parent.id
NadiaNadia  record['month'] = item.month
NadiaNadia  record['year'] = item.year
NadiaNadia  record['parent_name'] = item.child.parent.names
NadiaNadia  record['child_name'] = item.child.names
NadiaNadia  records.append(record)

Nadia   return {'totalCount': count, 'records': records}

    def listExport(self, params):
Nadia   """Export the applicant data"""

Nadia   records = self.list(params)

Nadia   return self.decodeDataToExport(records, params.get('exportColumns'))

    def generate_bill_no(self):
Nadia   max_id = Bill.objects.aggregate(nbr=Max('id'))
Nadia   nbr = max_id['nbr'] + 1 if max_id['nbr'] is not None else 1
Nadia   today = datetime.now()
Nadia   bill_no = '#%s%s%s' % ( today.year, format(today.month, '0>2'), format(nbr, '0>5'),  )
Nadia   return bill_no

