from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import UserWordProgress

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request):
    user = request.user
    progresses = UserWordProgress.objects.filter(user=user)
    total = progresses.count()
    learned = progresses.filter(learned=True).count()
    in_progress = total - learned
    total_attempts = sum(p.attempts for p in progresses)
    total_correct = sum(p.correct for p in progresses)
    accuracy = round((total_correct / total_attempts) * 100) if total_attempts > 0 else 0
    return Response({
        "total": total,
        "learned": learned,
        "inProgress": in_progress,
        "accuracy": accuracy,
    })