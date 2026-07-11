from django.conf import settings
from django.core.mail import send_mail


class EmailExecutor:
    @staticmethod
    def execute(step):
        config = step.configuration

        send_mail(
            subject=config.get("subject", "Workflow Email"),
            message=config.get("message", ""),
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[config.get("to")],
            fail_silently=False,
        )