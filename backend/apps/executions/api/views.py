from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from apps.executions.api.serializers import WorkflowExecutionSerializer
from apps.executions.models import WorkflowExecution


class WorkflowExecutionListAPIView(generics.ListAPIView):
    serializer_class = WorkflowExecutionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WorkflowExecution.objects.filter(
            started_by=self.request.user
        ).order_by("-started_at")


class WorkflowExecutionDetailAPIView(generics.RetrieveAPIView):
    serializer_class = WorkflowExecutionSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(
            WorkflowExecution,
            id=self.kwargs["pk"],
            started_by=self.request.user,
        )