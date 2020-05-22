#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author   Joel
## nadia@gmail.com/joel@gmail.com
##

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import hashlib
import os
import random
import smtplib
from smtplib import SMTPException

import MySQLdb
from coreapp.exception.critical_error import CriticalError
from coreapp.service.base_service import BaseService
from coreapp.util.app_util import AppUtil
from django.utils.datetime_safe import datetime
from creche import settings

class EmailService(BaseService):

    def __init__(self):
Nadia   BaseService.__init__(self)
Nadia   self.connection = MySQLdb.connect (host=settings.DATABASES['default']['HOST'],
NadiaNadiaNadiaNadiaNadiaNadia    user=settings.DATABASES['default']['USER'],
NadiaNadiaNadiaNadiaNadiaNadia    passwd=settings.DATABASES['default']['PASSWORD'],
NadiaNadiaNadiaNadiaNadiaNadia    db=settings.DATABASES['default']['NAME'])

Nadia   self.smtpObj = smtplib.SMTP(settings.APPLICATION_SETTINGS['common']['smtp_host'])
Nadia   # TODO
Nadia   # Remember to comment the debug line in production
Nadia   self.smtpObj.set_debuglevel(1)
Nadia   
    def processEmailQueue(self, eventId=None, eventTypeId=None, language = 'English'):
Nadia   """Process all the queued email in the database"""

Nadia   recipients = None
Nadia   #before running, ensure that there is no other COREAPP email process running
Nadia   #check if the pid file is present
Nadia   pidFile = settings.APPLICATION_SETTINGS['COREAPP_HOME'] + '/pidfile/message_' + language + '.pid'
Nadia   if AppUtil.checkFileExistence(pidFile):
NadiaNadia  raise CriticalError({"message": "Email relay process halted.<br/>There is another process that has a lock on the email relay pid file (" + language + ")."})
Nadia   else:
NadiaNadia  #create the file, to indicate that the message relay process is active
NadiaNadia  f = open(pidFile, 'w')
NadiaNadia  f.write(str(datetime.now()))
NadiaNadia  f.close()

NadiaNadia  #proceed with the email relaying process
NadiaNadia  queuedEmails = self.__retrieveQueue(eventId, eventTypeId)

NadiaNadia  recipients = self.__relayEmails(queuedEmails, eventId, eventTypeId, language)
NadiaNadia  
NadiaNadia  #clean up
NadiaNadia  self.connection.commit()
NadiaNadia  self.connection.close()
NadiaNadia  self.smtpObj.quit();

NadiaNadia  os.unlink(pidFile)

Nadia   return recipients

    def __relayEmails(self, queuedEmails, eventId, eventTypeId, language):
Nadia   """Send emails"""

Nadia   emailBody = None

Nadia   if self.__isEmailRelay(eventTypeId):
NadiaNadia  #for special cases like facturation, the email body is gotten from a text file, as opposed to the db
NadiaNadia  sql = 'SELECT entity_reference_id FROM event WHERE id = %d'
NadiaNadia  cursor = self.connection.cursor()

NadiaNadia  cursor.execute(sql % (eventId))
NadiaNadia  event = cursor.fetchone()
NadiaNadia  issue_number = event[0]


NadiaNadia  file_name = 'Document' + "-" + str(issue_number) + ".htm"
NadiaNadia  if 'French' == language:
NadiaNadiaNadia file_name = 'Document-FR' + "-" + str(issue_number) + ".htm"

NadiaNadia  dest_path = str(issue_number) + "/" + language
NadiaNadia  path = settings.APPLICATION_SETTINGS['EMAIL_HOME'] + '/' + dest_path + '/' + file_name
NadiaNadia  #check if the file exists
NadiaNadia  if not os.path.exists(path):
NadiaNadiaNadia raise CriticalError({"message": "The path " + path + " is invalid. Cannot send email."})
NadiaNadia  f = open(path, 'r', encoding='utf-8')
NadiaNadia  emailBody = f.read()
NadiaNadia  f.close()

Nadia   cursor = self.connection.cursor()
Nadia   result = {}

Nadia   for record in queuedEmails:
NadiaNadia  #for emails relay, lets check to see if it has been aborted
NadiaNadia  if emailBody:
NadiaNadiaNadia sql = 'SELECT is_abort FROM web_email_audit WHERE issue_number = %d'

NadiaNadiaNadia cursor.execute(sql % (issue_number))
NadiaNadiaNadia audits = cursor.fetchone()
NadiaNadiaNadia 
NadiaNadiaNadia if audits and True == audits[0]:
NadiaNadiaNadiaNadia#abort command must have been issued, lets break from the for loop
NadiaNadiaNadiaNadiabreak
NadiaNadiaNadia 
NadiaNadia  recipient = record[0]
NadiaNadia  sender = record[1]

NadiaNadia  # Create message container - the correct MIME type is multipart/alternative.
NadiaNadia  msg = MIMEMultipart('alternative')
NadiaNadia  msg['From'] = sender
NadiaNadia  msg['To'] = recipient
NadiaNadia  msg['Subject'] = record[2]

