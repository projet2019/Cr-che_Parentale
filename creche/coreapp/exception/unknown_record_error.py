#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##

class UnknownRecordError(Exception):

    def __init__(self, params):
        self.params = params
       

