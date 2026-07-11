from django.urls import path

from apps.executions.api.views import WorkflowExecutionListAPIView

urlpatterns = [
    path(
        "",
        WorkflowExecutionListAPIView.as_view(),
        name="execution-list",
    ),
]