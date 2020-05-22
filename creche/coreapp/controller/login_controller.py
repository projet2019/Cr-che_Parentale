#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author   Joel
## nadia@gmail.com/joel@gmail.com
##

from coreapp.controller.base_controller import BaseController
from coreapp.util.app_util import json_encode
from coreapp.appmodel.models import LoginAudit, WebUserDetail, WebUsers, Module, UserModule
from datetime import datetime
from django.db import connection
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template.context import RequestContext
from coreapp.util.password_hasher import PasswordHasher
from django.db.models.signals import pre_delete
from django.contrib.sessions.models import Session

class LoginController(BaseController):
    pass

def sessionend_handler(sender, **kwargs):
    # cleanup session (temp) data
    print ("session %s ended" % kwargs.get('instance').session_key)

pre_delete.connect(sessionend_handler, sender=Session)

def authenticate(request):
    controller = LoginController()

    auth = False
    resultmessage = ''
    data = {}
    print("REQUEST DATA : \n", request, "\n")
    if request.POST:
Nadia   # get the user name and the pwd for the authentication operation
Nadia   email = request.POST.get('user', '')
Nadia   password = request.POST.get('pass', '')

Nadia   if (email and password):
NadiaNadia  #get model and check for this user
NadiaNadia  try:
NadiaNadiaNadia 
NadiaNadiaNadia user = None
NadiaNadiaNadia 
NadiaNadiaNadia try :
NadiaNadiaNadiaNadiauser = WebUsers.objects.get(name=email)#get the account using the username
NadiaNadiaNadia except WebUsers.DoesNotExist:
NadiaNadiaNadiaNadia#no user with such username, now lets try the email  
NadiaNadiaNadiaNadiausers = WebUsers.objects.filter(mail=email)#get the account using the email
NadiaNadiaNadiaNadiaif users:
NadiaNadiaNadiaNadia    user = users[0]
NadiaNadiaNadiaNadiaelse:
NadiaNadiaNadiaNadia    raise WebUsers.DoesNotExist
NadiaNadiaNadiaNadia
NadiaNadiaNadia d = PasswordHasher()NadiaNadia    
NadiaNadiaNadia 
NadiaNadiaNadia if not d.user_check_password(password, user):
NadiaNadiaNadiaNadiaraise WebUsers.DoesNotExist
NadiaNadiaNadia 
NadiaNadiaNadia #now check if they are allowed to use admin
NadiaNadiaNadia user_detail = WebUserDetail.objects.get(user_id=user.uid)
NadiaNadiaNadia if 0 == user_detail.can_use_admin and UserModule.objects.filter(system_user = user).count() <= 0:
NadiaNadiaNadiaNadiaresultmessage = 'Sorry, your profile does not have the appropriate privileges to use admin.'
NadiaNadiaNadia #check the status of the user
NadiaNadiaNadia else:
NadiaNadiaNadiaNadiaif not user.status:
NadiaNadiaNadiaNadia    resultmessage = 'Your account has been deactivated. Please contact the adminstrator to get your account reactivated.'
NadiaNadiaNadiaNadiaelse:
NadiaNadiaNadiaNadia    #after successfully loggin in, go ahead to audit this
NadiaNadiaNadiaNadia    client_ip = request.META.get('HTTP_X_FORWARDED_FOR', '') or request.META.get('REMOTE_ADDR')
NadiaNadiaNadiaNadia    audit = LoginAudit(created_by_id=user.uid, 
NadiaNadiaNadiaNadiaNadia   date_created=datetime.now(), 
NadiaNadiaNadiaNadiaNadia   ip_address = client_ip)
NadiaNadiaNadiaNadia    audit.save()
NadiaNadiaNadiaNadia    
NadiaNadiaNadiaNadia    request.session['login_audit_id'] = audit.id
NadiaNadiaNadiaNadia    request.session['user'] = json_encode(user)
NadiaNadiaNadiaNadia    request.session['user_detail'] = json_encode(user_detail.user_id)
NadiaNadiaNadiaNadia    request.session['full_name'] = user_detail.full_name
NadiaNadiaNadiaNadia    #data.update({'user': request.session['user']})
NadiaNadiaNadiaNadia    data.update({'user_detail': request.session['user_detail']})

NadiaNadiaNadiaNadia    #parameters for json response
NadiaNadiaNadiaNadia    resultmessage = 'Login successfull.'
NadiaNadiaNadiaNadia    auth = True
NadiaNadiaNadiaNadia    #decode which modules this user is allowed to view
NadiaNadiaNadiaNadia    cursor = connection.cursor()

NadiaNadiaNadiaNadia    cursor.execute("SELECT module_id FROM user_module_perm WHERE system_user_id = " + str(user.uid))
NadiaNadiaNadiaNadia    modules = cursor.fetchall()

NadiaNadiaNadiaNadia    allowed_modules = []
NadiaNadiaNadiaNadia    for module_id in modules:
NadiaNadiaNadiaNadiaNadia   module = Module.objects.get(id=module_id[0])

NadiaNadiaNadiaNadiaNadia   allowed_modules.append(json_encode({
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia "text": module.display_name,
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia "handler": module.handler,
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia "icon": module.icon_file,
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia "desc": module.description,
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia }))
NadiaNadiaNadiaNadiaNadia   
NadiaNadiaNadiaNadia    request.session['allowed_modules'] = allowed_modules
NadiaNadiaNadiaNadia    
NadiaNadia  except WebUsers.DoesNotExist:
NadiaNadiaNadia #print connection.queries
NadiaNadiaNadia #no user with such credentials
NadiaNadiaNadia resultmessage = 'The username and password combination you entered is invalid.'
NadiaNadia  except Exception as e:
NadiaNadiaNadia jsonObj = controller.handleException(e)
NadiaNadiaNadia resultmessage = jsonObj['message']
Nadia   else:
NadiaNadia  resultmessage = 'Username and password are required.'
    print ("Data: ", data, "\nSuccess: ", auth, "\nMessage: ", resultmessage)
    return HttpResponse(json_encode({'success': auth, 'message': resultmessage, 'data': data}),
NadiaNadiaNadiaNadia    content_type="application/json")

def user_logout(request):
    
    if request.session.get('user', 0):
Nadia   del request.session['user']
Nadia   
Nadia   audit = LoginAudit.objects.get(pk=request.session.get('login_audit_id'))
Nadia   audit.logout_date = datetime.now()
Nadia   audit.save()
Nadia   resultmessage = 'You have successfully logged out.'
Nadia   return HttpResponse(json_encode({'success': True, 'message': resultmessage, 'data': {} }),
NadiaNadiaNadiaNadiaNadia   content_type="application/json")

    return HttpResponse(json_encode({'success': False, 'message': "Logout failed, try again.", 'data': {}}),
NadiaNadiaNadiaNadia    content_type="application/json")

def get_module(handler):
    return Module.objects.get(handler  = handler)

