from django.views.generic import TemplateView, ListView
from models import Company

class IndexView(TemplateView):
	template_name ='reserved/index.html'

class CompanyList(ListView):
	model = Company
