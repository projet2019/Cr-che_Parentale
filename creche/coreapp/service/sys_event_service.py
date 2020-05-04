#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##


import MySQLdb
from datetime import datetime
from mako.template import Template
from creche import settings

class SysEventService:
    """Class that will be delegated with creating events in the database, after these events have been detected in other places in the system"""

    def __init__(self):

        self.connection = MySQLdb.connect (host=settings.DATABASES['default']['HOST'],
                                           user=settings.DATABASES['default']['USER'],
                                           passwd=settings.DATABASES['default']['PASSWORD'],
                                           db=settings.DATABASES['default']['NAME'])

        self.connection.set_character_set('utf8')#important because the data we are dealing with is unicode

    def createSysEvent(self, params, expressions=None):
        """Utility method that will be utilized for making an entry about an event"""

        cursor = self.connection.cursor()

        params['date_generated'] = datetime.now()
        params['last_updated'] = datetime.now()
        params['date_created'] = datetime.now()
        params['processed'] = False
        #in the params dict we expect the name to have been specified

        fields = ', '.join(params.keys())
        values = ', '.join(['%%(%s)s' % x for x in params])
        
        query = 'INSERT INTO event (%s) VALUES (%s)' % (fields, values)
        
        cursor.execute(query, params)

        eventId = cursor.lastrowid

        result = {}
        result['eventId'] = eventId

        cursor.close()

        if expressions:
            expressions['event_type_id'] = params['event_type_id']
            result = self.__scheduleGenericNotification(eventId, expressions)
            
        self.connection.commit()

        return result

    def scheduleEmailRecipient(self, params, language):
        """Utility method that schedules email recipients"""

        cursor = self.connection.cursor()
        event = None
        subject_suffix = ''

        #for i in range(1, 10000):
        
        #we must get the from email and the proposed subject
        cursor.execute("""SELECT et.from_email, et.email_subject
                FROM event_type et
                WHERE et.id = %d""" % (params['event_type_id']))
        event_type = cursor.fetchone()
        
        from_email = event_type[0]
        subject = event_type[1]

        if params['event_type_id'] != settings.APPLICATION_SETTINGS['TEST_EMAIL']:
            cursor.execute("""SELECT e.id
                FROM event e
                WHERE e.entity_reference_id = %d AND e.event_type_id = %d""" % (params['entity_reference_id'], params['event_type_id']))
            event = cursor.fetchone()

        if event:
            eventId = event[0]
        else:
            params['date_generated'] = datetime.now()
            params['last_updated'] = datetime.now()
            params['date_created'] = datetime.now()
            params['processed'] = True#it ensure that we know that this is an email not an event
            #in the params dict we expect the name to have been specified

            fields = ', '.join(params.keys())
            values = ', '.join(['%%(%s)s' % x for x in params])

            query = 'INSERT INTO event (%s) VALUES (%s)' % (fields, values)
            cursor.execute(query, params)

            cursor.execute("""SELECT from_email
            FROM event_type
            WHERE id = %d""" % (params['event_type_id']))
            event_type = cursor.fetchone()

            eventId = cursor.lastrowid
            from_email = event_type[0]

            self.connection.commit()#lets commit this asap so that any other preparation request doesn't start queueing guys again.

        if params['event_type_id'] == settings.APPLICATION_SETTINGS['TEST_EMAIL']:
            #lets add the No. of tests to the subject of the test email
            cursor.execute("""SELECT COUNT(e.id)
                FROM event_type et INNER JOIN event e ON e.event_type_id = et.id
                WHERE e.event_type_id = %d AND e.entity_reference_id = %d""" % (params['event_type_id'], params['entity_reference_id']))
            test_event = cursor.fetchone()

            subject_suffix = ' [Test No. ' + str(test_event[0]) + ']'

        #schedule the emails
        expressions = {}
        expressions['from_email'] = from_email
        expressions['message_body'] = ' '
        expressions['subject'] = subject + ' ' + str(params['entity_reference_id']) + subject_suffix
        expressions['scheduled_for_relay'] = False
        expressions['event_id'] = eventId
        expressions['last_updated'] = datetime.now()
        expressions['date_created'] = datetime.now()

        cursor.execute("""
            SELECT wu.mail
                FROM web_users wu
                INNER JOIN system_user_has_event_type suhet ON suhet.system_user_id = wu.uid
                INNER JOIN event_type et ON suhet.event_type_id = et.id
            WHERE et.id = %d""" % params['event_type_id'])

        subscribers = cursor.fetchall()

        for user in subscribers:
            #check to see if we already have queued this recipient/subscriber
            em = user[0].replace("'", "\\'")
            cursor.execute("SELECT id FROM email_schedule WHERE event_id = %d AND to_email = '%s'" % (eventId, em))
            recipient = cursor.fetchone()

            if not recipient:

                expressions['to_email'] = user[0]

                fields = ', '.join(expressions.keys())
                values = ', '.join(['%%(%s)s' % x for x in expressions])

                query = 'INSERT INTO email_schedule (%s) VALUES (%s)' % (fields, values)
                cursor.execute(query, expressions)

                self.connection.commit()#lets commit this asap so that any other preparation request doesn't start queueing guys again.

        #get the total number of subscribers
        cursor.execute("SELECT count(*) FROM email_schedule WHERE event_id = %d " % (eventId))
        subscriber_count = cursor.fetchone()

        #get the total number of queued subscribers
        cursor.execute("SELECT count(*) FROM email_schedule WHERE event_id = %d AND delivery_date IS NULL" % (eventId))
        queued_subscribers = cursor.fetchone()

        cursor.close()
        self.connection.commit()
        self.connection.close()

        return [str(subscriber_count[0]), str(queued_subscribers[0]), eventId]

    def __scheduleGenericNotification(self, eventId, expressions):
        """Schedule email for any user who would wish to be notified of a notification."""
        #first pick the template path that we are to use for building the email body
        cursor = self.connection.cursor()

        cursor.execute("SELECT template_path, from_email FROM event_type et INNER JOIN event e ON e.event_type_id = et.id WHERE e.id = %d" % eventId)
        record = cursor.fetchone()

        template = Template(filename=settings.APPLICATION_SETTINGS['COREAPP_HOME'] + record[0], input_encoding='utf-8')
        template.output_encoding = 'utf-8'

        params = {}
        params['from_email'] = record[1]
        params['subject'] = 'Creche Parentale Notification'
        params['scheduled_for_relay'] = True
        params['event_id'] = eventId
        params['last_updated'] = datetime.now()
        params['date_created'] = datetime.now()

        cursor.execute("""
            SELECT wu.mail, wud.full_name
                FROM web_users wu
                INNER JOIN system_user_has_event_type suhet ON suhet.system_user_id = wu.uid
                INNER JOIN web_user_detail wud ON wud.user_id = wu.uid
                INNER JOIN event_type et ON suhet.event_type_id = et.id
            WHERE et.id = %d""" % expressions['event_type_id'])

        subscribers = cursor.fetchall()

        for user in subscribers:
            recipient = 'User'
            if user[1]:
                recipient = user[1]

            expressions['recipient'] = recipient

            params['message_body'] = template.render(params=expressions)#message to be relayed to the subscribers
            params['to_email'] = user[0]

            fields = ', '.join(params.keys())
            values = ', '.join(['%%(%s)s' % x for x in params])

            query = 'INSERT INTO email_schedule (%s) VALUES (%s)' % (fields, values)
            cursor.execute(query, params)

        cursor.close()

        return params
