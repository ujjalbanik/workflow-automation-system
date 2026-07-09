from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.accounts.api.serializers import ProfileSerializer
from apps.accounts.api.serializers import RegisterSerializer


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

class LoginSerializer(TokenObtainPairSerializer):
    pass

class LoginAPIView(TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]
    
class ProfileAPIView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