NadiaNadia  # Create the body of the message. Record the MIME types  - text/html.
NadiaNadia  if emailBody:
NadiaNadiaNadia finalContent = emailBody
NadiaNadiaNadia #go ahead to substitute the dynamic stuff
NadiaNadiaNadia finalContent = finalContent.replace('{subscriber_email_address}', recipient)

NadiaNadiaNadia hash = hashlib.md5()
NadiaNadiaNadia hash.update(str(random.random()).encode("utf-8"))
NadiaNadiaNadia finalContent = finalContent.replace('{throwoff1}', hash.hexdigest())

NadiaNadiaNadia hash1 = hashlib.md5()
NadiaNadiaNadia hash1.update(recipient.encode("utf-8"))
NadiaNadiaNadia finalContent = finalContent.replace('{user_hash}', hash1.hexdigest())

NadiaNadiaNadia hash2 = hashlib.md5()
NadiaNadiaNadia hash2.update(str(random.random()).encode("utf-8"))
NadiaNadiaNadia finalContent = finalContent.replace('{throwoff2}', hash2.hexdigest())
NadiaNadiaNadia 
NadiaNadiaNadia part = MIMEText(finalContent, 'html', 'utf-8')
NadiaNadia  else:
NadiaNadiaNadia part = MIMEText(record[3], 'html', 'utf-8')
NadiaNadiaNadia 
NadiaNadia  msg.attach(part)

NadiaNadia  #if not abortSending:
NadiaNadiaNadia #mark that we have invoked the SMTP Relay agent to send the email
NadiaNadia  params = {}
NadiaNadia  params['sent_at'] = datetime.now()

NadiaNadia  values = ', '.join(['%s = %%(%s)s' % (x, x) for x in params])

NadiaNadia  query = 'UPDATE email_schedule SET %s WHERE id = %d' % (values, record[4])
NadiaNadia  cursor.execute(query, params)
NadiaNadia  #send the email
NadiaNadia  status = self.sendEmail(sender, recipient, msg.as_string())
NadiaNadia  
NadiaNadia  if status:#means that everything went OK, so lets mark the email as sent
NadiaNadiaNadia params = {}
NadiaNadiaNadia params['delivery_date'] = datetime.now()

NadiaNadiaNadia values = ', '.join(['%s = %%(%s)s' % (x, x) for x in params])

NadiaNadiaNadia query = 'UPDATE email_schedule SET %s WHERE id = %d' % (values, record[4])
NadiaNadiaNadia cursor.execute(query, params)
NadiaNadiaNadia self.connection.commit()

NadiaNadiaNadia result[recipient + ' at id : ' + str(record[4])] = status#;audit this, because we want to know the number of recipients of the email

Nadia   cursor.close ()

Nadia   return result

    def __retrieveQueue(self, eventId, eventTypeId):
Nadia   """Retrieves all the queued emails"""

Nadia   isQueued = 'true'
Nadia   extraCriteria = ''
Nadia   eventJoin = ''
Nadia   eventTypeJoin = ''
Nadia   #check for cases (event types where the above is an exception
Nadia   if self.__isEmailRelay(eventTypeId):
NadiaNadia  isQueued = 'false'

Nadia   if eventId:
NadiaNadia  extraCriteria = ' AND e.id = ' + str(eventId)
NadiaNadia  eventJoin = ' INNER JOIN event e ON eq.event_id = e.id '

Nadia   if eventTypeId:
NadiaNadia  extraCriteria = ' AND et.id = ' + str(eventTypeId)
NadiaNadia  eventTypeJoin = ' INNER JOIN event_type et ON e.event_type_id = et.id '

Nadia   sql = """SELECT eq.to_email, eq.from_email, eq.subject, eq.message_body, eq.id
NadiaNadiaNadiaNadia    FROM email_schedule eq
NadiaNadiaNadiaNadia    %s
NadiaNadiaNadiaNadia    %s
NadiaNadiaNadiaNadia    WHERE
NadiaNadiaNadiaNadia    eq.scheduled_for_relay = %s
NadiaNadiaNadiaNadia    AND eq.delivery_date is null
NadiaNadiaNadiaNadia    %s"""

Nadia   cursor = self.connection.cursor()
Nadia   
Nadia   cursor.execute(sql % (eventJoin, eventTypeJoin, isQueued, extraCriteria))
Nadia   result = cursor.fetchall()

Nadia   cursor.close()
Nadia   
Nadia   return result

    def sendEmail(self, sender, recipient, message):
Nadia   """This function will be delegated with sending emails."""
Nadia   
Nadia   try:
NadiaNadia  self.smtpObj.sendmail(sender, recipient, message)

NadiaNadia  return True
Nadia   except SMTPException as se:
NadiaNadia  self.logger.exception('\nError while sending email to %s' % recipient, se)

NadiaNadia  return False

    def __isEmailRelay(self, eventTypeId):

Nadia   return settings.APPLICATION_SETTINGS['TEST_EMAIL'] == eventTypeId or settings.APPLICATION_SETTINGS['ENGLISH_EMAIL'] == eventTypeId or settings.APPLICATION_SETTINGS['FRENCH_EMAIL'] == eventTypeId
