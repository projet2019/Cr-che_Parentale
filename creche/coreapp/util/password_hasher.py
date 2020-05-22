#!  /usr/bin/env python
# encoding: utf-8
# vim: ai ts=4 sts=4 et sw=4

##
##
## @author   Joel
## nadia@gmail.com/joel@gmail.com
##

import math
import hashlib
from decimal import Decimal
from random import randint

class PasswordHasher():

    DRUPAL_HASH_COUNT = 15

    DRUPAL_MIN_HASH_COUNT = 7

    DRUPAL_MAX_HASH_COUNT = 30

    DRUPAL_HASH_LENGTH = 55

    def user_check_password(self, password, account):

Nadia   if account.pass_field[:2] == 'U$':
NadiaNadia# This may be an updated password from user_update_7000(). Such hashes
NadiaNadia# have 'U' added as the first character and need an extra md5().
NadiaNadiastored_hash = account.pass_field[1:]
NadiaNadiam = hashlib.md5()
NadiaNadiam.update(password)
NadiaNadiapassword = m.hexdigest()#.encode('utf-8')
Nadia   else:
NadiaNadiastored_hash = account.pass_field

Nadia   type = stored_hash[:3]

Nadia   if '$S$' == type:
NadiaNadia  # A normal Drupal 7 password using sha512.
NadiaNadia  hash = self._password_crypt('sha512', password, stored_hash)
Nadia   elif '$H$' == type:
NadiaNadia  pass
Nadia   elif '$P$' == type:
NadiaNadia  # A phpass password generated using md5.  This is an
NadiaNadia  # imported password or from an earlier Drupal version.
NadiaNadia  hash = self._password_crypt('md5', password, stored_hash)

Nadia   return (hash and stored_hash == hash)

    def _password_crypt(self, algo, password, setting):
Nadia   # The first 12 characters of an existing hash are its setting string.
Nadia   setting = setting[:12]

Nadia   if setting[0] != '$' or setting[2] != '$':
NadiaNadiareturn False

Nadia   count_log2 = self._password_get_count_log2(setting)
Nadia   # Hashes may be imported from elsewhere, so we allow != DRUPAL_HASH_COUNT
Nadia   if count_log2 < self.DRUPAL_MIN_HASH_COUNT or count_log2 > self.DRUPAL_MAX_HASH_COUNT:
NadiaNadiareturn False

Nadia   salt = setting[4: 12]

Nadia   # Hashes must have an 8 character salt.
Nadia   if len(salt) != 8:
NadiaNadiareturn False

Nadia   # Convert the base 2 logarithm into an integer.
Nadia   count = 1 << count_log2

Nadia   # We rely on the hash() function being available in PHP 5.2+.
Nadia   hash = hashlib.sha512((salt + password).encode('utf-8')).digest()

Nadia   for i in range(count):
NadiaNadia  hash = hashlib.sha512(hash + password.encode("utf-8")).digest()

Nadia   hash_length = len(hash)

Nadia   output =  setting + self._password_base64_encode(hash, hash_length)
Nadia   # _password_base64_encode() of a 16 byte MD5 will always be 22 characters.
Nadia   # _password_base64_encode() of a 64 byte sha512 will always be 86 characters.
Nadia   expected = Decimal('12') + Decimal(str(math.ceil((Decimal('8') * Decimal(str(hash_length))) / Decimal('6'))))

Nadia   if len(output) == expected:
NadiaNadia  return output[:self.DRUPAL_HASH_LENGTH]

    def _password_get_count_log2(self, setting):

Nadia   itoa64 = self._password_itoa64()

Nadia   return itoa64.index(setting[3])

    def _password_itoa64(self):
Nadia   return './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

    def _password_base64_encode(self, input, count):

Nadia   output = ''
Nadia   i = 0
Nadia   itoa64 = self._password_itoa64()

Nadia   while i < count:
NadiaNadia#print(i, input)
NadiaNadiavalue =  ord(input[i]) if type(input[i]) == str else input[i]
NadiaNadiai = i + 1

NadiaNadiaoutput += itoa64[value & 0x3f]

NadiaNadiaif i < count:
NadiaNadia  value |=  ord(input[i]) if type(input[i]) == str else input[i] << 8

NadiaNadiaoutput += itoa64[(value >> 6) & 0x3f]

NadiaNadiaif i >= count:
NadiaNadia  break
NadiaNadiai += 1

NadiaNadiaif i < count:
NadiaNadia  value |=  ord(input[i]) if type(input[i]) == str else input[i] << 16

NadiaNadiaoutput += itoa64[(value >> 12) & 0x3f]

NadiaNadiaif i >= count:
NadiaNadia  break
NadiaNadiai += 1

NadiaNadiaoutput += itoa64[(value >> 18) & 0x3f]

Nadia   return output

    def user_hash_password(self, password, count_log2):

Nadia   return self._password_crypt('sha512', password, self._password_generate_salt(count_log2))

    def _password_generate_salt(self, count_log2):
Nadia   output = '$S$'
Nadia   # We encode the final log2 iteration count in base 64.
Nadia   itoa64 = self._password_itoa64()
Nadia   output += itoa64[count_log2]

Nadia   #6 bytes is the standard salt for a portable phpass hash.
Nadia   v = randint(1, 15)
Nadia   z = v + 6
Nadia   output += self._password_base64_encode(itoa64[v: z], 6)

Nadia   return output
