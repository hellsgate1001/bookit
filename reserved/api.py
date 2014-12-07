from django.core import serializers

from models import Booking
from django.http import HttpResponse

# posts/api.py
from restless.dj import DjangoResource
from restless.preparers import FieldsPreparer
from simple_rest import Resource
from models import Company, Venue, Booking, Location
from simple_rest.auth.decorators import login_required, admin_required

from models import Booking, Customer, Event

'''
    class DateTimeEncoder(json.JSONEncoder):
    #    from django.db.models.fields.related import ManyRelatedManager

        def default(self, obj):

            # import pdb; pdb.set_trace()
            if isinstance(obj, datetime):
                encoded_object = obj.isoformat()
                # encoded_object = list(obj.timetuple())[0:6]
            elif obj.__class__.__name__ == 'ManyRelatedManager':
                return serializers.serialize('json', obj, fields=('id'))
            else:
                encoded_object = json.JSONEncoder.default(self, obj)
            return encoded_object

    def json_serial(obj):
        """JSON serializer for objects not serializable by default json code"""

        if isinstance(obj, datetime):
            serial = obj.isoformat()
            return serial
'''

def cheap_json_response(items, keys=None):
    seri = []
    for item in items:
        o = {}
        if keys is not None:
            for x in keys:
                o[x] = getattr(item, x)
            seri.append(o)
        else:
            seri.append(item)
    #d = dumps(seri, default=json_serial)
    # d = dumps(seri, cls=DateTimeEncoder)
    d = serializers.serialize('json', items)
    return HttpResponse(d, content_type='application/json', status=200)


class BookingsAPI(Resource):

    # @RESTfulResponse
    def get(self, request, booking_id=None, **kwargs):
        bookings = Booking.objects.all()
        keys =  ['name',
                'id',
                'created',
                'updated',
                'arrival',
                'depature',
                'customers',
                'status']
        if booking_id:
            bookings = bookings.filter(pk=booking_id)
        return cheap_json_response(bookings, keys)



class EventAPI(Resource):

    # @RESTfulResponse
    def get(self, request, booking_id=None, **kwargs):
        events = Event.objects.all()
        keys =  ['id',
                'name',
                'company',
                'venues',
                'bookings',
                'start_time',
                'end_time']
        if booking_id:
            events = events.filter(pk=booking_id)
        return cheap_json_response(events, keys)



class CustomersAPI(Resource):

    # @RESTfulResponse
    def get(self, request, booking_id=None, customer_id=None, **kwargs):

        if booking_id is not None:
            booking = Booking.objects.get(pk=booking_id)
            customers = booking.customers.all()
        elif customer_id is not None:
            customers = Customer.objects.get(pk=customer_id)
        else:
            customers = Customer.objects.all()

        return cheap_json_response(customers)


class LocationAPI(Resource):

    # @RESTfulResponse
    def get(self, request, location_id=None, **kwargs):
        # json_serializer = serializers.get_serializer('json')()
        # If a location_id URL param has been passed; fiter the outbound object result
        locations = Location.objects.all()
        keys =  ['name', 'address', 'latitude', 'longitude']
        if location_id:
            locations = locations.filter(pk=location_id)

        return cheap_json_response(locations,keys)


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

