from django.core.exceptions import ValidationError

from apps.workflows.models import Workflow, WorkflowStep


class WorkflowStepService:
    @staticmethod
    def create_step(*, workflow: Workflow, validated_data: dict) -> WorkflowStep:

        order = validated_data["order"]

        if WorkflowStep.objects.filter(
            workflow=workflow,
            order=order,
        ).exists():
            raise ValidationError(
                f"Step with order {order} already exists."
            )

        return WorkflowStep.objects.create(
            workflow=workflow,
            **validated_data,
        )