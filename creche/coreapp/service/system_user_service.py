#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author   Joel
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
Nadia   BaseService.__init__(self)

    def loginAudit(self, params):
Nadia   """List system users login audit"""

Nadia   sortLimitParams = self.setSortLimitParameters(params)
Nadia   
Nadia   filterObj = Q()

Nadia   if params.get('searchEmail'):
NadiaNadia  user_ids = []
NadiaNadia  users = WebUsers.objects.filter(mail__icontains=params.get('searchEmail'))
NadiaNadia  for user in users:
NadiaNadiaNadia user_ids.append(user.uid)
NadiaNadiaNadia 
NadiaNadia  filterObj = filterObj & Q(created_by_id__in=user_ids)
Nadia   if params.get('searchIpAddress'):
NadiaNadia  filterObj = filterObj & Q(ip_address__icontains=params.get('searchIpAddress'))
Nadia   if params.get('searchStartLoginDate'):
NadiaNadia  filterObj = filterObj & Q(date_created__gte=params.get('searchStartLoginDate'))
Nadia   if params.get('searchEndLoginDate'):
NadiaNadia  filterObj = filterObj & Q(date_created__lte=params.get('searchEndLoginDate'))
Nadia   if params.get('searchIds'):
NadiaNadia  filterObj = filterObj & Q(id__in=params.get('searchIds').split(","))

Nadia   result = LoginAudit.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort']) [sortLimitParams['start']: sortLimitParams['limit']]
Nadia   count = LoginAudit.objects.filter(filterObj).count()

Nadia   cursor = connection.cursor()
Nadia   records = []
Nadia   for item in result:
NadiaNadia  record = {}
NadiaNadia  
NadiaNadia  record['id'] = item.id
NadiaNadia  record['ip_address'] = item.ip_address
NadiaNadia  record['login_date'] = item.date_created
NadiaNadia  record['logout_date'] = item.logout_date
NadiaNadia  #get the details of this user
NadiaNadia  user = WebUsers.objects.get(uid=item.created_by_id)
NadiaNadia  record['email'] = user.mail
NadiaNadia  
NadiaNadia  records.append(record)

Nadia   cursor.close()
Nadia   
Nadia   return {'totalCount': count, 'records': records}

    def list(self, params):
Nadia   """List system users"""

Nadia   sortLimitParams = self.setSortLimitParameters(params)
Nadia   
Nadia   filterObj = Q()

Nadia   if params.get('searchEmail'):
NadiaNadia  filterObj = filterObj & Q(mail__icontains=params.get('searchEmail'));
Nadia   if params.get('searchIds'):
NadiaNadia  filterObj = filterObj & Q(id__in=eval(params.get('searchIds')))

Nadia   filterObj = filterObj & Q(uid__gt = 0);

Nadia   #unfortunately, drupal refers to it's identifying property as uid as opposed to id, just my luck
Nadia   sortLimitParams['alteredMultipleSort'] = []
Nadia   for sortParam in sortLimitParams['multipleSort']:
NadiaNadia  
NadiaNadia  if 'id' == sortParam:
NadiaNadiaNadia sortLimitParams['alteredMultipleSort'].append('uid')
NadiaNadia  elif '-id' == sortParam:
NadiaNadiaNadia sortLimitParams['alteredMultipleSort'].append('-uid')
NadiaNadia  else:
NadiaNadiaNadia sortLimitParams['alteredMultipleSort'].append(sortParam)

Nadia   result = WebUsers.objects.filter(filterObj).order_by(*sortLimitParams['alteredMultipleSort']) [sortLimitParams['start']: sortLimitParams['limit']]
Nadia   count = WebUsers.objects.filter(filterObj).count()

Nadia   cursor = connection.cursor()
Nadia   records = []
Nadia   for item in result:
NadiaNadia  record = {}
NadiaNadia  
NadiaNadia  record['id'] = item.uid
NadiaNadia  record['mail'] = item.mail
NadiaNadia  record['status'] = item.status
NadiaNadia  record['password'] = 'XXXXXXXXXXXXXXXXXX'
NadiaNadia  #get the details of this user
NadiaNadia  
NadiaNadia  try:
NadiaNadiaNadia user_detail = WebUserDetail.objects.get(user_id=item.uid)
NadiaNadiaNadia record['full_name'] = user_detail.full_name
NadiaNadiaNadia record['description'] = user_detail.description
NadiaNadiaNadia record['can_use_admin'] = user_detail.can_use_admin
NadiaNadiaNadia #now set the relevant perms for the modules for this user
NadiaNadiaNadia cursor.execute("SELECT module_id FROM user_module_perm WHERE system_user_id = " + str(item.uid))
NadiaNadiaNadia modules = cursor.fetchall()

NadiaNadiaNadia for module_id in modules:
NadiaNadiaNadiaNadiamodule = Module.objects.get(id=module_id[0])
NadiaNadiaNadiaNadiarecord[module.name] = True

NadiaNadiaNadia records.append(record)
NadiaNadia  except Exception as e:
NadiaNadiaNadia continue

Nadia   cursor.close()
Nadia   
Nadia   return {'totalCount': count, 'records': records}

    def listExport(self, params):
Nadia   """Export the applicant data"""

Nadia   records = self.list(params)

Nadia   return self.decodeDataToExport(records, params.get('exportColumns'))

    def save(self, postValues):
Nadia   """Method that will create or update a system user record after checking that all the properties are present"""

Nadia   params = postValues.copy()
Nadia   cursor = connection.cursor()
Nadia   record = None

Nadia   if(params.get('id')):
NadiaNadia  record = WebUsers.objects.get(pk=params.get('id'))

NadiaNadia  record.status = True
NadiaNadia  if 'false' == params.get('status'):
NadiaNadiaNadia record.status = False
Nadia   else:
NadiaNadia  email = params.get('user', '')
NadiaNadia  password = params.get('pass', '')

NadiaNadia  #first thing to check is if the email already exists
NadiaNadia  hasher = PasswordHasher()
NadiaNadia  pwd = hasher.user_hash_password(password, 15)

NadiaNadia  try :
NadiaNadiaNadia WebUsers.objects.get(mail=email)#get the account using the email
NadiaNadiaNadia #if this email already exists, inform the user of that and advice them accordingly
NadiaNadiaNadia raise CriticalError({'message' : "The email '" + email + "' already exists in the system. Please use the email to login into the platform or request for a new password if you have forgotten it."})
NadiaNadia  except WebUsers.DoesNotExist:
NadiaNadiaNadiarecord = WebUsers( name=email,
NadiaNadiaNadiaNadiaNadiaNadia    pass_field=pwd,
NadiaNadiaNadiaNadiaNadiaNadia    mail=email,
NadiaNadiaNadiaNadiaNadiaNadia    access=0,
NadiaNadiaNadiaNadiaNadiaNadia    login=0,
NadiaNadiaNadiaNadiaNadiaNadia    status=1,
NadiaNadiaNadiaNadiaNadiaNadia    picture=0,
NadiaNadiaNadiaNadiaNadiaNadia    uuid='',
NadiaNadiaNadiaNadiaNadiaNadia    created=time.time())
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia    
NadiaNadiaNadia# TODO
NadiaNadiaNadia# You can initialize common modules here
NadiaNadiaNadiaparams['can_use_admin'] = 'true'
NadiaNadiaNadia#params['can_use_admin'] = 'false'

Nadia   record.save()

Nadia   try:
NadiaNadia  #print(record.__dict__)
NadiaNadia  user_detail = WebUserDetail.objects.get(user_id=record.uid)
NadiaNadia  
NadiaNadia  user_detail.can_use_admin = False
NadiaNadia  if 'true' == params.get('can_use_admin'):
NadiaNadiaNadia user_detail.can_use_admin = True
Nadia   except WebUserDetail.DoesNotExist:
NadiaNadia  #create the user detail information
NadiaNadia  #print("NO Detail")
NadiaNadia  #user_detail = WebUserDetail(user_id=record.uid, can_use_admin=False, description = '',
NadiaNadia  #NadiaNadiaNadiaNadiaNadia   alert_frequency='never', full_name=email)
NadiaNadia  user_detail = WebUserDetail(user_id=record.uid, can_use_admin=True, description = '',
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadiaalert_frequency='never', full_name=email)
NadiaNadia  #print(user_detail.__dict__)
NadiaNadia  
Nadia   user_detail.save()

