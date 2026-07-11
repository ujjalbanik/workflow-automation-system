from apps.actions.executors.email_executor import EmailExecutor
from apps.actions.executors.http_executor import HttpExecutor
from apps.actions.executors.wait_executor import WaitExecutor


class ActionExecutor:
    EXECUTORS = {
        "EMAIL": EmailExecutor,
        "HTTP_REQUEST": HttpExecutor,
        "WAIT": WaitExecutor,
    }

    @staticmethod
    def execute(step):
        executor = ActionExecutor.EXECUTORS.get(step.step_type)

        if executor is None:
            raise ValueError(
                f"Unsupported step type: {step.step_type}"
            )

        executor.execute(step)
        
