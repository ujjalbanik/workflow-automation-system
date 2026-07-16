from django.urls import path

from apps.accounts.api.views import (
    LoginAPIView,
    ProfileAPIView,
    RegisterAPIView,
    VerifyOTPAPIView,
    ResendOTPAPIView
)

urlpatterns = [
    path(
        "register/",
        RegisterAPIView.as_view(),
    ),

    path(
        "verify-otp/",
        VerifyOTPAPIView.as_view(),
    ),

    path(
        "login/",
        LoginAPIView.as_view(),
    ),

    path(
        "profile/",
        ProfileAPIView.as_view(),
    ),
    
    path(
    "resend-otp/",
    ResendOTPAPIView.as_view(),
    ),
]