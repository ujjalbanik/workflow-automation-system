from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.workflows.api.serializers import WorkflowSerializer
from apps.workflows.models import Workflow
from apps.workflows.services.workflow_engine_service import WorkflowEngineService
from apps.workflows.tasks import execute_workflow

class WorkflowViewSet(viewsets.ModelViewSet):
    serializer_class = WorkflowSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Workflow.objects
            .filter(owner=self.request.user)
            .order_by("-created_at")
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["post"])
    def execute(self, request, pk=None):
        workflow = self.get_object()

        execute_workflow.delay(
            str(workflow.id),
            str(request.user.id),
        )

        return Response(
            {
                "message": "Workflow execution started."
            }
        )