from rest_framework import serializers

from apps.workflows.models import WorkflowStep


class WorkflowStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowStep
        fields = (
            "id",
            "order",
            "name",
            "description",
            "step_type",
            "configuration",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )