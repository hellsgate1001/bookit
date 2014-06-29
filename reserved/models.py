from django.db import models
from django.utils import timezone
from account.models import UserProfile
from easy_maps.models import Address


class BookitModel(models.Model):
    request = None

    def delete(self):
        if hasattr(self, 'is_active'):
            self.is_active = False
            if hasattr(self, 'deleted_by'):
                self.deleted_by = self.request.user
            if hasattr(self, 'date_deleted'):
                date_deleted = timezone.datetime.now()
            self.save()
        else:
            super(BookitModel, self).delete()

    class Meta:
        abstract = True


class Location(Address):
    '''
    Define a location for a point on the planet.
    '''
    name = models.CharField(max_length=255, help_text='Name of the location')


class Company(models.Model):
    name = models.CharField(max_length=255)
    addresses = models.ManyToManyField(Location)
    contact = models.ManyToManyField(UserProfile)

    def __unicode__(self):
        return "Company: %s" % self.name
