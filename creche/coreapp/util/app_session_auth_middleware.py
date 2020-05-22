#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author Nadia
## nadia@gmail.com/joel@gmail.com
##

from django.utils.deprecation import MiddlewareMixin
from django.http import HttpResponse
import re
from coreapp.views import  login
from coreapp.util.app_util import json_encode

class AppSessionAuthMiddleware(MiddlewareMixin):

    def process_view(self, request, view_func, view_args, view_kwargs):

        self.omitActions = ['home', 'logout', 'login', 'signup', 'forgotpass']

        if request.session.get('user', 0):
            # TODO
            #self.log_access(request.session['login_audit_id'], request.path)
            return None
        else:
            if view_func.__name__ in self.omitActions:
                return None
            user_agent = request.META['HTTP_USER_AGENT']
            BROWSER_AGENT_RE = re.compile(r".*(mozilla|safari|chrome|firexox|MSIE)", re.IGNORECASE)
            # print(user_agent)
            if BROWSER_AGENT_RE.match(user_agent):
                request.session['error'] = 'Please Login'
                return login(request)
            return HttpResponse('login_redirection')

        
    def log_access(self, login_audit_id, request_path):
        # TODO
        pass