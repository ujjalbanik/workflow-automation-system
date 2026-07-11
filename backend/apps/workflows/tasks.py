from celery import shared_task

from apps.workflows.models import Workflow
from apps.workflows.services.workflow_engine_service import WorkflowEngineService


@shared_task
def execute_workflow(workflow_id, user_id):
    workflow = Workflow.objects.get(id=workflow_id)

    WorkflowEngineService.execute(
        workflow=workflow,
        user=workflow.owner,
    )