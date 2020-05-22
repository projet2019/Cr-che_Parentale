#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author    
## nadinecy@gmail.com
##


from django.db import models
import datetime
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

GENDER = (
    ("Male", "Male"),
    ("Female", "Female")
)

ACTIVITY_CATEGORY = (

    ("Art", "Art"),
    ("Lecture", "Lecture"),
    ("Picnic", "Picnic")
)

PRINCIPAL_ROLE = (
    ("Accueillante", "Accueillante"),
    ("Directrice", "Directrice"),
    ("Directeur", "Directeur"),
    ("Teacher", "Teacher")

)

class CrecheChild(models.Model):
    id = models.AutoField(primary_key=True)
    regno = models.CharField(max_length=6, unique=True)
    names = models.CharField(max_length=200)
    date_of_birth = models.DateField(blank=True)
    group = models.CharField(max_length = 20,
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia    choices = CHILD_CLASSES,
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia    default = 'Petit'
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia    )
    gender = models.CharField(max_length=20,
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia   choices=GENDER,
NadiaNadiaNadiaNadiaNadiaNadiaNadiaNadia   default='Male'
NadiaNadiaNadiaNadiaNadiaNadia)

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now_add=True)
    class Meta:
Nadia   db_table = u'kid'

class CrecheParent(models.Model):
    id = models.AutoField(primary_key=True)
    names = models.CharField(max_length=200)
    telephone = models.CharField(max_length=20)
    identity_document = models.CharField(max_length=50, unique=True)
    full_address = models.TextField(blank=True)
    email = models.CharField(max_length=100, unique=True)
    relationship = models.CharField(
NadiaNadiaNadiaNadiaNadiaNadiaNadia max_length = 20,
NadiaNadiaNadiaNadiaNadiaNadiaNadia choices = PARENT_CHILD_RELATION,
NadiaNadiaNadiaNadiaNadiaNadiaNadia default = 'Guardian'
NadiaNadiaNadiaNadiaNadiaNadiaNadia )
    children = models.ManyToManyField(CrecheChild, related_name="parents")
    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now_add=True)
    class Meta:
Nadia   db_table = u'guardian'

class CrechePrincipal(models.Model):
    id = models.AutoField(primary_key=True)
    names = models.CharField(max_length=200, blank=True)
    telephone = models.CharField(max_length=20, blank=True)
    identity_document =  models.CharField(max_length=50, unique=True)
    full_address = models.TextField(blank=True)
    email = models.CharField(max_length=100, unique=True)
    role = models.CharField(
NadiaNadiaNadiaNadiaNadiaNadiaNadia max_length = 20,
NadiaNadiaNadiaNadiaNadiaNadiaNadia choices = PRINCIPAL_ROLE,
NadiaNadiaNadiaNadiaNadiaNadiaNadia default = 'Accueillante'
NadiaNadiaNadiaNadiaNadiaNadiaNadia )
    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now_add=True)
    class Meta:
Nadia   db_table = u'principal'

class ComposantRepas(models.Model):
    id = models.AutoField(primary_key=True)
    component_name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    class Meta:
Nadia   db_table = u'patisserie'

class Repas(models.Model):
    id = models.AutoField(primary_key=True)
    date_time = models.DateTimeField(auto_now_add=True)
    menu = models.ManyToManyField(ComposantRepas, related_name="components")
    unit_price = models.FloatField(blank=True, null=True)
    class Meta:
Nadia   db_table = u'repas'

class ChildActivity(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)
    category = models.CharField(max_length = 20,
NadiaNadiaNadiaNadiaNadiaNadia  choices = ACTIVITY_CATEGORY
NadiaNadiaNadiaNadiaNadiaNadia  )
    unit_price = models.FloatField(blank=True, null=True)
    class Meta:
Nadia   db_table = u'activity'

class  DailyChildReport(models.Model):
    id = models.AutoField(primary_key=True)
    child = models.ForeignKey(CrecheChild, on_delete=models.CASCADE)
    accueillante = models.ForeignKey(CrechePrincipal, on_delete=models.CASCADE)
    repas = models.ForeignKey(Repas, on_delete=models.CASCADE)
    activities = models.ManyToManyField(ChildActivity, related_name="activities")
    day = models.DateField(auto_now_add=True)
    date_created = models.DateTimeField(auto_now_add=True)
    day_price = models.FloatField(default=7.50)
    class Meta:
