#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author Nadia
## nadia@gmail.com/joel@gmail.com
##

from coreapp.controller.base_controller import BaseController
from coreapp.util.app_util import json_encode
from coreapp.appmodel.models import LoginAudit, WebUserDetail, WebUsers, Module, UserModule
from datetime import datetime
from django.db import connection
from django.http import HttpResponse
from django.http import HttpResponseRedirect
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
        # get the user name and the pwd for the authentication operation
        email = request.POST.get('user', '')
        password = request.POST.get('pass', '')

        if (email and password):
            #get model and check for this user
            try:
                
                user = None
                
                try :
                    user = WebUsers.objects.get(name=email)#get the account using the username
                except WebUsers.DoesNotExist:
                    #no user with such username, now lets try the email  
                    users = WebUsers.objects.filter(mail=email)#get the account using the email
                    if users:
                        user = users[0]
                    else:
                        raise WebUsers.DoesNotExist
                    
                d = PasswordHasher()              
                
                if not d.user_check_password(password, user):
                    raise WebUsers.DoesNotExist
                
                #now check if they are allowed to use admin
                user_detail = WebUserDetail.objects.get(user_id=user.uid)
                if 0 == user_detail.can_use_admin and UserModule.objects.filter(system_user = user).count() <= 0:
                    resultmessage = 'Sorry, your profile does not have the appropriate privileges to use admin.'
                #check the status of the user
                else:
                    if not user.status:
                        resultmessage = 'Your account has been deactivated. Please contact the adminstrator to get your account reactivated.'
                    else:
                        #after successfully loggin in, go ahead to audit this
                        client_ip = request.META.get('HTTP_X_FORWARDED_FOR', '') or request.META.get('REMOTE_ADDR')
                        audit = LoginAudit(created_by_id=user.uid, 
                            date_created=datetime.now(), 
                            ip_address = client_ip)
                        audit.save()
                        
                        request.session['login_audit_id'] = audit.id
                        request.session['user'] = json_encode(user)
                        request.session['user_detail'] = json_encode(user_detail.user_id)
                        request.session['full_name'] = user_detail.full_name
                        #data.update({'user': request.session['user']})
                        data.update({'user_detail': request.session['user_detail']})

                        #parameters for json response
                        resultmessage = 'Login successfull.'
                        auth = True
                        #decode which modules this user is allowed to view
                        cursor = connection.cursor()

                        cursor.execute("SELECT module_id FROM user_module_perm WHERE system_user_id = " + str(user.uid))
                        modules = cursor.fetchall()

                        allowed_modules = []
                        for module_id in modules:
                            module = Module.objects.get(id=module_id[0])

                            allowed_modules.append(json_encode({
                                                   "text": module.display_name,
                                                   "handler": module.handler,
                                                   "icon": module.icon_file,
                                                   "desc": module.description,
                                                   }))
                            
                        request.session['allowed_modules'] = allowed_modules
                        
            except WebUsers.DoesNotExist:
                #print connection.queries
                #no user with such credentials
                resultmessage = 'The username and password combination you entered is invalid.'
            except Exception as e:
                jsonObj = controller.handleException(e)
                resultmessage = jsonObj['message']
        else:
            resultmessage = 'Username and password are required.'
    print ("Data: ", data, "\nSuccess: ", auth, "\nMessage: ", resultmessage)
    return HttpResponse(json_encode({'success': auth, 'message': resultmessage, 'data': data}),
                        content_type="application/json")

def user_logout(request):
    
    if request.session.get('user', 0):
        del request.session['user']
        
        audit = LoginAudit.objects.get(pk=request.session.get('login_audit_id'))
        audit.logout_date = datetime.now()
        audit.save()
        resultmessage = 'You have successfully logged out.'
        return HttpResponse(json_encode({'success': True, 'message': resultmessage, 'data': {} }),
                            content_type="application/json")

    return HttpResponse(json_encode({'success': False, 'message': "Logout failed, try again.", 'data': {}}),
                        content_type="application/json")

def get_module(handler):
    return Module.objects.get(handler  = handler)

