from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.executions.models import WorkflowExecution
from apps.workflows.models import Workflow


class DashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "total_workflows": Workflow.objects.filter(
                owner=request.user
            ).count(),

            "total_executions": WorkflowExecution.objects.filter(
                started_by=request.user
            ).count(),

            "successful_executions": WorkflowExecution.objects.filter(
                started_by=request.user,
                status="SUCCESS"
            ).count(),

            "failed_executions": WorkflowExecution.objects.filter(
                started_by=request.user,
                status="FAILED"
            ).count(),
        })