Nadia   db_table = u'report'

class Bill(models.Model):
    id = models.AutoField(primary_key=True)
    bill_no = models.CharField(max_length=12, unique=True)
    child = models.ForeignKey(CrecheChild, on_delete=models.CASCADE)
    month = models.IntegerField(default=0)
    year = models.IntegerField(default=0)
    date_time = models.DateTimeField(auto_now_add=True)
    class Meta:
Nadia   db_table = u'bill'

class LoginAudit(models.Model):
    id = models.AutoField(primary_key=True)
    created_by_id = models.IntegerField()
    ip_address = models.CharField(max_length=765)
    logout_date = models.DateTimeField(blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(blank=True, null=True)
    class Meta:
Nadia   db_table = u'login_audit'

class EventType(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(unique=True, max_length=192)
    is_public = models.IntegerField()
    template_path = models.CharField(max_length=765)
    parameter = models.CharField(max_length=765, blank=True)
    from_email = models.CharField(max_length=765)
    group_text = models.CharField(max_length=96, blank=True)
    description = models.TextField(blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now_add=True)
    class Meta:
Nadia   db_table = u'event_type'
Nadia   

class Event(models.Model):
    id = models.AutoField(primary_key=True)
    event_type = models.ForeignKey(EventType, on_delete=models.CASCADE)
    entity_reference_id = models.IntegerField(null=True, blank=True)
    date_generated = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=255)
    processed = models.IntegerField()
    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now_add=True)
    class Meta:
Nadia   db_table = u'event'

class SystemUserEventType(models.Model):
    id = models.AutoField(primary_key=True)
    event_type_id = models.IntegerField(null=False)
    system_user_id = models.IntegerField(null=False)
    can_unsubscribe = models.IntegerField()
    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now_add=True)
    class Meta:
Nadia   db_table = u'system_user_has_event_type'
Nadia   unique_together = ['event_type_id', 'system_user_id']

class WebEmailAudit(models.Model):
    id = models.AutoField(primary_key=True)
    latest_test = models.DateTimeField(auto_now_add=True)
    issue_number = models.IntegerField()
    is_abort = models.IntegerField()
    prepared_at = models.DateTimeField(null=False)
    date_created = models.DateTimeField(null=True, blank=True)
    last_updated = models.DateTimeField(null=True, blank=True)
    email_body = models.TextField(blank=True)
    class Meta:
Nadia   db_table = u'web_email_audit'

class EmailSchedule(models.Model):
    id = models.AutoField(primary_key=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    to_email = models.CharField(max_length=765)
    scheduled_for_relay = models.IntegerField()
    sent_at = models.DateTimeField(null=True, blank=True)
    from_email = models.CharField(max_length=765)
    subject = models.CharField(max_length=192, blank=True)
    message_body = models.TextField(blank=True)
    delivery_date = models.DateTimeField(null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now_add=True)
    class Meta:
Nadia   db_table = u'email_schedule'

class Module(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=48)
    display_name = models.CharField(max_length=96)
    handler = models.CharField(max_length=192)
    icon_file = models.CharField(max_length=96)
    description = models.CharField(max_length=765)
    class Meta:
Nadia   db_table = u'module'

class WebUsers(models.Model):
    uid = models.AutoField(primary_key=True)
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
Nadia   db_table = u'web_users'

class WebUserDetail(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.IntegerField(unique=True)
    full_name = models.CharField(max_length=192, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    can_use_admin = models.IntegerField(default = False)
    alert_frequency = models.TextField(null=True, blank=True)
    class Meta:
Nadia   db_table = u'web_user_detail'


class UserModule(models.Model):
    id = models.AutoField(primary_key=True)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    system_user = models.ForeignKey(WebUsers, on_delete=models.CASCADE)
    class Meta:
Nadia   db_table = u'user_module_perm'



