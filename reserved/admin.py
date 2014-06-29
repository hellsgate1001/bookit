from django.contrib import admin
from models import Location, Customer, TelephoneType, Telephone, Company, Venue, Booking, Event

class LocationAdmin(admin.ModelAdmin):
    list_display = ('address', 'computed_address', 'latitude', 'longitude', 'geocode_error', 'address_ptr', 'name', )
    list_filter = ('address', 'computed_address', 'latitude', 'longitude', 'geocode_error', 'address_ptr', 'name', )
    search_fields = ('address', 'computed_address', 'latitude', 'longitude', 'geocode_error', 'address_ptr', 'name', )
    #fields = ('address', 'computed_address', 'latitude', 'longitude', 'geocode_error', 'address_ptr', 'name', )
    filter_horizontal = ()
    #exclude = (,)

class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', )
    list_filter = ('name', 'email', )
    search_fields = ('name', 'email', )
    #fields = ('name', 'email', )
    filter_horizontal = ()
    #exclude = (,)

class TelephoneTypeAdmin(admin.ModelAdmin):
    list_display = ('name', )
    list_filter = ('name', )
    search_fields = ('name', )
    #fields = ('name', )
    filter_horizontal = ()
    #exclude = (,)

class TelephoneAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'number', )
    list_filter = ('name', 'owner', 'number', )
    search_fields = ('name', 'owner', 'number', )
    #fields = ('name', 'owner', 'number', )
    filter_horizontal = ()
    #exclude = (,)

class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', )
    list_filter = ('name', )
    search_fields = ('name', )
    #fields = ('name', )
    filter_horizontal = ()
    #exclude = (,)

class VenueAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'company', )
    list_filter = ('name', 'address', 'company', )
    search_fields = ('name', 'address', 'company', )
    #fields = ('name', 'address', 'company', )
    filter_horizontal = ()
    #exclude = (,)

class BookingAdmin(admin.ModelAdmin):
    list_display = ('name', 'created', 'updated', 'arrival', 'depature', 'company', 'status', )
    list_filter = ('name', 'created', 'updated', 'arrival', 'depature', 'company', 'status', )
    search_fields = ('name', 'created', 'updated', 'arrival', 'depature', 'company', 'status', )
    #fields = ('name', 'created', 'updated', 'arrival', 'depature', 'company', 'status', )
    filter_horizontal = ()
    #exclude = (,)

class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'start_time', 'end_time', )
    list_filter = ('name', 'company', 'start_time', 'end_time', )
    search_fields = ('name', 'company', 'start_time', 'end_time', )
    #fields = ('name', 'company', 'start_time', 'end_time', )
    filter_horizontal = ()
    #exclude = (,)



admin.site.register(Location, LocationAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(TelephoneType, TelephoneTypeAdmin)
admin.site.register(Telephone, TelephoneAdmin)
admin.site.register(Company, CompanyAdmin)
admin.site.register(Venue, VenueAdmin)
admin.site.register(Booking, BookingAdmin)
admin.site.register(Event, EventAdmin)

