from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.workflows.api.viewsets import WorkflowViewSet

router = DefaultRouter()
router.register(r"workflows", WorkflowViewSet, basename="workflow")

urlpatterns = [
    path("auth/", include("apps.accounts.api.urls")),
    path("", include(router.urls)),
]