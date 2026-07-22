from typing import Any, Optional
from fastapi.responses import JSONResponse
from fastapi import status

def api_response(
    status_code: int = status.HTTP_200_OK,
    message: str = "Success",
    data: Optional[Any] = None,
    success: bool = True
) -> JSONResponse:
    """
    Standardized API response helper.
    Returns:
        JSONResponse: {
            "success": bool,
            "status_code": int,
            "message": str,
            "data": Any
        }
    """
    content = {
        "success": success,
        "status_code": status_code,
        "message": message,
        "data": data
    }
    return JSONResponse(status_code=status_code, content=content)

def error_response(
    status_code: int = status.HTTP_400_BAD_REQUEST,
    message: str = "An error occurred",
    data: Optional[Any] = None
) -> JSONResponse:
    """
    Standardized API error response helper.
    """
    return api_response(
        status_code=status_code,
        message=message,
        data=data,
        success=False
    )
