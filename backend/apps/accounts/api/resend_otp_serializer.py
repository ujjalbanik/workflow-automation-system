from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class ResendOTPSerializer(serializers.Serializer):

    email = serializers.EmailField()

    def validate_email(self, value):

        if not User.objects.filter(email=value).exists():

            raise serializers.ValidationError(
                "User not found."
            )

        return value