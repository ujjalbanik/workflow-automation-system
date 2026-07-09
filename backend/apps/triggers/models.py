import uuid

from django.db import models
from apps.workflows.models import Workflow


class Trigger(models.Model):
    class TriggerType(models.TextChoices):
        WEBHOOK = "WEBHOOK", "Webhook"
        SCHEDULE = "SCHEDULE", "Schedule"
        EVENT = "EVENT", "Event"
        MANUAL = "MANUAL", "Manual"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    workflow = models.OneToOneField(
        Workflow,
        on_delete=models.CASCADE,
        related_name="trigger",
    )

    trigger_type = models.CharField(
        max_length=20,
        choices=TriggerType.choices,
    )

    configuration = models.JSONField(default=dict)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.workflow.name} - {self.trigger_type}"