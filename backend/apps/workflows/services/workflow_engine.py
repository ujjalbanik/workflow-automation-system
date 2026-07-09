from apps.workflows.models import Workflow
import logging

logger = logging.getLogger(__name__)

class WorkflowEngine:
    """
    Core engine responsible for executing workflows.
    """

    def execute(self, workflow: Workflow):
        self.validate(workflow)

        logger.info("Executing workflow: %s", workflow.name)

    def validate(self, workflow: Workflow):
        """
        Validate workflow before execution.
        """

        if workflow.status != Workflow.Status.ACTIVE:
            raise ValueError("Workflow is not active.")

        if not hasattr(workflow, "trigger"):
            raise ValueError("Workflow has no trigger.")

        if not workflow.steps.exists():
            raise ValueError("Workflow has no steps.")