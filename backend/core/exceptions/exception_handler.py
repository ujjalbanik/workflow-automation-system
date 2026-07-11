from rest_framework.views import exception_handler

from core.responses.api_response import ApiResponse


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return None

    return ApiResponse.error(
        errors=response.data,
        message="Request failed.",
        status_code=response.status_code,
    )