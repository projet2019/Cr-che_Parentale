#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author UWANTWALI ZIGAMA Didier
## d.zigama@pivotaccess.com/zigdidier@gmail.com
##


from django.db import models
from django.db.models.signals import post_save

# Create your models here.

PARENT_CHILD_RELATION = (
    ("Father", "Father"),
    ("Mother", "Mother"),
    ("Guardian", "Guardian")
)

CHILD_CLASSES = (
    ("Grand", "Grand"),
    ("Petit", "Petit")
)

class CrecheChild(models.Model):
    id = models.AutoField(primary_key=True)
    # TODO
    #Any other relevant info should be here
    names = models.CharField(max_length=200)
    date_of_birth = models.DateField()
    current_affiliation = models.CharField(max_length = 20,
                                            choices = CHILD_CLASSES,
                                            default = 'Petit'
                                            )
    date_created = models.DateTimeField()
    last_updated = models.DateTimeField()
    class Meta:
        db_table = u'creche_child'

class CrecheParent(models.Model):
    id = models.AutoField(primary_key=True)
    # TODO
    # Any other relevant info should be here
    names = models.CharField(max_length=200)
    telephone = models.CharField(max_length=20)
    identity_document = models.CharField(max_length=50)
    full_addres = models.TextField()
    relationship = models.CharField(
                                    max_length = 20,
                                    choices = PARENT_CHILD_RELATION,
                                    default = 'Guardian'
                                    )
    children = models.ManyToManyField(CrecheChild)
    date_created = models.DateTimeField()
    last_updated = models.DateTimeField()
    class Meta:
        db_table = u'creche_parent'

class CrechePrincipal(models.Model):
    id = models.AutoField(primary_key=True)
    #TODO
    #Any other relevant info should be here
    date_created = models.DateTimeField()
    last_updated = models.DateTimeField()
    class Meta:
        db_table = u'creche_principal'

class ComposantRepas(models.Model):
    id = models.AutoField(primary_key=True)
    component_name = models.CharField(max_length=50)
    description = models.TextField()

class Repas(models.Model):
    id = models.AutoField(primary_key=True)
    date_time = models.DateTimeField()
    menu = models.ManyToManyField(ComposantRepas)

class  DailyChildReport(models.Model):
    id = models.AutoField(primary_key=True)
    child = models.ForeignKey(CrecheChild, on_delete=models.CASCADE)
    child_parent = models.ForeignKey(CrecheParent, on_delete=models.CASCADE)
    accueillante = models.ForeignKey(CrechePrincipal, on_delete=models.CASCADE)
    repas = models.ForeignKey(Repas, on_delete=models.CASCADE)

class Bill(models.Model):
    id = models.AutoField(primary_key=True)
    child = models.ForeignKey(CrecheChild, on_delete=models.CASCADE)
    # TODO
    # Modalities

class LoginAudit(models.Model):
    id = models.AutoField(primary_key=True)
    created_by_id = models.IntegerField()
    ip_address = models.CharField(max_length=765)
    logout_date = models.DateTimeField()
    date_created = models.DateTimeField()
    last_updated = models.DateTimeField()
    class Meta:
        db_table = u'login_audit'

class EventType(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(unique=True, max_length=192)
    is_public = models.IntegerField()
    template_path = models.CharField(max_length=765)
    parameter = models.CharField(max_length=765, blank=True)
    from_email = models.CharField(max_length=765)
    group_text = models.CharField(max_length=96, blank=True)
    description = models.TextField(blank=True)
    date_created = models.DateTimeField()
    last_updated = models.DateTimeField()
    class Meta:
        db_table = u'event_type'
        

class Event(models.Model):
    id = models.IntegerField(primary_key=True)
    event_type = models.ForeignKey(EventType, on_delete=models.CASCADE)
    entity_reference_id = models.IntegerField(null=True, blank=True)
    date_generated = models.DateTimeField()
    name = models.CharField(max_length=255)
    processed = models.IntegerField()
    date_created = models.DateTimeField()
    last_updated = models.DateTimeField()
    class Meta:
        db_table = u'event'

class SystemUserEventType(models.Model):
    id = models.IntegerField(primary_key=True)
    event_type_id = models.IntegerField(null=False)
    system_user_id = models.IntegerField(null=False)
    can_unsubscribe = models.IntegerField()
    date_created = models.DateTimeField()
    last_updated = models.DateTimeField()
    class Meta:
        db_table = u'system_user_has_event_type'
        unique_together = ['event_type_id', 'system_user_id']

class WebEmailAudit(models.Model):
    id = models.IntegerField(primary_key=True)
    latest_test = models.DateTimeField()
    issue_number = models.IntegerField()
    is_abort = models.IntegerField()
    prepared_at = models.DateTimeField(null=False)
    date_created = models.DateTimeField(null=True, blank=True)
    last_updated = models.DateTimeField(null=True, blank=True)
    email_body = models.TextField(blank=True)
    class Meta:
        db_table = u'web_email_audit'

class EmailSchedule(models.Model):
    id = models.IntegerField(primary_key=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    to_email = models.CharField(max_length=765)
    scheduled_for_relay = models.IntegerField()
    sent_at = models.DateTimeField(null=True, blank=True)
    from_email = models.CharField(max_length=765)
    subject = models.CharField(max_length=192, blank=True)
    message_body = models.TextField(blank=True)
    delivery_date = models.DateTimeField(null=True, blank=True)
    date_created = models.DateTimeField()
    last_updated = models.DateTimeField()
    class Meta:
        db_table = u'email_schedule'

class Module(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=48)
    display_name = models.CharField(max_length=96)
    handler = models.CharField(max_length=192)
    icon_file = models.CharField(max_length=96)
    description = models.CharField(max_length=765)
    class Meta:
        db_table = u'module'

class WebUsers(models.Model):
    uid = models.IntegerField(primary_key=True)
    name = models.CharField(unique=True, max_length=180)
    pass_field = models.CharField(max_length=384, db_column='pass') # Field renamed because it was a Python reserved word. Field name made lowercase.
    mail = models.CharField(max_length=762, blank=True)
    theme = models.CharField(max_length=765)
    signature = models.CharField(max_length=765)
    signature_format = models.CharField(max_length=765, blank=True)
    created = models.IntegerField()
    access = models.IntegerField()
    login = models.IntegerField()
    status = models.IntegerField()
    timezone = models.CharField(max_length=96, blank=True)
    language = models.CharField(max_length=36)
    init = models.CharField(max_length=762, blank=True)
    data = models.TextField(blank=True)
    picture = models.IntegerField()
    uuid = models.CharField(max_length=108)
    class Meta:
        db_table = u'web_users'

class WebUserDetail(models.Model):
    id = models.IntegerField(primary_key=True)
    user_id = models.IntegerField(unique=True)
    full_name = models.CharField(max_length=192, blank=True)
    description = models.TextField(blank=True)
    can_use_admin = models.IntegerField()
    alert_frequency = models.TextField(blank=False)
    class Meta:
        db_table = u'web_user_detail'


