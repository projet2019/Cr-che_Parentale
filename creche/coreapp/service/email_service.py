
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author UWANTWALI ZIGAMA Didier
## d.zigama@pivotaccess.com/zigdidier@gmail.com
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
        BaseService.__init__(self)
        self.connection = MySQLdb.connect (host=settings.DATABASES['default']['HOST'],
                                  user=settings.DATABASES['default']['USER'],
                                  passwd=settings.DATABASES['default']['PASSWORD'],
                                  db=settings.DATABASES['default']['NAME'])

        self.smtpObj = smtplib.SMTP(settings.APPLICATION_SETTINGS['common']['smtp_host'])
        # TODO
        # Remember to comment the debug line in production
        self.smtpObj.set_debuglevel(1)
        
    def processEmailQueue(self, eventId=None, eventTypeId=None, language = 'English'):
        """Process all the queued email in the database"""

        recipients = None
        #before running, ensure that there is no other COREAPP email process running
        #check if the pid file is present
        pidFile = settings.APPLICATION_SETTINGS['COREAPP_HOME'] + '/pidfile/message_' + language + '.pid'
        if AppUtil.checkFileExistence(pidFile):
            raise CriticalError({"message": "Email relay process halted.<br/>There is another process that has a lock on the email relay pid file (" + language + ")."})
        else:
            #create the file, to indicate that the message relay process is active
            f = open(pidFile, 'w')
            f.write(str(datetime.now()))
            f.close()

            #proceed with the email relaying process
            queuedEmails = self.__retrieveQueue(eventId, eventTypeId)

            recipients = self.__relayEmails(queuedEmails, eventId, eventTypeId, language)
            
            #clean up
            self.connection.commit()
            self.connection.close()
            self.smtpObj.quit();

            os.unlink(pidFile)

        return recipients

    def __relayEmails(self, queuedEmails, eventId, eventTypeId, language):
        """Send emails"""

        emailBody = None

        if self.__isEmailRelay(eventTypeId):
            #for special cases like facturation, the email body is gotten from a text file, as opposed to the db
            sql = 'SELECT entity_reference_id FROM event WHERE id = %d'
            cursor = self.connection.cursor()

            cursor.execute(sql % (eventId))
            event = cursor.fetchone()
            issue_number = event[0]


            file_name = 'Document' + "-" + str(issue_number) + ".htm"
            if 'French' == language:
                file_name = 'Document-FR' + "-" + str(issue_number) + ".htm"

            dest_path = str(issue_number) + "/" + language
            path = settings.APPLICATION_SETTINGS['EMAIL_HOME'] + '/' + dest_path + '/' + file_name
            #check if the file exists
            if not os.path.exists(path):
                raise CriticalError({"message": "The path " + path + " is invalid. Cannot send email."})
            f = open(path, 'r', encoding='utf-8')
            emailBody = f.read()
            f.close()

        cursor = self.connection.cursor()
        result = {}

        for record in queuedEmails:
            #for emails relay, lets check to see if it has been aborted
            if emailBody:
                sql = 'SELECT is_abort FROM web_email_audit WHERE issue_number = %d'

                cursor.execute(sql % (issue_number))
                audits = cursor.fetchone()
                
                if audits and True == audits[0]:
                    #abort command must have been issued, lets break from the for loop
                    break
                
            recipient = record[0]
            sender = record[1]

            # Create message container - the correct MIME type is multipart/alternative.
            msg = MIMEMultipart('alternative')
            msg['From'] = sender
            msg['To'] = recipient
            msg['Subject'] = record[2]

            # Create the body of the message. Record the MIME types  - text/html.
            if emailBody:
                finalContent = emailBody
                #go ahead to substitute the dynamic stuff
                finalContent = finalContent.replace('{subscriber_email_address}', recipient)

                hash = hashlib.md5()
                hash.update(str(random.random()).encode("utf-8"))
                finalContent = finalContent.replace('{throwoff1}', hash.hexdigest())

                hash1 = hashlib.md5()
                hash1.update(recipient.encode("utf-8"))
                finalContent = finalContent.replace('{user_hash}', hash1.hexdigest())

                hash2 = hashlib.md5()
                hash2.update(str(random.random()).encode("utf-8"))
                finalContent = finalContent.replace('{throwoff2}', hash2.hexdigest())
                
                part = MIMEText(finalContent, 'html', 'utf-8')
            else:
                part = MIMEText(record[3], 'html', 'utf-8')
                
            msg.attach(part)

            #if not abortSending:
                #mark that we have invoked the SMTP Relay agent to send the email
            params = {}
            params['sent_at'] = datetime.now()

            values = ', '.join(['%s = %%(%s)s' % (x, x) for x in params])

            query = 'UPDATE email_schedule SET %s WHERE id = %d' % (values, record[4])
            cursor.execute(query, params)
            #send the email
            status = self.sendEmail(sender, recipient, msg.as_string())
            
            if status:#means that everything went OK, so lets mark the email as sent
                params = {}
                params['delivery_date'] = datetime.now()

                values = ', '.join(['%s = %%(%s)s' % (x, x) for x in params])

                query = 'UPDATE email_schedule SET %s WHERE id = %d' % (values, record[4])
                cursor.execute(query, params)
                self.connection.commit()

                result[recipient + ' at id : ' + str(record[4])] = status#;audit this, because we want to know the number of recipients of the email

        cursor.close ()

        return result

    def __retrieveQueue(self, eventId, eventTypeId):
        """Retrieves all the queued emails"""

        isQueued = 'true'
        extraCriteria = ''
        eventJoin = ''
        eventTypeJoin = ''
        #check for cases (event types where the above is an exception
        if self.__isEmailRelay(eventTypeId):
            isQueued = 'false'

        if eventId:
            extraCriteria = ' AND e.id = ' + str(eventId)
            eventJoin = ' INNER JOIN event e ON eq.event_id = e.id '

        if eventTypeId:
            extraCriteria = ' AND et.id = ' + str(eventTypeId)
            eventTypeJoin = ' INNER JOIN event_type et ON e.event_type_id = et.id '

        sql = """SELECT eq.to_email, eq.from_email, eq.subject, eq.message_body, eq.id
                        FROM email_schedule eq
                        %s
                        %s
                        WHERE
                        eq.scheduled_for_relay = %s
                        AND eq.delivery_date is null
                        %s"""

        cursor = self.connection.cursor()
        
        cursor.execute(sql % (eventJoin, eventTypeJoin, isQueued, extraCriteria))
        result = cursor.fetchall()

        cursor.close()
        
        return result

    def sendEmail(self, sender, recipient, message):
        """This function will be delegated with sending emails."""
        
        try:
            self.smtpObj.sendmail(sender, recipient, message)

            return True
        except SMTPException as se:
            self.logger.exception('\nError while sending email to %s' % recipient, se)

            return False

    def __isEmailRelay(self, eventTypeId):

        return settings.APPLICATION_SETTINGS['TEST_EMAIL'] == eventTypeId or settings.APPLICATION_SETTINGS['ENGLISH_EMAIL'] == eventTypeId or settings.APPLICATION_SETTINGS['FRENCH_EMAIL'] == eventTypeId
