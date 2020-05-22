#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author   Joel
## nadia@gmail.com/joel@gmail.com
##


import ast
from pytz import unicode
from coreapp.exception.critical_error import CriticalError
from datetime import datetime
from decimal import Decimal
import logging
from creche import settings
import ordereddict
import simplejson as json


class BaseService:

    def __init__(self):
Nadia   logging.config.fileConfig(settings.APPLICATION_SETTINGS['COREAPP_HOME'] + '/log.conf')
Nadia   self.logger = logging.getLogger("coreapp")

    def setSortLimitParameters(self, params):

Nadia   sortLimitParameters = {}

Nadia   sortLimitParameters['multipleSort'] = ['-id']
Nadia   if(params.get('defaultIdSort')):
NadiaNadia  sortLimitParameters['multipleSort'] = [params.get('defaultIdSort')]
NadiaNadia  
Nadia   if params.get('multipleSortInfo') and '[]' != params.get('multipleSortInfo'):
NadiaNadia  sortLimitParameters['multipleSort'] = ast.literal_eval(params.get('multipleSortInfo'))
Nadia   elif params.get('sort'):
NadiaNadia  sortLimitParameters['multipleSort'] = [params.get('sort')]

Nadia   sortLimitParameters['sort'] = 'id'
Nadia   if params.get('sort'):
NadiaNadia  sortLimitParameters['sort'] = params.get('sort')
Nadia   
Nadia   sortLimitParameters['dir'] = '-'
Nadia   if params.get('dir'):
NadiaNadia  if 'asc' == params.get('dir').lower():
NadiaNadiaNadia sortLimitParameters['dir'] = ''

Nadia   sortLimitParameters['start'] = 0
Nadia   if params.get('start'):
NadiaNadia  sortLimitParameters['start'] = int(params.get('start'))

Nadia   sortLimitParameters['limit'] = 10000000000
Nadia   if params.get('limit'):
NadiaNadia  limit = params.get('limit')
NadiaNadia  sortLimitParameters['limit'] = sortLimitParameters['start'] + int(limit)

Nadia   return sortLimitParameters

    def updateRecord(self, record):
Nadia   
Nadia   if not record.id:
NadiaNadia  record.date_created = datetime.now()
Nadia   record.last_updated = datetime.now()
Nadia   
Nadia   record.full_clean(exclude=['id'])

Nadia   record.save()

Nadia   return record

    def decodeDataToExport(self, data, exportProperties):
Nadia   #This is my star code, enyewe I had done some nice stuff during my time. Five stars for this, hata mimi am impressed by myself
Nadia   #quickly get the available columns from this resultset data structure
Nadia   records = data['records']
Nadia   if not records:
NadiaNadia  raise CriticalError({'message' : "Sorry, no data to export."})

Nadia   if not exportProperties:
NadiaNadia  raise CriticalError({'message' : "Sorry, no export properties specified for export."})

Nadia   result = []
Nadia   
Nadia   exportProperties = json.loads(exportProperties, object_pairs_hook=ordereddict.OrderedDict)#ast.literal_eval(exportProperties)
Nadia   exportColumns = exportProperties.keys()#this will hold the export columns as per the data names e.g gf_grant__grant_number
Nadia   
Nadia   for record in records:NadiaNadia  
NadiaNadia  
NadiaNadia  d = ordereddict.OrderedDict()
NadiaNadia  
NadiaNadia  for entityProperty in exportColumns:
NadiaNadiaNadia 
NadiaNadiaNadiaNadiaif entityProperty in record:
NadiaNadiaNadiaNadia
NadiaNadiaNadiaNadia    if isinstance(record[entityProperty], Decimal):
NadiaNadiaNadiaNadiaNadia   d[exportProperties[entityProperty]] = round(record[entityProperty], 4)
NadiaNadiaNadiaNadia    elif isinstance(record[entityProperty], unicode):
NadiaNadiaNadiaNadiaNadia   d[exportProperties[entityProperty]] = record[entityProperty].encode('utf-8')
NadiaNadiaNadiaNadia    else:
NadiaNadiaNadiaNadiaNadia   d[exportProperties[entityProperty]] = record[entityProperty]

NadiaNadia  result.append(d)
Nadia   #now decode the field names aka headers
Nadia   headers = exportProperties.values()
Nadia   formatted_headers = []
Nadia   
Nadia   for header in headers:
NadiaNadia  h = header.replace("<br/>", " ")
NadiaNadia  formatted_headers.append(h)
Nadia   
Nadia   return formatted_headers, result
