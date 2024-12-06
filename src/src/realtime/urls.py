from django.urls import path

from .views import index, get_filter_options, salesby_realtime

urlpatterns = [
    path('', index),
    path('realtime/filter-options/', get_filter_options, name='realtime-filter-options'),
    path('realtime/sales-by/<str:salesby>/', salesby_realtime, name='realtime-sales-by'),
]