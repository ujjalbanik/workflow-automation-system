from apps.actions.action_executor import ActionExecutor
from apps.executions.services.execution_service import ExecutionService
from apps.workflows.models import Workflow


class WorkflowEngineService:
    @staticmethod
    def execute(*, workflow: Workflow, user):
        execution = ExecutionService.start_execution(
            workflow=workflow,
            user=user,
        )

        try:
            steps = workflow.steps.all().order_by("order")

            for step in steps:
                ActionExecutor.execute(step)

            ExecutionService.mark_success(execution)

        except Exception as exc:
            ExecutionService.mark_failed(
                execution,
                str(exc),
            )
            raise