#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author Nadia
## nadia@gmail.com/joel@gmail.com
##

from coreapp.controller.base_controller import BaseController
from coreapp.service.bill_service import BillService, ACTIVITY_CATEGORY
from coreapp.service.composant_service import  ComposantService
from coreapp.service.activity_service import ActivityService
from coreapp.service.repas_service import RepasService
from coreapp.util.app_util import json_encode
from coreapp.util.export_util import ExportUtil
from django.http import HttpResponse


class BillController(BaseController):
    pass

def list(request):
    # TO-DO check if this user has a valid session
    controller = BillController()

    try:
        service = BillService()

        result = service.list(request.POST)

    except Exception as e:
        result = controller.handleException(e)

    return HttpResponse(json_encode(result),
                        content_type="application/json")

def list_activities(request):
    # TO-DO check if this user has a valid session
    controller = BillController()

    try:
        service = ActivityService()

        result = service.list(request.POST)

    except Exception as e:
        result = controller.handleException(e)

    return HttpResponse(json_encode(result),
                        content_type="application/json")

def list_components(request):
    # TO-DO check if this user has a valid session
    controller = BillController()

    try:
        service = ComposantService()

        result = service.list(request.POST)

    except Exception as e:
        result = controller.handleException(e)

    return HttpResponse(json_encode(result),
                        content_type="application/json")


def listExport(request):
    # TO-DO check if this user has a valid session
    controller = BillController()

    try:
        service = BillService()

        headers, records = service.listExport(request.GET)

        return ExportUtil.export(headers, records, request.GET['exportType'])

    except Exception as e:
        result = controller.handleException(e)

    return HttpResponse(json_encode(result),
                        content_type="application/json")


def saveBill(request):
    # TO-DO check if this user has a valid session
    controller = BillController()

    try:
        service = BillService()

        service.save(request.POST)

        result = {'success': True, 'message': 'Bill details successfully saved. You can now view it.'}

    except Exception as e:
        result = controller.handleException(e)

    return HttpResponse(json_encode(result),
                        content_type="application/json")

def saveComponent(request):
    # TO-DO check if this user has a valid session
    controller = BillController()

    try:
        service = ComposantService()
        service.save_component(request.POST)
        result = {'success': True, 'message': 'Component details successfully saved. You can now view it.'}

    except Exception as e:
        result = controller.handleException(e)

    return HttpResponse(json_encode(result),
                        content_type="application/json")

def saveActivity(request):
    # TO-DO check if this user has a valid session
    controller = BillController()

    try:
        service = ActivityService()
        service.save_activity(request.POST)
        result = {'success': True, 'message': 'Activity details successfully saved. You can now view it.'}

    except Exception as e:
        result = controller.handleException(e)

    return HttpResponse(json_encode(result),
                        content_type="application/json")

def saveRepas(request):
    # TO-DO check if this user has a valid session
    controller = BillController()

    try:
        service = RepasService()
        service.register_repas(request.POST)
        result = {'success': True, 'message': 'Repas details successfully saved. You can now view it.'}

    except Exception as e:
        result = controller.handleException(e)

    return HttpResponse(json_encode(result),
                        content_type="application/json")



