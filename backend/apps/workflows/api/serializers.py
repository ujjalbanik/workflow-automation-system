from rest_framework import serializers

from apps.workflows.models import Workflow


class WorkflowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workflow
        fields = (
            "id",
            "name",
            "description",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )