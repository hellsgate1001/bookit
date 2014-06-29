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


class Venue(models.Model):
    name = models.CharField(max_length=255,
        help_text='Fiendly name of the venue such as <i>O2 Arena</i> ')

    address = models.ForeignKey(Location,
        help_text='The exact address of the venue.')

    company = models.ForeignKey(Company,
        help_text='Company in charge of the venue')

    contact = models.ManyToManyField(UserProfile,
        help_text='People to contact for event coordiation')


    def __unicode__(self):
        return "Venue: %s by %s" % (self.name, self.company)
