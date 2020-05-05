#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author UWANTWALI ZIGAMA Didier
## d.zigama@pivotaccess.com/zigdidier@gmail.com
##


from password_hasher import PasswordHasher

class uObj(object):
    pass_field = ""
    
account = uObj()
#account.pass_field = '$S$DGvu5o4fUw6jy0SUk1dgLPNxIHu4dOy97nrbLjWaSb0m86lAL88f';

d = PasswordHasher()
check = d.user_hash_password('chop', 15)

print ( "PWD " + str(check))
account.pass_field = check

check = d.user_check_password('chop', account);
print ("RESULT " + str(check))

