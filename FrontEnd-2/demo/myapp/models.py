from django.db import models

class Transaction(models.Model):
    sender_id = models.IntegerField()
    receiver_id = models.IntegerField()
    transaction_type = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_fraud = models.BooleanField(default=False)

def __str__(self):
    return self.sender_id +'->'+ self.receiver_id +':'+ self.transaction_type +':'+ str(self.amount)