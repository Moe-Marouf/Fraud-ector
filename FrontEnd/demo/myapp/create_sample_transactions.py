import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project.settings')
django.setup()

from models import Transaction

def create_sample_transactions():
    transactions_data = [
        {'sender_id': 101, 'receiver_id': 201, 'transaction_type': 'Credit', 'amount': 500.00, 'is_fraud': False},
        {'sender_id': 102, 'receiver_id': 202, 'transaction_type': 'Debit', 'amount': 300.00, 'is_fraud': True},
        {'sender_id': 103, 'receiver_id': 203, 'transaction_type': 'Credit', 'amount': 1000.00, 'is_fraud': False},
        {'sender_id': 104, 'receiver_id': 204, 'transaction_type': 'Credit', 'amount': 800.00, 'is_fraud': True},
        {'sender_id': 105, 'receiver_id': 205, 'transaction_type': 'Debit', 'amount': 700.00, 'is_fraud': False},
    ]

    for data in transactions_data:
        Transaction.objects.create(**data)

if __name__ == "__main__":
    create_sample_transactions()
