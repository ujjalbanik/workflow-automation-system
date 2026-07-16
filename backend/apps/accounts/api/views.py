from rest_framework import generics, status, serializers
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.accounts.api.serializers import ProfileSerializer
from apps.accounts.api.serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from apps.accounts.api.otp_serializers import VerifyOTPSerializer

class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "message": "User registered successfully."
            },
            status=status.HTTP_201_CREATED,
        )

class VerifyOTPAPIView(generics.GenericAPIView):
    serializer_class = VerifyOTPSerializer
    permission_classes = [AllowAny]

    def post(self, request):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.validated_data["user"]
        otp_obj = serializer.validated_data["otp_obj"]

        otp_obj.is_used = True
        otp_obj.save()

        user.is_active = True
        user.save()

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Email verified.",

                "refresh": str(refresh),

                "access": str(refresh.access_token),
            }
        )

class LoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):

        if not user.is_active:

            raise serializers.ValidationError(
                "Email not verified. Please verify your email first."
            )

        return super().get_token(user)

    def validate(self, attrs):

        data = super().validate(attrs)

        if not self.user.is_active:

            raise serializers.ValidationError(
                "Email not verified. Please verify your email first."
            )

        return data

class LoginAPIView(TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]
    
class ProfileAPIView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    


from datetime import timedelta

from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings

from apps.accounts.models_otp import EmailOTP
from apps.accounts.api.resend_otp_serializer import ResendOTPSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class ResendOTPAPIView(generics.GenericAPIView):

    serializer_class = ResendOTPSerializer
    permission_classes = [AllowAny]

    def post(self, request):

        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        user = User.objects.get(
            email=serializer.validated_data["email"]
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
            "Verification Code",
            f"Your OTP is {otp}",
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

        return Response({

            "message":"OTP sent."

        })