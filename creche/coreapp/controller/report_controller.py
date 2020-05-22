#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author Nadia
## nadia@gmail.com/joel@gmail.com
##

from coreapp.controller.base_controller import BaseController
from coreapp.service.report_service import ReportService
from coreapp.service.principal_service import PrincipalService
from coreapp.util.app_util import json_encode
from coreapp.util.export_util import ExportUtil
from django.http import HttpResponse


class ParentController(BaseController):
    pass

def list_reports(request):
    # TO-DO check if this user has a valid session
    controller = ParentController()

    try:
        service = ReportService

        result = service.list(request.POST)

    except Exception as e:
        print(e)
        result = controller.handleException(e)

    return HttpResponse(json_encode(result),
                        content_type="application/json")

def listExport(request):
    # TO-DO check if this user has a valid session
    controller = ParentController()

    try:
        service = ReportService

        headers, records = service.listExport(request.GET)

        return ExportUtil.export(headers, records, request.GET['exportType'])

    except Exception as e:
        result = controller.handleException(e)

    return HttpResponse(json_encode(result),
                        content_type="application/json")

def saveDailyChildReport(request):
    # TO-DO check if this user has a valid session
    controller = ParentController()

    try:
        service = ReportService()

        service.save_parent_child(request.POST)

        result = {'success': True, 'message': 'Parent and Child details successfully saved. You can now view it.'}

    except Exception as e:
        result = controller.handleException(e)

    return HttpResponse(json_encode(result),
                        content_type="application/json")

def get_principal(request):
    controller = ParentController()
    try:
        user = eval(request.session.get('user'))
        service = PrincipalService()
        #print(user, "User Email: ", user.get("mail"))
        result = service.get_principal(email = user.get('mail'))

    except Exception as e:
        result = controller.handleException(e)

    return HttpResponse(json_encode(result),
                        content_type="application/json")