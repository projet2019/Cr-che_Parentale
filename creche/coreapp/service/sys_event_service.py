#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author   Joel
## nadia@gmail.com/joel@gmail.com
##

import MySQLdb
from datetime import datetime
from mako.template import Template
from creche import settings

class SysEventService:
    """Class that will be delegated with creating events in the database, after these events have been detected in other places in the system"""

    def __init__(self):

Nadia   self.connection = MySQLdb.connect (host=settings.DATABASES['default']['HOST'],
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia   user=settings.DATABASES['default']['USER'],
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia   passwd=settings.DATABASES['default']['PASSWORD'],
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia   db=settings.DATABASES['default']['NAME'])

Nadia   self.connection.set_character_set('utf8')#important because the data we are dealing with is unicode

    def createSysEvent(self, params, expressions=None):
Nadia   """Utility method that will be utilized for making an entry about an event"""

Nadia   cursor = self.connection.cursor()

Nadia   params['date_generated'] = datetime.now()
Nadia   params['last_updated'] = datetime.now()
Nadia   params['date_created'] = datetime.now()
Nadia   params['processed'] = False
Nadia   #in the params dict we expect the name to have been specified

Nadia   fields = ', '.join(params.keys())
Nadia   values = ', '.join(['%%(%s)s' % x for x in params])
Nadia   
Nadia   query = 'INSERT INTO event (%s) VALUES (%s)' % (fields, values)
Nadia   
Nadia   cursor.execute(query, params)

Nadia   eventId = cursor.lastrowid

Nadia   result = {}
Nadia   result['eventId'] = eventId

Nadia   cursor.close()

Nadia   if expressions:
NadiaNadia  expressions['event_type_id'] = params['event_type_id']
NadiaNadia  result = self.__scheduleGenericNotification(eventId, expressions)
NadiaNadia  
Nadia   self.connection.commit()

Nadia   return result

    def scheduleEmailRecipient(self, params, language):
Nadia   """Utility method that schedules email recipients"""

Nadia   cursor = self.connection.cursor()
Nadia   event = None
Nadia   subject_suffix = ''

Nadia   #for i in range(1, 10000):
Nadia   
Nadia   #we must get the from email and the proposed subject
Nadia   cursor.execute("""SELECT et.from_email, et.email_subject
NadiaNadiaNadia FROM event_type et
NadiaNadiaNadia WHERE et.id = %d""" % (params['event_type_id']))
Nadia   event_type = cursor.fetchone()
Nadia   
Nadia   from_email = event_type[0]
Nadia   subject = event_type[1]

Nadia   if params['event_type_id'] != settings.APPLICATION_SETTINGS['TEST_EMAIL']:
NadiaNadia  cursor.execute("""SELECT e.id
NadiaNadiaNadia FROM event e
NadiaNadiaNadia WHERE e.entity_reference_id = %d AND e.event_type_id = %d""" % (params['entity_reference_id'], params['event_type_id']))
NadiaNadia  event = cursor.fetchone()

Nadia   if event:
NadiaNadia  eventId = event[0]
Nadia   else:
NadiaNadia  params['date_generated'] = datetime.now()
NadiaNadia  params['last_updated'] = datetime.now()
NadiaNadia  params['date_created'] = datetime.now()
NadiaNadia  params['processed'] = True#it ensure that we know that this is an email not an event
NadiaNadia  #in the params dict we expect the name to have been specified

NadiaNadia  fields = ', '.join(params.keys())
NadiaNadia  values = ', '.join(['%%(%s)s' % x for x in params])

NadiaNadia  query = 'INSERT INTO event (%s) VALUES (%s)' % (fields, values)
NadiaNadia  cursor.execute(query, params)

NadiaNadia  cursor.execute("""SELECT from_email
NadiaNadia  FROM event_type
NadiaNadia  WHERE id = %d""" % (params['event_type_id']))
NadiaNadia  event_type = cursor.fetchone()

NadiaNadia  eventId = cursor.lastrowid
NadiaNadia  from_email = event_type[0]

NadiaNadia  self.connection.commit()#lets commit this asap so that any other preparation request doesn't start queueing guys again.

Nadia   if params['event_type_id'] == settings.APPLICATION_SETTINGS['TEST_EMAIL']:
NadiaNadia  #lets add the No. of tests to the subject of the test email
NadiaNadia  cursor.execute("""SELECT COUNT(e.id)
NadiaNadiaNadia FROM event_type et INNER JOIN event e ON e.event_type_id = et.id
NadiaNadiaNadia WHERE e.event_type_id = %d AND e.entity_reference_id = %d""" % (params['event_type_id'], params['entity_reference_id']))
NadiaNadia  test_event = cursor.fetchone()

NadiaNadia  subject_suffix = ' [Test No. ' + str(test_event[0]) + ']'

