from apps.actions.action_executor import ActionExecutor
from apps.executions.models import ExecutionLog
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

                try:

                    ActionExecutor.execute(step)

                    ExecutionService.log(
                        execution=execution,
                        step=step,
                        status=ExecutionLog.Status.SUCCESS,
                        message=f"{step.step_type} executed successfully.",
                    )

                except Exception as exc:

                    ExecutionService.log(
                        execution=execution,
                        step=step,
                        status=ExecutionLog.Status.FAILED,
                        message=str(exc),
                    )

                    raise

            ExecutionService.mark_success(execution)

        except Exception as exc:

            ExecutionService.mark_failed(
                execution,
                str(exc),
            )

            raise