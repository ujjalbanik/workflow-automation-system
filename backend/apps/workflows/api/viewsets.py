from rest_framework import viewsets

from apps.workflows.api.serializers import WorkflowSerializer
from apps.workflows.models import Workflow


class WorkflowViewSet(viewsets.ModelViewSet):
    serializer_class = WorkflowSerializer

    def get_queryset(self):
        return Workflow.objects.filter(
            owner=self.request.user
        ).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)