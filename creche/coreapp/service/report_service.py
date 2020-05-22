#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author   Joel
## nadia@gmail.com/joel@gmail.com
##

from coreapp.appmodel.models import DailyChildReport, ChildActivity, CrecheChild
from coreapp.service.base_service import BaseService
from coreapp.service.child_service import ChildService
from coreapp.service.principal_service import PrincipalService
from coreapp.service.repas_service import RepasService
from coreapp.exception.critical_error import CriticalError
from django.db.models import Q, Max
from django.utils.datetime_safe import datetime


class ReportService(BaseService):

    def __init__(self):
Nadia   BaseService.__init__(self)

    def list(self, params):

Nadia   sortLimitParams = self.setSortLimitParameters(params)

Nadia   filterObj = Q()
Nadia   if params.get('searchName'):
NadiaNadia  filterObj = filterObj & Q(child__names__icontains=params.get('searchName'))
Nadia   if params.get('searchReportId'):
NadiaNadia  filterObj = filterObj & Q(id=params.get('searchCReportId'))
Nadia   if params.get('searchDateCreated'):
NadiaNadia  filterObj = filterObj & Q(
NadiaNadiaNadia date_created__gte=datetime.strptime(params.get('searchDateCreated') + ' 00:00:59',
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia    '%Y-%m-%d %H:%M:%S'))
NadiaNadia  filterObj = filterObj & Q(
NadiaNadiaNadia date_created__lte=datetime.strptime(params.get('searchDateCreated') + ' 23:59:59',
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia    '%Y-%m-%d %H:%M:%S'))
Nadia   if params.get('searchTelephone'):
NadiaNadia  filterObj = filterObj & Q(child__parent__telephone = params.get('searchTelephone'))
Nadia   if params.get('searchIDNO'):
NadiaNadia  filterObj = filterObj & Q(child__parent__identity_number = params.get('searchIDNO'))
Nadia   if params.get('searchEmail'):
NadiaNadia  filterObj = filterObj & Q(child__parent__email = params.get('searchEmail'))
Nadia   if params.get('searchRegno'):
NadiaNadia  filterObj = filterObj & Q(child__regno = params.get('searchRegno'))

Nadia   result = DailyChildReport.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort'])[
NadiaNadiaNadia  sortLimitParams['start']: sortLimitParams['limit']]
Nadia   count = DailyChildReport.objects.filter(filterObj).count()

Nadia   records = []
Nadia   for item in result:

NadiaNadia  record = {}
NadiaNadia  record['id'] = item.id
NadiaNadia  #record['telephone'] = item.child.parent.telephone.encode('utf-8')
NadiaNadia  #record['id_number'] = item.identity_number.encode('utf-8')
NadiaNadia  record['date_created'] = item.date_created.isoformat()
NadiaNadia  record['day'] = item.day.isoformat()
NadiaNadia  record['parents'] = [ {"names": pt.names, "telephone": pt.telephone, "relationship": pt.relationship,
NadiaNadiaNadiaNadiaNadiaNadiaNadia   "id": pt.id, "email": pt.email} for pt in item.child.parents]
NadiaNadia  record['activities'] = [{"name": act.name, "category": act.category, "price" : act.unit_price, "id": act.id} for act in item.activities]
NadiaNadia  record['components'] = [{"name": rp.name, "id": rp.id} for rp in item.repas.components]
NadiaNadia  record['repas'] = {"id": item.repas.id, "price": item.repas.unit_price}
NadiaNadia  record['day_price'] = item.day_price
NadiaNadia  record['accueillante'] = {"names": item.accueillante.names, "telephone": item.accueillante.telephone,
NadiaNadiaNadiaNadiaNadiaNadiaNadia   "id": item.accueillante.id, "email": item.accueillante.email}
NadiaNadia  record['gender'] = item.child.gender.encode('utf-8')
NadiaNadia  record['names'] = item.child.names
NadiaNadia  record['group'] = item.child.group
NadiaNadia  records.append(record)

Nadia   return {'totalCount': count, 'records': records}

    def listExport(self, params):
Nadia   """Export the applicant data"""

Nadia   records = self.list(params)

Nadia   return self.decodeDataToExport(records, params.get('exportColumns'))

    def register_report(self, postValues):
Nadia   """
Nadia   we assume we will not register a child without a report, and a report without a child
Nadia   :param postValues:
Nadia   :return:
Nadia   """
Nadia   report = None
Nadia   params = postValues.copy()

Nadia   if params.get('child'):

NadiaNadia  try:
NadiaNadiaNadia report = DailyChildReport.objects.get(id = params.get('report_id'))
NadiaNadiaNadia day_price = params.get('day_price')
NadiaNadia  except DailyChildReport.DoesNotExist:
NadiaNadiaNadia report = DailyChildReport( day_price = params.get('day_price'),
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia    date_created=datetime.now(),
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia    day = datetime.today()
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia)
NadiaNadia  try:
NadiaNadiaNadia child = ChildService.get_child(child = params.get('child'))
NadiaNadiaNadia if not child:
NadiaNadiaNadiaNadiaraise CriticalError({'message': "Report was not saved, child not found. Try again."})
NadiaNadiaNadia repas = RepasService.register_repas(postValues)
NadiaNadiaNadia if not repas:
NadiaNadiaNadiaNadiaraise CriticalError({'message': "Report was not saved, repas was not saved. Try again."})
NadiaNadiaNadia principal = PrincipalService.get_principal(principal_id=params.get('principal'))
NadiaNadiaNadia if not principal:
NadiaNadiaNadiaNadiaraise CriticalError({'message': "Report was not saved, accueillante was not saved. Try again."})
NadiaNadiaNadia report.child = child
NadiaNadiaNadia report.accueillante = principal
NadiaNadiaNadia report.repas = repas
NadiaNadiaNadia report.save()
NadiaNadiaNadia activities = params.get('activities')
NadiaNadiaNadia for act in activities:
NadiaNadiaNadiaNadiaself.add_activity(report, act)
NadiaNadiaNadia if report.activities.count() == 0:
NadiaNadiaNadiaNadiaraise CriticalError({'message': "The activities were not saved. Try again."})
NadiaNadia  except Exception:
NadiaNadiaNadia raise CriticalError({'message': "Unkwon Error while saving child daily report. Try again or contact system admin "})

Nadia   return report

    def add_activity(self, reportObj,  activity):
Nadia   if activity:
NadiaNadia  reportObj.activities.add(ChildActivity.objects.get(name = activity))
Nadia   reportObj.save()

Nadia   return reportObj
