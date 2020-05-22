#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author   Joel
## nadia@gmail.com/joel@gmail.com
##

from coreapp.controller.base_controller import BaseController
from coreapp.service.parent_service import ParentService, PARENT_CHILD_RELATION
from coreapp.service.child_service import  ChildService, GENDER, CHILD_CLASSES
from coreapp.util.app_util import json_encode
from coreapp.util.export_util import ExportUtil
from django.http import HttpResponse


class ParentController(BaseController):
    pass

def list_parents(request):
    # TO-DO check if this user has a valid session
    controller = ParentController()

    try:
Nadia   service = ParentService()

Nadia   result = service.list(request.POST)

    except Exception as e:
Nadia   print(e)
Nadia   result = controller.handleException(e)

    return HttpResponse(json_encode(result),
NadiaNadiaNadiaNadia    content_type="application/json")

def list_children(request):
    # TO-DO check if this user has a valid session
    controller = ParentController()

    try:
Nadia   service = ChildService()

Nadia   result = service.list(request.POST)

    except Exception as e:
Nadia   result = controller.handleException(e)

    return HttpResponse(json_encode(result),
NadiaNadiaNadiaNadia    content_type="application/json")


def listExport(request):
    # TO-DO check if this user has a valid session
    controller = ParentController()

    try:
Nadia   service = ParentService()

Nadia   headers, records = service.listExport(request.GET)

Nadia   return ExportUtil.export(headers, records, request.GET['exportType'])

    except Exception as e:
Nadia   result = controller.handleException(e)

    return HttpResponse(json_encode(result),
NadiaNadiaNadiaNadia    content_type="application/json")


def saveParentChild(request):
    # TO-DO check if this user has a valid session
    controller = ParentController()

    try:
Nadia   service = ParentService()

Nadia   service.save_parent_child(request.POST)

Nadia   result = {'success': True, 'message': 'Parent and Child details successfully saved. You can now view it.'}

    except Exception as e:
Nadia   result = controller.handleException(e)

    return HttpResponse(json_encode(result),
NadiaNadiaNadiaNadia    content_type="application/json")

def saveChild(request):
    # TO-DO check if this user has a valid session
    controller = ParentController()

    try:
Nadia   service = ChildService()
Nadia   service.save_child(request.POST)
Nadia   result = {'success': True, 'message': 'Child details successfully saved. You can now view it.'}

    except Exception as e:
Nadia   result = controller.handleException(e)

    return HttpResponse(json_encode(result),
NadiaNadiaNadiaNadia    content_type="application/json")

def saveParent(request):
    # TO-DO check if this user has a valid session
    controller = ParentController()

    try:
Nadia   service = ParentService()
Nadia   service.save_parent(request.POST)
Nadia   result = {'success': True, 'message': 'Parent details successfully saved. You can now view it.'}

    except Exception as e:
Nadia   result = controller.handleException(e)

    return HttpResponse(json_encode(result),
NadiaNadiaNadiaNadia    content_type="application/json")



