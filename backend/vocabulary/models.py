from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Word(models.Model):
    word = models.CharField(max_length=100)
    definition = models.TextField()

    def __str__(self):
        return self.word

class UserWordProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    attempts = models.IntegerField(default=0)
    correct = models.IntegerField(default=0)
    learned = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.word.word}"