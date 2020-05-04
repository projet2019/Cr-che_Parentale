#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##

from django.conf.urls import url
from django.urls import path, include

from coreapp import views

##Login
from coreapp.controller.login_controller import authenticate
from coreapp.controller.login_controller import index, signup
from coreapp.controller.login_controller import logout
from coreapp.controller.system_user_controller import saveUser as user_save, passwordForget as password_forget, passwordChange as password_change



urlpatterns = [
	
    url(r'^$', index),
    url(r'^signup/$', signup),
    url(r'^login/authenticate/', authenticate),
    url(r'^logout/', logout),
    url(r'^systemUser/save/', user_save),
    url(r'^systemUser/passwordForget/', password_forget),
    url(r'^systemUser/passwordChange/', password_change),
                       
    
]
