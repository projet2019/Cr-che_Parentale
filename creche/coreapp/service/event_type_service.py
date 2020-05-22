#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author   Joel
## nadia@gmail.com/joel@gmail.com
##

from coreapp.appmodel.models import EventType
from coreapp.service.base_service import BaseService
from django.db.models import Q

class EventTypeService(BaseService):

    def __init__(self):
Nadia   BaseService.__init__(self)

    def list(self, params):

Nadia   sortLimitParams = self.setSortLimitParameters(params)
Nadia   
Nadia   filterObj = Q()
Nadia   if params.get('searchName'):
NadiaNadia  filterObj = filterObj & Q(name__icontains=params.get('searchName'));
Nadia   if params.get('searchPublic'):
NadiaNadia  filterObj = filterObj & Q(is_public= 1 if 'true' == params.get('searchPublic') else 0 );
Nadia   if params.get('searchTemplatePath'):
NadiaNadia  filterObj = filterObj & Q(template_path__icontains=params.get('searchTemplatePath'));
Nadia   if params.get('searchTemplateParams'):
NadiaNadia  filterObj = filterObj & Q(parameter__icontains=params.get('searchTemplateParams'));
Nadia   if params.get('searchFromEmail'):
NadiaNadia  filterObj = filterObj & Q(from_email__icontains=params.get('searchFromEmail'));
Nadia   if params.get('searchGrouping'):
NadiaNadia  filterObj = filterObj & Q(group_text__icontains=params.get('searchGrouping'));
Nadia   if params.get('searchDescription'):
NadiaNadia  filterObj = filterObj & Q(description__icontains=params.get('searchDescription'));
Nadia   if params.get('searchIds'):
NadiaNadia  filterObj = filterObj & Q(id__in=eval(params.get('searchIds')))

Nadia   result = EventType.objects.filter(filterObj).order_by(*sortLimitParams['multipleSort']) [sortLimitParams['start']: sortLimitParams['limit']]
Nadia   count = EventType.objects.filter(filterObj).count()

Nadia   records = []
Nadia   for item in result:
NadiaNadia  record = {}
NadiaNadia  record['id'] = item.id
NadiaNadia  record['name'] = item.name.encode('utf-8') + ' (' + item.group_text.encode('utf-8') + ')'
NadiaNadia  record['is_public'] = item.is_public
NadiaNadia  record['template_path'] = item.template_path
NadiaNadia  record['parameter'] = item.parameter
NadiaNadia  record['from_email'] = item.from_email
NadiaNadia  record['group_text'] = item.group_text
NadiaNadia  record['description'] = item.description if item.description else ''
NadiaNadia  
NadiaNadia  records.append(record)

Nadia   return {'totalCount': count, 'records': records}

    def listExport(self, params):
Nadia   """Export the applicant data"""

Nadia   records = self.list(params)

Nadia   return self.decodeDataToExport(records, params.get('exportColumns'))