Nadia   #schedule the emails
Nadia   expressions = {}
Nadia   expressions['from_email'] = from_email
Nadia   expressions['message_body'] = ' '
Nadia   expressions['subject'] = subject + ' ' + str(params['entity_reference_id']) + subject_suffix
Nadia   expressions['scheduled_for_relay'] = False
Nadia   expressions['event_id'] = eventId
Nadia   expressions['last_updated'] = datetime.now()
Nadia   expressions['date_created'] = datetime.now()

Nadia   cursor.execute("""
NadiaNadia  SELECT wu.mail
NadiaNadiaNadia FROM web_users wu
NadiaNadiaNadia INNER JOIN system_user_has_event_type suhet ON suhet.system_user_id = wu.uid
NadiaNadiaNadia INNER JOIN event_type et ON suhet.event_type_id = et.id
NadiaNadia  WHERE et.id = %d""" % params['event_type_id'])

Nadia   subscribers = cursor.fetchall()

Nadia   for user in subscribers:
NadiaNadia  #check to see if we already have queued this recipient/subscriber
NadiaNadia  em = user[0].replace("'", "\\'")
NadiaNadia  cursor.execute("SELECT id FROM email_schedule WHERE event_id = %d AND to_email = '%s'" % (eventId, em))
NadiaNadia  recipient = cursor.fetchone()

NadiaNadia  if not recipient:

NadiaNadiaNadia expressions['to_email'] = user[0]

NadiaNadiaNadia fields = ', '.join(expressions.keys())
NadiaNadiaNadia values = ', '.join(['%%(%s)s' % x for x in expressions])

NadiaNadiaNadia query = 'INSERT INTO email_schedule (%s) VALUES (%s)' % (fields, values)
NadiaNadiaNadia cursor.execute(query, expressions)

NadiaNadiaNadia self.connection.commit()#lets commit this asap so that any other preparation request doesn't start queueing guys again.

Nadia   #get the total number of subscribers
Nadia   cursor.execute("SELECT count(*) FROM email_schedule WHERE event_id = %d " % (eventId))
Nadia   subscriber_count = cursor.fetchone()

Nadia   #get the total number of queued subscribers
Nadia   cursor.execute("SELECT count(*) FROM email_schedule WHERE event_id = %d AND delivery_date IS NULL" % (eventId))
Nadia   queued_subscribers = cursor.fetchone()

Nadia   cursor.close()
Nadia   self.connection.commit()
Nadia   self.connection.close()

Nadia   return [str(subscriber_count[0]), str(queued_subscribers[0]), eventId]

    def __scheduleGenericNotification(self, eventId, expressions):
Nadia   """Schedule email for any user who would wish to be notified of a notification."""
Nadia   #first pick the template path that we are to use for building the email body
Nadia   cursor = self.connection.cursor()

Nadia   cursor.execute("SELECT template_path, from_email FROM event_type et INNER JOIN event e ON e.event_type_id = et.id WHERE e.id = %d" % eventId)
Nadia   record = cursor.fetchone()

Nadia   template = Template(filename=settings.APPLICATION_SETTINGS['COREAPP_HOME'] + record[0], input_encoding='utf-8')
Nadia   template.output_encoding = 'utf-8'

Nadia   params = {}
Nadia   params['from_email'] = record[1]
Nadia   params['subject'] = 'Creche Parentale Notification'
Nadia   params['scheduled_for_relay'] = True
Nadia   params['event_id'] = eventId
Nadia   params['last_updated'] = datetime.now()
Nadia   params['date_created'] = datetime.now()

Nadia   cursor.execute("""
NadiaNadia  SELECT wu.mail, wud.full_name
NadiaNadiaNadia FROM web_users wu
NadiaNadiaNadia INNER JOIN system_user_has_event_type suhet ON suhet.system_user_id = wu.uid
NadiaNadiaNadia INNER JOIN web_user_detail wud ON wud.user_id = wu.uid
NadiaNadiaNadia INNER JOIN event_type et ON suhet.event_type_id = et.id
NadiaNadia  WHERE et.id = %d""" % expressions['event_type_id'])

Nadia   subscribers = cursor.fetchall()

Nadia   for user in subscribers:
NadiaNadia  recipient = 'User'
NadiaNadia  if user[1]:
NadiaNadiaNadia recipient = user[1]

NadiaNadia  expressions['recipient'] = recipient

NadiaNadia  params['message_body'] = template.render(params=expressions)#message to be relayed to the subscribers
NadiaNadia  params['to_email'] = user[0]

NadiaNadia  fields = ', '.join(params.keys())
NadiaNadia  values = ', '.join(['%%(%s)s' % x for x in params])

NadiaNadia  query = 'INSERT INTO email_schedule (%s) VALUES (%s)' % (fields, values)
NadiaNadia  cursor.execute(query, params)

Nadia   cursor.close()

Nadia   return params
