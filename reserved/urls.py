from django.conf.urls import patterns, include, url
from views import IndexView, CompanyList, VenueList, BookingList, \
BookingDetail, BookingCreate, VenueCalendarView, VenueCreate
from api import LocationAPI, BookingsAPI, CustomersAPI

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'bookit.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', IndexView.as_view()),
    url(r'^companies/$'
        , CompanyList.as_view() , name='reserved_companies'),

    url(r'^venues/$'
        , VenueList.as_view() , name='reserved_venues'),
    url(r'^venues/calendar/$'
        , VenueCalendarView.as_view() , name='reserved_venues_calendar'),
    url(r'^venues/new/$'
        , VenueCreate.as_view() , name='venues_create'),
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

    url(r'^api/locations/$'
        , LocationAPI.as_view() , name='locations_api'),
    url(r'^api/locations/(?P<location_id>[0-9]+)/?$'
        , LocationAPI.as_view() , name='locations_id_api'),
)
