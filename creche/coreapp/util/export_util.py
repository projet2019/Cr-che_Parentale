#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author   Joel
## nadia@gmail.com/joel@gmail.com
##

import csv
from decimal import *
from django.http import HttpResponse
from mako.template import Template
import xhtml2pdf
import creche.settings
from xml.dom.minidom import Document
import xlwt

class ExportUtil:

    @staticmethod
    def export(fieldnames, records, exportType):

Nadia   ext = 'csv'
Nadia   mime = 'text/csv'

Nadia   if '200' == exportType:
NadiaNadia  mime = 'text/xml'
NadiaNadia  ext = 'xml'
Nadia   if '300' == exportType:
NadiaNadia  mime = 'text/html'
Nadia   if '400' == exportType:
NadiaNadia  mime = 'application/pdf'
NadiaNadia  ext = 'pdf'
Nadia   if '500' == exportType:
NadiaNadia  mime = 'application/vnd.ms-excel'
NadiaNadia  ext = 'xls'

    # Create the HttpResponse object with the appropriate header.
Nadia   response = HttpResponse(mimetype=mime)
Nadia   if not '300' == exportType:
NadiaNadia  response['Content-Disposition'] = 'attachment; filename=export.' + ext

Nadia   if '200' == exportType:
NadiaNadia  response = ExportUtil.exportToXML(response, records)
Nadia   elif '300' == exportType:
NadiaNadia  response = ExportUtil.exportToHtml(response, records)
Nadia   elif '400' == exportType:
NadiaNadia  response = ExportUtil.exportToPdf(response, records)
Nadia   elif '500' == exportType:
NadiaNadia  response = ExportUtil.exportToXls(response, records , fieldnames)
Nadia   else:
NadiaNadia  response = ExportUtil.exportToCSV(response, records, fieldnames)

Nadia   return response

    @staticmethod
    def exportToCSV(response, records, fieldnames):
Nadia   csv.register_dialect('apwstringsquoted', quoting=csv.QUOTE_ALL)

Nadia   writer = csv.DictWriter(response, fieldnames, dialect='apwstringsquoted')
Nadia   # headers
Nadia   headers = {}
Nadia   for n in fieldnames:
NadiaNadia  headers[n] = n
Nadia   writer.writerow(headers)

Nadia   writer.writerows(row for row in records)

Nadia   return response
    
    @staticmethod
    def exportToPdf(response, records):
Nadia   template = Template(filename=settings.TEMPLATE_DIRS[0] + '/html_table_export.html')
Nadia   template.output_encoding = 'utf-8'

Nadia   html_text = template.render(params={'records': records})

Nadia   pdf = xhtml2pdf.CreatePDF(html_text, response)
Nadia   if not pdf.err:
NadiaNadia  xhtml2pdf.startViewer(response)

Nadia   return response

    @staticmethod
    def exportToHtml(response, records):
Nadia   template = Template(filename=settings.TEMPLATE_DIRS[0] + '/html_table_export.html')
Nadia   template.output_encoding = 'utf-8'
Nadia   
Nadia   html_text = template.render(params={'records': records})
Nadia   
Nadia   response.write(html_text)

Nadia   return response

    @staticmethod
    def exportToXML(response, records, name="records"):
Nadia   "The keys are element names and the values are text"
Nadia   xml = Document()

Nadia   items = xml.createElement(name)
Nadia   
Nadia   xml.appendChild(items)

Nadia   for record in records:
NadiaNadia  for key, val in record.items():
NadiaNadiaNadia node = xml.createElement(str(key))
NadiaNadiaNadia node.appendChild(xml.createTextNode(str(val)))
NadiaNadiaNadia items.appendChild(node)
NadiaNadiaNadia 
Nadia   response.write(xml.toprettyxml())
NadiaNadia  
Nadia   return response

    @staticmethod
    def exportToXls(response, data, headings):
Nadia   
Nadia   book = xlwt.Workbook(encoding='utf-8')
Nadia   sheet = book.add_sheet('export dd')

#Nadia   headings = []
#Nadia   for key, value in data[0].items():
#NadiaNadia  headings.append(key)
#Nadia   
Nadia   rowx = 0
Nadia   for colx, value in enumerate(headings):
NadiaNadia  sheet.write(rowx, colx, value)
Nadia   sheet.set_panes_frozen(True) # frozen headings instead of split panes
Nadia   sheet.set_horz_split_pos(rowx+1) # in general, freeze after last heading row
Nadia   sheet.set_remove_splits(True) # if user does unfreeze, don't leave a split there

Nadia   for row in data:
NadiaNadia  rowx += 1

NadiaNadia  for c, key in enumerate(row):
NadiaNadiaNadia sheet.write(rowx, c, row[key])

Nadia   book.save(response)

Nadia   return response
