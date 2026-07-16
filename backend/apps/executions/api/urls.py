from django.urls import path

from apps.executions.api.views import (
    WorkflowExecutionListAPIView,
    WorkflowExecutionDetailAPIView,
)

urlpatterns = [
    path(
        "",
        WorkflowExecutionListAPIView.as_view(),
        name="execution-list",
    ),

    path(
        "<uuid:pk>/",
        WorkflowExecutionDetailAPIView.as_view(),
        name="execution-detail",
    ),
]