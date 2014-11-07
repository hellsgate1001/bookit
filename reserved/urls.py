from django.conf.urls import patterns, include, url
from views import IndexView, CompanyList, VenueList, BookingList, \
BookingCreate, VenueCalendarView, VenueCreate, LocationAPI

from django.contrib import admin
admin.autodiscover()


urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'bookit.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', IndexView.as_view()),
    url(r'^companies/$', CompanyList.as_view(), name='reserved_companies'),
    url(r'^api/locations/$', LocationAPI.as_view(), name='locations_resource'),
    url(r'^api/locations/(?P<location_id>[0-9]+)/?$', LocationAPI.as_view(), name='locations_resource'),
    url(r'^venues/$', VenueList.as_view(), name='reserved_venues'),
    url(r'^venues/calendar/$', VenueCalendarView.as_view(), name='reserved_venues_calendar'),
    url(r'^venues/new/$', VenueCreate.as_view(), name='venues_create'),
    url(r'^bookings/$', BookingList.as_view(), name='reserved_bookings'),
    url(r'^bookings/new/$', BookingCreate.as_view(), name='bookings_create'),
    (r'^accounts/', include('userena.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
