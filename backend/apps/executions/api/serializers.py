from rest_framework import serializers

from apps.executions.models import (
    WorkflowExecution,
    ExecutionLog,
)


class ExecutionLogSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExecutionLog
        fields = (
            "step_name",
            "step_type",
            "status",
            "message",
            "started_at",
            "finished_at",
        )


class WorkflowExecutionSerializer(serializers.ModelSerializer):

    workflow_name = serializers.CharField(
        source="workflow.name",
        read_only=True,
    )

    logs = ExecutionLogSerializer(
        many=True,
        read_only=True,
    )

    duration = serializers.SerializerMethodField()

    class Meta:
        model = WorkflowExecution
        fields = (
            "id",
            "workflow",
            "workflow_name",
            "started_by",
            "status",
            "started_at",
            "finished_at",
            "error_message",
            "duration",
            "logs",
        )

    def get_duration(self, obj):

        if not obj.finished_at:
            return None

        duration = (
            obj.finished_at -
            obj.started_at
        ).total_seconds()

        return round(duration, 2)