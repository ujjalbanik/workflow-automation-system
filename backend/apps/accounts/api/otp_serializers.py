from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.accounts.models_otp import EmailOTP

User = get_user_model()


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, attrs):

        email = attrs["email"]
        otp = attrs["otp"]

        try:
            user = User.objects.get(email=email)

        except User.DoesNotExist:
            raise serializers.ValidationError(
                "User not found."
            )

        try:
            otp_obj = EmailOTP.objects.filter(
                user=user,
                otp=otp,
                is_used=False,
            ).latest("created_at")

        except EmailOTP.DoesNotExist:
            raise serializers.ValidationError(
                "Invalid OTP."
            )

        if otp_obj.is_expired():
            raise serializers.ValidationError(
                "OTP expired."
            )

        attrs["user"] = user
        attrs["otp_obj"] = otp_obj

        return attrs