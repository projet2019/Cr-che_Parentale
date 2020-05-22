#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author Nadia
## nadia@gmail.com/joel@gmail.com
##

from coreapp.appmodel.models import Module, LoginAudit, WebUserDetail, WebUsers
from coreapp.exception.critical_error import CriticalError
from coreapp.util.password_hasher import PasswordHasher
from coreapp.service.base_service import BaseService
from creche import settings
from mako.template import Template
from django.db import connection
from django.db.models import Q
import time
import random
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

class SystemUserService(BaseService):

    def __init__(self):
        BaseService.__init__(self)

    def loginAudit(self, params):
        """List system users login audit"""

        sortLimitParams = self.setSortLimitParameters(params)
        
        filterObj = Q()

        if params.get('searchEmail'):
            user_ids = []
            users = WebUsers.objects.filter(mail__icontains=params.get('searchEmail'))
            for user in users:
                user_ids.append(user.uid)
                
            filterObj = filterObj & Q(created_by_id__in=user_ids)
        if params.get('searchIpAddress'):
            filterObj = filterObj & Q(ip_address__icontains=params.get('searchIpAddress'))
        if params.get('searchStartLoginDate'):
            filterObj = filterObj & Q(date_created__gte=params.get('searchStartLoginDate'))
        if params.get('searchEndLoginDate'):
            filterObj = filterObj & Q(date_created__lte=params.get('searchEndLoginDate'))
        if params.get('searchIds'):
            filterObj = filterObj & Q(id__in=params.get('searchIds').split(","))

        result = LoginAudit.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort']) [sortLimitParams['start']: sortLimitParams['limit']]
        count = LoginAudit.objects.filter(filterObj).count()

        cursor = connection.cursor()
        records = []
        for item in result:
            record = {}
            
            record['id'] = item.id
            record['ip_address'] = item.ip_address
            record['login_date'] = item.date_created
            record['logout_date'] = item.logout_date
            #get the details of this user
            user = WebUsers.objects.get(uid=item.created_by_id)
            record['email'] = user.mail
            
            records.append(record)

        cursor.close()
        
        return {'totalCount': count, 'records': records}

    def list(self, params):
        """List system users"""

        sortLimitParams = self.setSortLimitParameters(params)
        
        filterObj = Q()

        if params.get('searchEmail'):
            filterObj = filterObj & Q(mail__icontains=params.get('searchEmail'));
        if params.get('searchIds'):
            filterObj = filterObj & Q(id__in=eval(params.get('searchIds')))

        filterObj = filterObj & Q(uid__gt = 0);

        #unfortunately, drupal refers to it's identifying property as uid as opposed to id, just my luck
        sortLimitParams['alteredMultipleSort'] = []
        for sortParam in sortLimitParams['multipleSort']:
            
            if 'id' == sortParam:
                sortLimitParams['alteredMultipleSort'].append('uid')
            elif '-id' == sortParam:
                sortLimitParams['alteredMultipleSort'].append('-uid')
            else:
                sortLimitParams['alteredMultipleSort'].append(sortParam)

        result = WebUsers.objects.filter(filterObj).order_by(*sortLimitParams['alteredMultipleSort']) [sortLimitParams['start']: sortLimitParams['limit']]
        count = WebUsers.objects.filter(filterObj).count()

        cursor = connection.cursor()
        records = []
        for item in result:
            record = {}
            
            record['id'] = item.uid
            record['mail'] = item.mail
            record['status'] = item.status
            record['password'] = 'XXXXXXXXXXXXXXXXXX'
            #get the details of this user
            
            try:
                user_detail = WebUserDetail.objects.get(user_id=item.uid)
                record['full_name'] = user_detail.full_name
                record['description'] = user_detail.description
                record['can_use_admin'] = user_detail.can_use_admin
                #now set the relevant perms for the modules for this user
                cursor.execute("SELECT module_id FROM user_module_perm WHERE system_user_id = " + str(item.uid))
                modules = cursor.fetchall()

                for module_id in modules:
                    module = Module.objects.get(id=module_id[0])
                    record[module.name] = True

                records.append(record)
            except Exception as e:
                continue

        cursor.close()
        
        return {'totalCount': count, 'records': records}

    def listExport(self, params):
        """Export the applicant data"""

        records = self.list(params)

        return self.decodeDataToExport(records, params.get('exportColumns'))

    def save(self, postValues):
        """Method that will create or update a system user record after checking that all the properties are present"""

        params = postValues.copy()
        cursor = connection.cursor()
        record = None

        if(params.get('id')):
            record = WebUsers.objects.get(pk=params.get('id'))

            record.status = True
            if 'false' == params.get('status'):
                record.status = False
        else:
            email = params.get('user', '')
            password = params.get('pass', '')

            #first thing to check is if the email already exists
            hasher = PasswordHasher()
            pwd = hasher.user_hash_password(password, 15)

            try :
                WebUsers.objects.get(mail=email)#get the account using the email
                #if this email already exists, inform the user of that and advice them accordingly
                raise CriticalError({'message' : "The email '" + email + "' already exists in the system. Please use the email to login into the platform or request for a new password if you have forgotten it."})
            except WebUsers.DoesNotExist:
               record = WebUsers( name=email,
                                  pass_field=pwd,
                                  mail=email,
                                  access=0,
                                  login=0,
                                  status=1,
                                  picture=0,
                                  uuid='',
                                  created=time.time())
                                                 
               # TODO
               # You can initialize common modules here
               # params['can_use_admin'] = 'false' 
               params['can_use_admin'] = 'true'
        
        record.save()

        try:
            #print(record.__dict__)
            user_detail = WebUserDetail.objects.get(user_id=record.uid)
            
            user_detail.can_use_admin = False
            if 'true' == params.get('can_use_admin'):
                user_detail.can_use_admin = True
        except WebUserDetail.DoesNotExist:
            #create the user detail information
            #print("NO Detail")
            user_detail = WebUserDetail(user_id=record.uid, can_use_admin=True, description = '',
                                        alert_frequency='never', full_name=email)
            #user_detail = WebUserDetail(user_id=record.uid, can_use_admin=False, description = '',
                                        alert_frequency='never', full_name=email)
            #print(user_detail.__dict__)
            
        user_detail.save()

        cursor.execute("DELETE FROM user_module_perm WHERE system_user_id = " + str(record.uid))
        
        if 'true' == params.get('can_use_admin'):
            cursor.execute('INSERT INTO user_module_perm (module_id, system_user_id) VALUES (%d, %d)' % (1, record.uid))
            cursor.execute('INSERT INTO user_module_perm (module_id, system_user_id) VALUES (%d, %d)' % (2, record.uid))
            cursor.execute('INSERT INTO user_module_perm (module_id, system_user_id) VALUES (%d, %d)' % (3, record.uid))
            cursor.execute('INSERT INTO user_module_perm (module_id, system_user_id) VALUES (%d, %d)' % (4, record.uid))
            cursor.execute('INSERT INTO user_module_perm (module_id, system_user_id) VALUES (%d, %d)' % (5, record.uid))
            cursor.execute('INSERT INTO user_module_perm (module_id, system_user_id) VALUES (%d, %d)' % (6, record.uid))
            cursor.execute('INSERT INTO user_module_perm (module_id, system_user_id) VALUES (%d, %d)' % (7, record.uid))
            cursor.execute('INSERT INTO user_module_perm (module_id, system_user_id) VALUES (%d, %d)' % (8, record.uid))
        else:
            cursor.execute('INSERT INTO user_module_perm (module_id, system_user_id) VALUES (%d, %d)' % (8, record.uid))

        cursor.close()
        
        connection.connection.commit()
        
        return record

    def userLoggedOn(self, session, params):
        """Get information about the logged on user"""

        user = session.get('user')

        #get the details of this user
        user_detail = WebUserDetail.objects.get(user_id=user.uid)

        data = {}
        data['full_name'] = user_detail.full_name

        return {'user': data}

    def passwordChange(self, params):
        #get the user 
        user = WebUsers.objects.get(uid=params.get('userId'))
        
        #//check to see if the current password matches with what is in the DB
        hasher = PasswordHasher()
        
        if not hasher.user_check_password(params.get('current'), user):
            raise CriticalError({'message': "The current password that you provided does not match your password in the system."})

        #if upto to here, go ahead and change the password for this user
        user.pass_field = hasher.user_hash_password(params.get('password'), 15)
        user.save()
        
    def passwordForget(self, params):
        email = params.get('user', '')
        
        #first check to see if the email is in the database
        try:
            user = WebUsers.objects.get(mail=email)#get the account using the email
            #send an email with the reset password
            reset_password = self.anonymize()
            
            hasher = PasswordHasher()
            hashed_pwd = hasher.user_hash_password(reset_password, 15)
            
            template = Template(filename=settings.APPLICATION_SETTINGS['COREAPP_HOME'] + "/public/templates/email/password_forget.html", input_encoding='utf-8')
            template.output_encoding = 'utf-8'
            
            details = {}
            details['reset_password'] = reset_password
        
            smtpObj = smtplib.SMTP(settings.APPLICATION_SETTINGS['common']['smtp_host'])
            
            msg = MIMEMultipart('alternative')
            msg['From'] = settings.APPLICATION_SETTINGS['common']['admin_from_email']
            msg['To'] = email
            msg['Subject'] = 'Creche Parentale reset confirmation'
            
            email_body = template.render(params=details)
            
            part = MIMEText(email_body, 'html', 'utf-8')
            msg.attach(part)
            
            smtpObj.sendmail('Creche Parentale <%s>' % settings.APPLICATION_SETTINGS['common']['admin_from_email'],
                             email, msg.as_string())
            
            #go ahead to update the database with the new password
            user.pass_field = hashed_pwd
            user.save()
        except WebUsers.DoesNotExist:
            raise CriticalError({'message' : "The email '" + email + "' does not exist in the system."})

    def anonymize(self):
        available_letters = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        anonymized = ''
        
        for idx in range(8):
            letter_position = random.randint(0, (len(available_letters) - 1))

            randomized_letter = available_letters[letter_position]

            anonymized += randomized_letter

        return anonymized
