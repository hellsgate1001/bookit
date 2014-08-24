from django.views.generic import TemplateView, ListView, CreateView
from models import Company, Venue, Booking, Location
from forms import VenueForm

from simple_rest.auth.decorators import login_required, admin_required
from django.http import HttpResponse
from django.core import serializers
from json import dumps
from simple_rest import Resource
# from simple_rest.response import RESTfulResponse

class LocationAPI(Resource):

    # @RESTfulResponse
    def get(self, request, location_id=None, **kwargs):
        # json_serializer = serializers.get_serializer('json')()
        # If a location_id URL param has been passed; fiter the outbound object result
        locations = Location.objects.all()

        if location_id:
            locations = locations.filter(pk=location_id)

        heavy_locations = []

        for location in locations:
            heavy_locations.append({
                'name': location.name,
                'address': location.address,
                'latitude': location.latitude,
                'longitude': location.longitude,
            })

        # return locations

        serial_location = dumps(heavy_locations)
        return HttpResponse(serial_location, content_type='application/json', status=200)


    @login_required
    def post(self, request, *args, **kwargs):
        Location.objects.create(
            name=request.POST.get('name'),
            address=request.POST.get('address'),
            latitude=request.POST.get('latitude'),
            longitude=request.POST.get('longitude') )
        return HttpResponse(status=201)


    @admin_required
    def delete(self, request, location_id):
        location = Location.objects.get(pk=location_id)
        location.delete()
        return HttpResponse(status=200)


class IndexView(TemplateView):
    template_name ='reserved/index.html'


class CompanyList(ListView):
    model = Company


class VenueCreate(CreateView):
    model = Venue
    form_class = VenueForm

    # def post(self, request, *args, **kwargs):
    #     post_values = request.POST.copy()

    #     import pdb; pdb.set_trace()
    #     return super(VenueCreate, self).post(request, *args, **kwargs)

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
            venue.save()

        return super(VenueCreate, self).form_valid(form)

    def get_success_url(self):
        return '/venues/'
        return '/venues/created/%s' % self.form_id


class VenueList(ListView):
    model = Venue


class VenueCalendarView(TemplateView):
    template_name = 'reserved/venue_calendar.html'


class BookingList(ListView):
    model = Booking


class BookingCreate(CreateView):
    model = Booking
