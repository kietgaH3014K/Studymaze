from rest_framework import serializers
from .models import ProgressLog

class ProgressLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressLog
        fields = [
            'id',
            'user',
            'subject',      # NEW
            'week',
            'day_number',   # NEW
            'task_title',
            'status',
            'created_at',
            'updated_at',
        ]
