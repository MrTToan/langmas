from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.user_stats, name='user-stats'),
    # Add more endpoints for words, progress, CSV upload, etc.
]