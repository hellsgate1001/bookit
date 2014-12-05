from django.views.generic import TemplateView, ListView, CreateView, DetailView
from models import Company, Venue, Booking, Location
from forms import VenueForm

from simple_rest.auth.decorators import login_required, admin_required
from django.http import HttpResponse
from django.core import serializers
#from json import dumps
# import json
# from simple_rest.response import RESTfulResponse
from django.contrib import messages

from datetime import datetime


class IndexView(TemplateView):
    template_name ='reserved/index.html'


class CompanyList(ListView):
    model = Company


class VenueCreate(CreateView):
    model = Venue
    form_class = VenueForm

    def form_valid(self, form):
        # This method is called when valid form data has been POSTed.
        # It should return an HttpResponse.
        # form.send_email()
        venue = form.save()
        self.form_id = venue.id
        ll = form.cleaned_data.get('latlng', None)
        full_address = form.cleaned_data.get('full_address', None)
        # import pdb; pdb.set_trace()
        if ll and full_address:
            lat, lng = ll.split(',')

            location, created = Location.objects.get_or_create(address=full_address)
            if created is True:
                location.name=venue.name
                location.latitude=lat
                location.longitude=lng
                location.save()
            venue.address = location
        venue.owner = self.request.user
        venue.save()
        messages.success(self.request, 'New venue \'%s\' created' % (venue))
        return super(VenueCreate, self).form_valid(form)

    def get_success_url(self):
        return '/venues/'
        return '/venues/created/%s' % self.form_id


class VenueList(ListView):
    model = Venue

    def get_context_data(self, **kwargs):
        kwargs['venues_owned'] = self.model.objects.filter(owner=self.request.user)
        kwargs['venues_other'] = self.model.objects.filter(contact__email=self.request.user.email)
        return kwargs


class VenueCalendarView(TemplateView):
    template_name = 'reserved/venue_calendar.html'


class BookingList(ListView):
    model = Booking


class BookingCreate(CreateView):
    model = Booking


class BookingDetail(DetailView):
    slug_field = 'name'
    model = Booking
