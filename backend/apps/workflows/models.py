from django.conf import settings
from django.db import models
import uuid

class Workflow(models.Model):
    id = models.UUIDField(
    primary_key=True,
    default=uuid.uuid4,
    editable=False,
)
    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        ACTIVE = "ACTIVE", "Active"
        PAUSED = "PAUSED", "Paused"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="workflows",
    )

    name = models.CharField(max_length=255)

    description = models.TextField(
        blank=True,
        null=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class WorkflowStep(models.Model):
    class StepType(models.TextChoices):
        CONDITION = "CONDITION", "Condition"
        ACTION = "ACTION", "Action"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    workflow = models.ForeignKey(
        Workflow,
        on_delete=models.CASCADE,
        related_name="steps",
    )

    order = models.PositiveIntegerField()

    name = models.CharField(max_length=255)

    step_type = models.CharField(
        max_length=20,
        choices=StepType.choices,
    )

    configuration = models.JSONField(default=dict)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order"]

        constraints = [
            models.UniqueConstraint(
                fields=["workflow", "order"],
                name="unique_workflow_step_order",
            )
        ]

        indexes = [
            models.Index(fields=["workflow", "order"]),
        ]

    def __str__(self):
        return f"{self.workflow.name} - Step {self.order}"
    
