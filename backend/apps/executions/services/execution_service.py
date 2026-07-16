from apps.executions.models import (
    WorkflowExecution,
    ExecutionLog,
)
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
    def log(
        execution,
        step,
        status,
        message,
    ):
        return ExecutionLog.objects.create(
            execution=execution,
            step_name=step.name,
            step_type=step.step_type,
            status=status,
            message=message,
        )

    @staticmethod
    def mark_success(execution):
        execution.status = WorkflowExecution.Status.SUCCESS
        execution.save()

    @staticmethod
    def mark_failed(
        execution,
        error,
    ):
        execution.status = WorkflowExecution.Status.FAILED
        execution.error_message = error
        execution.save()