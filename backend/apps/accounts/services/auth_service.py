from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils import timezone
from django.conf import settings

from apps.accounts.models_otp import EmailOTP

User = get_user_model()


class AuthService:

    @staticmethod
    def register_user(validated_data):

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            is_active=False,
        )

        EmailOTP.objects.filter(
            user=user,
            is_used=False,
        ).delete()

        otp = EmailOTP.generate()

        EmailOTP.objects.create(
            user=user,
            otp=otp,
            expires_at=timezone.now() + timedelta(minutes=10),
        )

        send_mail(
            subject="Verify your account",
            message=f"""
Hello {user.first_name or user.username},

Your verification code is:

{otp}

This code expires in 10 minutes.

Workflow Automation System
""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return user