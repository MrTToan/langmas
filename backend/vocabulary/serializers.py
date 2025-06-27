from rest_framework import serializers
from .models import Word, UserWordProgress

class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = '__all__'

class UserWordProgressSerializer(serializers.ModelSerializer):
    word = WordSerializer()
    class Meta:
        model = UserWordProgress
        fields = '__all__'