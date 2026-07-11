from django.urls import include, path
from rest_framework.routers import DefaultRouter
from apps.workflows.api.workflow_step_viewsets import WorkflowStepViewSet
from django.urls import include, path


workflow_step_list = WorkflowStepViewSet.as_view({
    "get": "list",
    "post": "create",
})

workflow_step_detail = WorkflowStepViewSet.as_view({
    "get": "retrieve",
    "patch": "partial_update",
    "delete": "destroy",
})


from apps.workflows.api.viewsets import WorkflowViewSet

router = DefaultRouter()
router.register(r"workflows", WorkflowViewSet, basename="workflow")

urlpatterns = [
    path("auth/", include("apps.accounts.api.urls")),

    path(
        "workflows/<uuid:workflow_id>/steps/",
        workflow_step_list,
        name="workflow-steps",
    ),

    path(
        "workflows/<uuid:workflow_id>/steps/<uuid:pk>/",
        workflow_step_detail,
        name="workflow-step-detail",
    ),
    
    path(
        "executions/",
        include("apps.executions.api.urls"),
    ),

    path("", include(router.urls)),
    
    path("dashboard/", include("apps.dashboard.urls")),
]