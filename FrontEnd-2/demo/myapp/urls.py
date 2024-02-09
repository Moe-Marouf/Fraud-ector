from django.urls import path
from .views import display_transactions

urlpatterns = [
    # ... your existing URL patterns ...
    path('dashboard/', display_transactions, name='dashboard'),
]