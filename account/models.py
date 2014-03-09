from django.contrib.auth.models import AbstractUser
from django.db import models

from bookit.models import BookitModel


class UserProfile(AbstractUser):
    middle_names = models.CharField(max_length=256, blank=True, default='')

    deleted_by = models.ForeignKey('self', blank=True, null=True, related_name='+')
    date_deleted = models.DateTimeField(blank=True, null=True)

    def __unicode__(self):
        return ('%(username)s (%(email)s)' %
            {'username': self.username, 'email', self.email})
