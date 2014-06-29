from django.conf.urls import patterns, include, url
from views import IndexView, CompanyList
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'bookit.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', IndexView.as_view()),
    url(r'^companies/$', CompanyList.as_view(), name='reserved_companies'),
    (r'^accounts/', include('userena.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
