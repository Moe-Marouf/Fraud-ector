from django.shortcuts import render
from .models import Transaction

def display_transactions(request):
    transactions = Transaction.objects.all()
    return render(request, 'dashboard.html', {'transactions': transactions})
