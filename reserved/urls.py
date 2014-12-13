from django.conf.urls import patterns, include, url
from views import IndexView, CompanyList, VenueList, BookingList, \
BookingDetail, BookingCreate, VenueCalendarView, VenueCreate, \
EventCreate, EventList
from api import LocationAPI, BookingsAPI, CustomersAPI, EventAPI

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'bookit.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', IndexView.as_view()),
    url(r'^companies/$'
        , CompanyList.as_view() , name='reserved_companies'),

    url(r'^events/$'
        , EventList.as_view() , name='event_list'),
    url(r'^events/new/$'
        , EventCreate.as_view() , name='event_create'),

    url(r'^venues/$'
        , VenueList.as_view() , name='reserved_venues'),
    url(r'^venues/new/$'
        , VenueCreate.as_view() , name='venues_create'),
    url(r'^venues/calendar/$'
        , VenueCalendarView.as_view() , name='venues_calendar'),
    url(r'^venues/calendar/(?P<date_str>[0-9]{4}-[0-9]{2}-[0-9]{2})[/](?P<name_range>[\w]{0,}[^/])/$'
        , VenueCalendarView.as_view() , name='reserved_venues__date_calendar'),

    url(r'^bookings/$'
        , BookingList.as_view() , name='reserved_bookings'),
    url(r'^bookings/new/$'
        , BookingCreate.as_view() , name='bookings_create'),
    url(r'^bookings/detail/(?P<slug>[-_\w]+)/$'
        , BookingDetail.as_view() , name='bookings_detail'),

    (r'^accounts/', include('userena.urls')),
    url(r'^admin/', include(admin.site.urls)),
)

urlpatterns += patterns('',

    url(r'^api/bookings/$'
        , BookingsAPI.as_view() , name='bookings_api'),
    url(r'^api/bookings/(?P<booking_id>[0-9]+)/?$'
        , BookingsAPI.as_view() , name='bookings_id_api'),
    url(r'^api/bookings/(?P<booking_id>[0-9]+)/customers/?$'
        , CustomersAPI.as_view() , name='bookings_id_customers_api'),

    url(r'^api/customers/?$'
        , CustomersAPI.as_view() , name='customer_api'),
    url(r'^api/customers/(?P<customer_id>[0-9]+)/?$'
        , CustomersAPI.as_view() , name='customer_id_api'),

    url(r'^api/events/$'
        , EventAPI.as_view() , name='event_api'),

    url(r'^api/locations/$'
        , LocationAPI.as_view() , name='locations_api'),
    url(r'^api/locations/(?P<location_id>[0-9]+)/?$'
        , LocationAPI.as_view() , name='locations_id_api'),
)
