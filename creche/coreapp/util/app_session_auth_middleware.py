#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author   Joel
## nadia@gmail.com/joel@gmail.com
##

from django.utils.deprecation import MiddlewareMixin
from django.http import HttpResponse
import re
from coreapp.views import  login
from coreapp.util.app_util import json_encode

class AppSessionAuthMiddleware(MiddlewareMixin):

    def process_view(self, request, view_func, view_args, view_kwargs):

Nadia   self.omitActions = ['home', 'logout', 'login', 'signup', 'forgotpass']

Nadia   if request.session.get('user', 0):
NadiaNadia  # TODO
NadiaNadia  #self.log_access(request.session['login_audit_id'], request.path)
NadiaNadia  return None
Nadia   else:
NadiaNadia  if view_func.__name__ in self.omitActions:
NadiaNadiaNadia return None
NadiaNadia  user_agent = request.META['HTTP_USER_AGENT']
NadiaNadia  BROWSER_AGENT_RE = re.compile(r".*(mozilla|safari|chrome|firexox|MSIE)", re.IGNORECASE)
NadiaNadia  # print(user_agent)
NadiaNadia  if BROWSER_AGENT_RE.match(user_agent):
NadiaNadiaNadia request.session['error'] = 'Please Login'
NadiaNadiaNadia return login(request)
NadiaNadia  return HttpResponse('login_redirection')

Nadia   
    def log_access(self, login_audit_id, request_path):
Nadia   # TODO
Nadia   pass