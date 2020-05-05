
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author UWANTWALI ZIGAMA Didier
## d.zigama@pivotaccess.com/zigdidier@gmail.com
##

class UnknownColumnError(Exception):

    def __init__(self, params):
        self.params = params
       

