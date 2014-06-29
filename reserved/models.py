from django.db import models
from django.utils import timezone
from account.models import UserProfile
from easy_maps.models import Address

from phonenumber_field.modelfields import PhoneNumberField

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
    '''Define a location for a point on the planet.'''
    name = models.CharField(max_length=255, help_text='Name of the location')



class Customer(models.Model):
    '''
    A customer defines an entity for puchasing bookings.
    A  Customer does not directly associate a Telehpone. A valid reference
    through the inheritence chain as a Telephone needs a Customer - But as
    Customer does not need a Telephone
    '''
    name = models.CharField(max_length=255)
    address = models.ManyToManyField(Location)
    email = models.EmailField(null=True, blank=True)

    def __unicode__(self):
        return "Customer: %s:%s" % (self.name, self.email)

class TelephoneType(models.Model):
    name = models.CharField(max_length=255, help_text='The name of the contact \
        phone number. i.e "Work" ')

    def __unicode__(self):
        return self.name

class Telephone(models.Model):
    '''
    The Telephone model assocates a Customer. A Customer can have many
    telephone numbers.

    The Telephone object has a reference to a Customer. therefore a Customer
    does not have a direct reference to a Telephone.

    As in; A Telephone must be owned by person, but a person(Customer) does
    not require a Telephone.

    '''
    name = models.ForeignKey(TelephoneType)
    owner = models.ForeignKey(Customer)
    number = PhoneNumberField()

    def __unicode__(self):
        return "%s %s: %s" % (self.owner.name, self.name, self.number)


class Company(models.Model):
    ''' A company defines an existing agent, of which has an address and
    a contact person.'''

    name = models.CharField(max_length=255)
    addresses = models.ManyToManyField(Location)
    contact = models.ManyToManyField(UserProfile)
    telephone = models.ManyToManyField(Telephone)

    def __unicode__(self):
        return "Company: %s" % self.name

class Venue(models.Model):
    '''A venue is a location of which events occur. A venue is a location owned
    by a company, Many Bookings can be made at a Venue through any Event.'''

    name = models.CharField(max_length=255,
        help_text='Fiendly name of the venue such as <i>O2 Arena</i> ')

    address = models.ForeignKey(Location,
        help_text='The exact address of the venue.')

    company = models.ForeignKey(Company,
        help_text='Company in charge of the venue')

    contact = models.ManyToManyField(Customer,
        help_text='People to contact for event coordiation')


    def __unicode__(self):
        return "Venue: %s by %s" % (self.name, self.company)


class Booking(models.Model):
    ''' A Booking associates an event with a customer. The Customer will
    attend the Venue at the datetime provided.
    The status of the booking is goverened externally. '''

    '''
    If no name is provided, the booking name is the Customer. If a customer
    has been ommited, The company name is used. Without a Customer or Company,
    a default booking name is provided.
    '''
    name = models.CharField(max_length=255, help_text='Optionally name of the booking entity.')


    created = models.DateTimeField(auto_now=False, editable=False,
        null=True, blank=True, auto_now_add=True,
        help_text='The Booking creation time.')

    updated = models.DateTimeField(auto_now=True, editable=False,
        null=True, blank=True, auto_now_add=False,
        help_text='The Booking update time.')

    arrival = models.DateTimeField(null=True, blank=True, help_text='The expected arrival time of \
        the customer. If no arrival time is applied, the booking event \
        default start time will be used.')

    depature = models.DateTimeField(null=True, blank=True, help_text='The expected \
        leaving time of the customer. If no deature time is applied, the \
        booking event default end time will be used.')

    company = models.ForeignKey(Company,null=True, blank=True,
        help_text='Did a company create this booking.')

    customers =  models.ManyToManyField(Customer,null=True, blank=True,
        help_text='People to contact for event coordiation')

    status = models.CharField(max_length=100,null=True, blank=True)


class Event(models.Model):
    ''' An Event defines a location for many bookings to occur. Each booking
    associates a customer and a time to an event.
    An event may occur over many venues (An event may last more than one
        venue location.)
    Any Event may have a number of bookings, containing Customers and
    times. '''

    name = models.CharField(max_length=255,
        help_text='Fiendly name of the event such as <i>Slipknot 9.0</i> ')

    company = models.ForeignKey(Company, null=True, blank=True,
        help_text='Company in charge of the event')

    venues = models.ManyToManyField(Venue,
        help_text='Venues of which this event takes place')

    bookings = models.ManyToManyField(Booking, null=True, blank=True,
        help_text='Venues of which this event takes place')

    start_time = models.DateTimeField( null=True, blank=True,
        help_text='The Date and time the Event \
        open. If no start time is applied, the event is immediately open.')

    end_time = models.DateTimeField( null=True, blank=True,
        help_text='The Date and time the Event \
        finish. If no end time is applied, the event is always open.')
