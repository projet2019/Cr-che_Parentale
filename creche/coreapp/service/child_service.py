#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author Nadia
## nadia@gmail.com/joel@gmail.com
##

from coreapp.appmodel.models import CrecheChild, GENDER, CHILD_CLASSES
from coreapp.service.base_service import BaseService
from django.db.models import Q, Max
from django.utils.datetime_safe import datetime
from coreapp.exception.critical_error import CriticalError


class ChildService(BaseService):

    def __init__(self):
        BaseService.__init__(self)

    def list(self, params):

        sortLimitParams = self.setSortLimitParameters(params)

        filterObj = Q()
        if params.get('searchName'):
            filterObj = filterObj & Q(names__icontains=params.get('searchName'))
        if params.get('searchChildId'):
            filterObj = filterObj & Q(id=params.get('searchChildId'))
        if params.get('searchDateCreated'):
            filterObj = filterObj & Q(
                date_created__gte=datetime.strptime(params.get('searchDateCreated') + ' 00:00:59',
                                                      '%Y-%m-%d %H:%M:%S'))
            filterObj = filterObj & Q(
                date_created__lte=datetime.strptime(params.get('searchDateCreated') + ' 23:59:59',
                                                      '%Y-%m-%d %H:%M:%S'))
        if params.get('searchDOB'):
            filterObj = filterObj & Q(date_of_birth = params.get('searchDOB'))
        if params.get('searchGender'):
            filterObj = filterObj & Q(gender = params.get('searchGender'))
        if params.get('searchGroup'):
            filterObj = filterObj & Q(group = params.get('searchGroup'))
        if params.get('searchRegno'):
            filterObj = filterObj & Q( regno = params.get('searchRegno') )

        result = CrecheChild.objects.filter(filterObj).order_by(sortLimitParams['dir'] + sortLimitParams['sort'])[
                 sortLimitParams['start']: sortLimitParams['limit']]
        count = CrecheChild.objects.filter(filterObj).count()

        records = []
        for item in result:

            record = {}
            record['id'] = item.id
            record['regno'] = item.regno.encode('utf-8')
            record['dob'] = item.date_of_birth.isoformat()
            record['group'] = item.group.encode('utf-8')
            record['gender'] = item.gender.encode('utf-8')
            record['names'] = item.names
            record['reg_date'] = item.date_created.isoformat()
            records.append(record)

        return {'totalCount': count, 'records': records}

    def listExport(self, params):
        """Export the applicant data"""

        records = self.list(params)

        return self.decodeDataToExport(records, params.get('exportColumns'))

    def generate_regno(self):
        max_id = CrecheChild.objects.aggregate(nbr=Max('id'))
        nbr = max_id['nbr'] + 1 if max_id['nbr'] is not None else 1
        regno = 'C%s' % ( format(nbr, '0>5'),  )
        return regno

    def get_child(self, regno = None, child_id = None):
        child = None
        try:
            if regno: child =  CrecheChild.objects.get(regno = regno)
            if child_id: child = CrecheChild.objects.get(id = child_id)
        except Exception as e:
            print("CHILD ERROR ", e)
        return  child

    def save_child(self, postValues):
        child = None
        params = postValues.copy()
        if params.get("child_names"):
            try:
                child = CrecheChild.objects.get(id=params.get('child_id'))
                child.names = params.get('child_names')
                child.date_of_birth = params.get('dob')
                child.group = params.get('group')
                child.gender = params.get('gender')
                child.last_updated = datetime.now()
            except CrecheChild.DoesNotExist:
                regno = self.generate_regno()
                if self.get_child(regno = regno): regno = self.generate_regno()
                child = CrecheChild(names=params.get('child_names'),
                                    regno= regno, #TODO need to find asolution while saving concurrently
                                    date_of_birth = params.get('dob'),
                                    group = params.get('group'),
                                    gender = params.get('gender'),
                                    date_created = datetime.now(),
                                    last_updated = datetime.now()
                                    )
            try:
                child.save()

            except Exception:
                raise CriticalError({'message': "Unkwon Error while saving child '" + params.get(
                    'child_names') + "'. Try again or contact system admin "})

        return  child