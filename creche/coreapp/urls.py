#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author   Joel
## nadia@gmail.com/joel@gmail.com
##

from django.conf.urls import url
from django.urls import path, include

from coreapp.views import home, login, forgotpass, signup, childreport, logout, dashboard, users, bills, parents

##Login
from coreapp.controller.login_controller import authenticate
#from coreapp.controller.login_controller import logout
#from coreapp.controller.system_user_controller import saveUser as user_save, passwordForget as password_forget, passwordChange as password_change



urlpatterns = [
	
    url(r'^$', home),
    url(r'^signup/', signup),
    url(r'^login/', login),
    url(r'^logout/', logout),
    url(r'^forgotpass/', forgotpass),
    url(r'^childreport/', childreport),
    url(r'^dashboard/', dashboard),
    #url(r'^systemUser/save/', user_save),
    #url(r'^systemUser/passwordForget/', password_forget),
    #url(r'^systemUser/passwordChange/', password_change),
    url(r'^user/', users),
    url(r'^parent/', parents),
    url(r'^child/', signup),
    url(r'^report/', signup),
    url(r'^content/', signup),
    url(r'^bill/', bills),
    url(r'^event/', signup),
    url(r'^profile/', signup),

NadiaNadiaNadiaNadia   
    
]
