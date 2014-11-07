from django import forms
from django.forms import ModelForm
from models import Venue, Location
from django.forms.models import inlineformset_factory

class VenueForm(ModelForm):

    def clean(self):
        super(VenueForm, self).clean() #I would always do this for forms.
        return self.cleaned_data

    full_address = forms.CharField(label='Full Address', \
        help_text='Type a new address')

    latlng = forms.CharField(label='Lat/Lng', \
        help_text='Lat Long of the address')
    class Meta:
        model = Venue

