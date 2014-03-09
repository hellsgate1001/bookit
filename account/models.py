from django.contrib.auth.models import AbstractUser, Group
from django.db import models


class User(AbstractUser):
    MALE = 'M'
    FEMALE = 'F'
    GENDER_CHOICES = (
        (MALE, 'Male'),
        (FEMALE, 'Female')
    )

    middle_names = models.CharField(max_length=256, blank=True, default='')
    address1 = models.CharField(max_length=255, default='')
    address2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255, default='')
    region = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=255, default='')
    postcode = models.CharField(max_length=10, default='')
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='')
    telephone = models.CharField(max_length=20, default='')
    mobile = models.CharField(max_length=20, blank=True)

    def __unicode__(self):
        return '%(username)s (%(email)s)' % {'username': self.username, 'email', self.email}
