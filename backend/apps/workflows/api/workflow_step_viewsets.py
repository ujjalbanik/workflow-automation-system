from django.shortcuts import get_object_or_404

from rest_framework import viewsets

from apps.workflows.models import Workflow, WorkflowStep
from apps.workflows.api.workflow_step_serializers import WorkflowStepSerializer
from apps.workflows.services.workflow_step_service import WorkflowStepService


class WorkflowStepViewSet(viewsets.ModelViewSet):
    serializer_class = WorkflowStepSerializer

    def get_workflow(self):
        return get_object_or_404(
            Workflow,
            id=self.kwargs["workflow_id"],
            owner=self.request.user,
        )

    def get_queryset(self):
        return WorkflowStep.objects.filter(
            workflow=self.get_workflow()
        ).order_by("order")

    def perform_create(self, serializer):
        step = WorkflowStepService.create_step(
            workflow=self.get_workflow(),
            validated_data=serializer.validated_data,
        )
        serializer.instance = step