Nadia   cursor.execute("DELETE FROM user_module_perm WHERE system_user_id = " + str(record.uid))
Nadia   
Nadia   if 'true' == params.get('can_use_admin'):
NadiaNadia  cursor.execute('INSERT INTO user_module_perm (module_id, system_user_id) VALUES (%d, %d)' % (1, record.uid))
NadiaNadia  cursor.execute('INSERT INTO user_module_perm (module_id, system_user_id) VALUES (%d, %d)' % (2, record.uid))
NadiaNadia  cursor.execute('INSERT INTO user_module_perm (module_id, system_user_id) VALUES (%d, %d)' % (3, record.uid))
NadiaNadia  cursor.execute('INSERT INTO user_module_perm (module_id, system_user_id) VALUES (%d, %d)' % (4, record.uid))
NadiaNadia  cursor.execute('INSERT INTO user_module_perm (module_id, system_user_id) VALUES (%d, %d)' % (5, record.uid))
NadiaNadia  cursor.execute('INSERT INTO user_module_perm (module_id, system_user_id) VALUES (%d, %d)' % (6, record.uid))
NadiaNadia  cursor.execute('INSERT INTO user_module_perm (module_id, system_user_id) VALUES (%d, %d)' % (7, record.uid))
NadiaNadia  cursor.execute('INSERT INTO user_module_perm (module_id, system_user_id) VALUES (%d, %d)' % (8, record.uid))
Nadia   else:
NadiaNadia  cursor.execute('INSERT INTO user_module_perm (module_id, system_user_id) VALUES (%d, %d)' % (8, record.uid))

Nadia   cursor.close()
Nadia   
Nadia   connection.connection.commit()
Nadia   
Nadia   return record

    def userLoggedOn(self, session, params):
Nadia   """Get information about the logged on user"""

Nadia   user = session.get('user')

Nadia   #get the details of this user
Nadia   user_detail = WebUserDetail.objects.get(user_id=user.uid)

Nadia   data = {}
Nadia   data['full_name'] = user_detail.full_name

Nadia   return {'user': data}

    def passwordChange(self, params):
Nadia   #get the user 
Nadia   user = WebUsers.objects.get(uid=params.get('userId'))
Nadia   
Nadia   #//check to see if the current password matches with what is in the DB
Nadia   hasher = PasswordHasher()
Nadia   
Nadia   if not hasher.user_check_password(params.get('current'), user):
NadiaNadia  raise CriticalError({'message': "The current password that you provided does not match your password in the system."})

Nadia   #if upto to here, go ahead and change the password for this user
Nadia   user.pass_field = hasher.user_hash_password(params.get('password'), 15)
Nadia   user.save()
Nadia   
    def passwordForget(self, params):
Nadia   email = params.get('user', '')
Nadia   
Nadia   #first check to see if the email is in the database
Nadia   try:
NadiaNadia  user = WebUsers.objects.get(mail=email)#get the account using the email
NadiaNadia  #send an email with the reset password
NadiaNadia  reset_password = self.anonymize()
NadiaNadia  
NadiaNadia  hasher = PasswordHasher()
NadiaNadia  hashed_pwd = hasher.user_hash_password(reset_password, 15)
NadiaNadia  
NadiaNadia  template = Template(filename=settings.APPLICATION_SETTINGS['COREAPP_HOME'] + "/public/templates/email/password_forget.html", input_encoding='utf-8')
NadiaNadia  template.output_encoding = 'utf-8'
NadiaNadia  
NadiaNadia  details = {}
NadiaNadia  details['reset_password'] = reset_password
Nadia   
NadiaNadia  smtpObj = smtplib.SMTP(settings.APPLICATION_SETTINGS['common']['smtp_host'])
NadiaNadia  
NadiaNadia  msg = MIMEMultipart('alternative')
NadiaNadia  msg['From'] = settings.APPLICATION_SETTINGS['common']['admin_from_email']
NadiaNadia  msg['To'] = email
NadiaNadia  msg['Subject'] = 'Creche Parentale reset confirmation'
NadiaNadia  
NadiaNadia  email_body = template.render(params=details)
NadiaNadia  
NadiaNadia  part = MIMEText(email_body, 'html', 'utf-8')
NadiaNadia  msg.attach(part)
NadiaNadia  
NadiaNadia  smtpObj.sendmail('Creche Parentale <%s>' % settings.APPLICATION_SETTINGS['common']['admin_from_email'],
NadiaNadiaNadiaNadiaNadia    email, msg.as_string())
NadiaNadia  
NadiaNadia  #go ahead to update the database with the new password
NadiaNadia  user.pass_field = hashed_pwd
NadiaNadia  user.save()
Nadia   except WebUsers.DoesNotExist:
NadiaNadia  raise CriticalError({'message' : "The email '" + email + "' does not exist in the system."})

    def anonymize(self):
Nadia   available_letters = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
Nadia   anonymized = ''
Nadia   
Nadia   for idx in range(8):
NadiaNadia  letter_position = random.randint(0, (len(available_letters) - 1))

NadiaNadia  randomized_letter = available_letters[letter_position]

NadiaNadia  anonymized += randomized_letter

Nadia   return anonymized
