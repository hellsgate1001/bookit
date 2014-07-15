from django.conf.urls import patterns, include, url
from views import IndexView, CompanyList, VenueList, BookingList, \
BookingCreate, VenueCalendarView
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'bookit.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', IndexView.as_view()),
    url(r'^companies/$', CompanyList.as_view(), name='reserved_companies'),
    url(r'^venues/$', VenueList.as_view(), name='reserved_venues'),
    url(r'^venues/calendar/$', VenueCalendarView.as_view(), name='reserved_venues'),
    url(r'^bookings/$', BookingList.as_view(), name='reserved_bookings'),
    url(r'^bookings/new/$', BookingCreate.as_view(), name='bookings_create'),
    (r'^accounts/', include('userena.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
