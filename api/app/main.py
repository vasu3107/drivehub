from fastapi import FastAPI, Request, HTTPException, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.api import auth, vehicles, inventory
from app.core.response import error_response, api_response

# Create DB tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Exception Handlers for Standardized API Error Envelopes
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return error_response(
        status_code=exc.status_code,
        message=str(exc.detail) if exc.detail else "HTTP Exception occurred"
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_msg = errors[0].get("msg", "Validation error") if errors else "Invalid request format"
    return error_response(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        message=f"Validation Error: {first_msg}",
        data=errors
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return error_response(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        message=f"Internal Server Error: {str(exc)}"
    )

# Include API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(vehicles.router, prefix=settings.API_V1_STR)
app.include_router(inventory.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return api_response(
        status_code=200,
        message="Welcome to DriveHub Car Dealership Inventory System API",
        data={
            "status": "online",
            "docs": "/docs",
            "version": "1.0.0"
        }
    )
