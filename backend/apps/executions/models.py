import uuid

from django.db import models
from apps.workflows.models import Workflow, WorkflowStep


class WorkflowRun(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        RUNNING = "RUNNING", "Running"
        SUCCESS = "SUCCESS", "Success"
        FAILED = "FAILED", "Failed"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    workflow = models.ForeignKey(
        Workflow,
        on_delete=models.CASCADE,
        related_name="runs",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    started_at = models.DateTimeField(auto_now_add=True)

    completed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    error_message = models.TextField(
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-started_at"]

    def __str__(self):
        return f"{self.workflow.name} ({self.status})"

class ExecutionLog(models.Model):
    class Status(models.TextChoices):
        SUCCESS = "SUCCESS", "Success"
        FAILED = "FAILED", "Failed"
        SKIPPED = "SKIPPED", "Skipped"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    workflow_run = models.ForeignKey(
        WorkflowRun,
        on_delete=models.CASCADE,
        related_name="logs",
    )

    workflow_step = models.ForeignKey(
        WorkflowStep,
        on_delete=models.CASCADE,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
    )

    execution_time_ms = models.PositiveIntegerField(default=0)

    message = models.TextField(
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.workflow_step.name} - {self.status}"