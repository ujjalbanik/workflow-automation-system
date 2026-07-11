from rest_framework import serializers

from apps.executions.models import WorkflowExecution


class WorkflowExecutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowExecution
        fields = "__all__"
        read_only_fields = "__all__"