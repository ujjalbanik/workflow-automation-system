from apps.executions.models import WorkflowExecution
from apps.workflows.models import Workflow


class ExecutionService:
    @staticmethod
    def start_execution(*, workflow: Workflow, user):
        return WorkflowExecution.objects.create(
            workflow=workflow,
            started_by=user,
            status=WorkflowExecution.Status.RUNNING,
        )

    @staticmethod
    def mark_success(execution: WorkflowExecution):
        execution.status = WorkflowExecution.Status.SUCCESS
        execution.save(update_fields=["status"])

    @staticmethod
    def mark_failed(execution: WorkflowExecution, error: str):
        execution.status = WorkflowExecution.Status.FAILED
        execution.error_message = error
        execution.save(
            update_fields=[
                "status",
                "error_message",
            ]
        )