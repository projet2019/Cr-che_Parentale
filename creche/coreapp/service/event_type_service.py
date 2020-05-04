
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
##

from coreapp.appmodel.models import EventType
from coreapp.service.base_service import BaseService
from django.db.models import Q

class EventTypeService(BaseService):

    def __init__(self):
        BaseService.__init__(self)

    def list(self, params):

        sortLimitParams = self.setSortLimitParameters(params)
        
        filterObj = Q()
        if params.get('searchName'):
            filterObj = filterObj & Q(name__icontains=params.get('searchName'));
        if params.get('searchPublic'):
            filterObj = filterObj & Q(is_public= 1 if 'true' == params.get('searchPublic') else 0 );
        if params.get('searchTemplatePath'):
            filterObj = filterObj & Q(template_path__icontains=params.get('searchTemplatePath'));
        if params.get('searchTemplateParams'):
            filterObj = filterObj & Q(parameter__icontains=params.get('searchTemplateParams'));
        if params.get('searchFromEmail'):
            filterObj = filterObj & Q(from_email__icontains=params.get('searchFromEmail'));
        if params.get('searchGrouping'):
            filterObj = filterObj & Q(group_text__icontains=params.get('searchGrouping'));
        if params.get('searchDescription'):
            filterObj = filterObj & Q(description__icontains=params.get('searchDescription'));
        if params.get('searchIds'):
            filterObj = filterObj & Q(id__in=eval(params.get('searchIds')))

        result = EventType.objects.filter(filterObj).order_by(*sortLimitParams['multipleSort']) [sortLimitParams['start']: sortLimitParams['limit']]
        count = EventType.objects.filter(filterObj).count()

        records = []
        for item in result:
            record = {}
            record['id'] = item.id
            record['name'] = item.name.encode('utf-8') + ' (' + item.group_text.encode('utf-8') + ')'
            record['is_public'] = item.is_public
            record['template_path'] = item.template_path
            record['parameter'] = item.parameter
            record['from_email'] = item.from_email
            record['group_text'] = item.group_text
            record['description'] = item.description if item.description else ''
            
            records.append(record)

        return {'totalCount': count, 'records': records}

    def listExport(self, params):
        """Export the applicant data"""

        records = self.list(params)

        return self.decodeDataToExport(records, params.get('exportColumns'))

