#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author Nadia
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
        BaseService.__init__(self)

    def list(self, params):

        sortLimitParams = self.setSortLimitParameters(params)

        filterObj = Q()
        if params.get('searchName'):
            filterObj = filterObj & Q(child__names__icontains=params.get('searchName'))
        if params.get('searchReportId'):
            filterObj = filterObj & Q(id=params.get('searchCReportId'))
        if params.get('searchDateCreated'):
            filterObj = filterObj & Q(
                date_created__gte=datetime.strptime(params.get('searchDateCreated') + ' 00:00:59',
                                                      '%Y-%m-%d %H:%M:%S'))
            filterObj = filterObj & Q(
                date_created__lte=datetime.strptime(params.get('searchDateCreated') + ' 23:59:59',
                                                      '%Y-%m-%d %H:%M:%S'))
        if params.get('searchTelephone'):
            filterObj = filterObj & Q(child__parent__telephone = params.get('searchTelephone'))
        if params.get('searchIDNO'):
            filterObj = filterObj & Q(child__parent__identity_number = params.get('searchIDNO'))
        if params.get('searchEmail'):
            filterObj = filterObj & Q(child__parent__email = params.get('searchEmail'))
        if params.get('searchRegno'):
            filterObj = filterObj & Q(child__regno = params.get('searchRegno'))

        result = DailyChildReport.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort'])[
                 sortLimitParams['start']: sortLimitParams['limit']]
        count = DailyChildReport.objects.filter(filterObj).count()

        records = []
        for item in result:

            record = {}
            record['id'] = item.id
            #record['telephone'] = item.child.parent.telephone.encode('utf-8')
            #record['id_number'] = item.identity_number.encode('utf-8')
            record['date_created'] = item.date_created.isoformat()
            record['day'] = item.day.isoformat()
            record['parents'] = [ {"names": pt.names, "telephone": pt.telephone, "relationship": pt.relationship,
                                      "id": pt.id, "email": pt.email} for pt in item.child.parents]
            record['activities'] = [{"name": act.name, "category": act.category, "price" : act.unit_price, "id": act.id} for act in item.activities]
            record['components'] = [{"name": rp.name, "id": rp.id} for rp in item.repas.components]
            record['repas'] = {"id": item.repas.id, "price": item.repas.unit_price}
            record['day_price'] = item.day_price
            record['accueillante'] = {"names": item.accueillante.names, "telephone": item.accueillante.telephone,
                                      "id": item.accueillante.id, "email": item.accueillante.email}
            record['gender'] = item.child.gender.encode('utf-8')
            record['names'] = item.child.names
            record['group'] = item.child.group
            records.append(record)

        return {'totalCount': count, 'records': records}

    def listExport(self, params):
        """Export the applicant data"""

        records = self.list(params)

        return self.decodeDataToExport(records, params.get('exportColumns'))

    def register_report(self, postValues):
        """
        we assume we will not register a child without a report, and a report without a child
        :param postValues:
        :return:
        """
        report = None
        params = postValues.copy()

        if params.get('child'):

            try:
                report = DailyChildReport.objects.get(id = params.get('report_id'))
                day_price = params.get('day_price')
            except DailyChildReport.DoesNotExist:
                report = DailyChildReport( day_price = params.get('day_price'),
                                            date_created=datetime.now(),
                                            day = datetime.today()
                                        )
            try:
                child = ChildService.get_child(child = params.get('child'))
                if not child:
                    raise CriticalError({'message': "Report was not saved, child not found. Try again."})
                repas = RepasService.register_repas(postValues)
                if not repas:
                    raise CriticalError({'message': "Report was not saved, repas was not saved. Try again."})
                principal = PrincipalService.get_principal(principal_id=params.get('principal'))
                if not principal:
                    raise CriticalError({'message': "Report was not saved, accueillante was not saved. Try again."})
                report.child = child
                report.accueillante = principal
                report.repas = repas
                report.save()
                activities = params.get('activities')
                for act in activities:
                    self.add_activity(report, act)
                if report.activities.count() == 0:
                    raise CriticalError({'message': "The activities were not saved. Try again."})
            except Exception:
                raise CriticalError({'message': "Unkwon Error while saving child daily report. Try again or contact system admin "})

        return report

    def add_activity(self, reportObj,  activity):
        if activity:
            reportObj.activities.add(ChildActivity.objects.get(name = activity))
        reportObj.save()

        return reportObj
