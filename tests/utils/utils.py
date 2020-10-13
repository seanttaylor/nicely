from abc import ABC, abstractmethod;
import random
import string

def random_email_address():
  length = 10;
  email = ''.join(random.choice(string.ascii_letters) for x in range(length)) + "@test.com"
  return email.lower();


def random_user_handle():
  length = 10;
  handle = ''.join(random.choice(string.ascii_letters) for x in range(length));
  return "@" + handle.lower();


def random_phone_number():
    p=list('0000000000')
    p[0] = str(random.randint(1,9))
    for i in [1,2,6,7,8]:
        p[i] = str(random.randint(0,9))
    for i in [3,4]:
        p[i] = str(random.randint(0,8))
    if p[3]==p[4]==0:
        p[5]=str(random.randint(1,8))
    else:
        p[5]=str(random.randint(0,8))
    n = range(10)
    if p[6]==p[7]==p[8]:
        n = (i for i in n if i!=p[6])
    p[9] = str(random.choice(n))
    p = ''.join(p)
    return p[:3] + '-' + p[3:6] + '-' + p[6:]