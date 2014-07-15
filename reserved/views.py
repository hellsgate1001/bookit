from django.views.generic import TemplateView, ListView, CreateView
from models import Company, Venue, Booking

class IndexView(TemplateView):
	template_name ='reserved/index.html'

class CompanyList(ListView):
	model = Company

class VenueList(ListView):
	model = Venue

class VenueCalendarView(TemplateView):
	template_name = 'reserved/venue_calendar.html'

class BookingList(ListView):
	model = Booking

class BookingCreate(CreateView):
	model = Booking
