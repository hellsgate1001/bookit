from django.contrib import admin
from models import Location, Company

class LocationAdmin(admin.ModelAdmin):
    list_display = ('address', 'computed_address', 'latitude', 'longitude', 'geocode_error', 'address_ptr', 'name', )
    list_filter = ('address', 'computed_address', 'latitude', 'longitude', 'geocode_error', 'address_ptr', 'name', )
    search_fields = ('address', 'computed_address', 'latitude', 'longitude', 'geocode_error', 'address_ptr', 'name', )
    #fields = ('address', 'computed_address', 'latitude', 'longitude', 'geocode_error', 'address_ptr', 'name', )
    filter_horizontal = ()
    #exclude = (,)

class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', )
    list_filter = ('name', )
    search_fields = ('name', )
    #fields = ('name', )
    filter_horizontal = ()
    #exclude = (,)



admin.site.register(Location, LocationAdmin)
admin.site.register(Company, CompanyAdmin)

