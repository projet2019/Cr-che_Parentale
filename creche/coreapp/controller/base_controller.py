#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##

from coreapp.util.export_util import ExportUtil
from coreapp.exception.critical_error import CriticalError
from coreapp.exception.unknown_record_error import UnknownRecordError
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
import logging
import logging.config

class BaseController:
    """Base Controller class that will be delegated to handle some of the generic requirements of the application controllers"""

    #def beforeInterceptor = [action:this.&auth, except:['index', 'authenticate', 'logout']]
    appValidationErrorMessage = ' A validation error has been detected for field <b>"%s"</b>.  <br/> The details of the error is : <b>"%s"</b><br/><br/>Please fix the error before you continue.'
    appUnauthorisedAccessErrorMessage = "You have attempted to execute an operation that your profile is not allowed to access. The unauthorised access has been logged and the appropriate administrator will be alerted."
    appUnknownException = "Ooops snap, something went wrong while executing the request.<br/>Please report this to the system administrator at the earliest time possible, to get the problem fixed."
    appUnknownObject = 'No %s with the supplied id, exists in the system.'
    appDuplicateEntryMessage = 'You have attempted to enter a duplicate value in a field that does not allow duplicates.<br/>The exact error message is "%s"'
    appJsonObject = {'success': False}

    def __init__(self):
        logging.config.fileConfig(settings.APPLICATION_SETTINGS['COREAPP_HOME'] + '/log.conf')
        self.logger = logging.getLogger("coreapp")

    def handleException(self, e):
        if type(e) is ValidationError:
            for k, v in e.message_dict.items():
                self.appJsonObject['message'] = self.appValidationErrorMessage % (k, v[0])
        elif type(e) is UnknownRecordError:
            self.appJsonObject['message'] = self.appUnknownObject % e.params['entity']
        elif type(e) is CriticalError:
            self.appJsonObject['message'] = e.params['message']
        elif type(e) is IntegrityError:
            self.appJsonObject['message'] = self.appDuplicateEntryMessage % e[1]
        else:
            self.logger.exception(e)
            self.appJsonObject['message'] = self.appUnknownException
       
        return self.appJsonObject
    
