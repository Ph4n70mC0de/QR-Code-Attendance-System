"""
Main FastAPI application entry point.
Configures the application, middleware, and routes.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import auth, users, qr, attendance
from .core.config import settings
from .core.database import init_db

# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description="""
## QR Code Attendance System API

A scalable backend API for managing attendance using QR codes.

### Features
* **User Authentication** - Register, login, and JWT token management
* **User Management** - CRUD operations for users
* **QR Code Generation** - Generate time-limited QR codes for attendance
* **Attendance Tracking** - Record and track attendance with time-in/time-out
* **Reporting** - Generate attendance reports and summaries

### Authentication
Most endpoints require authentication. Obtain a token from `/auth/login` and include it in the Authorization header:
```
Authorization: Bearer <token>
```
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(qr.router, prefix="/api/v1")
app.include_router(attendance.router, prefix="/api/v1")


@app.on_event("startup")
async def startup_event():
    """
    Application startup event handler.
    Initializes the database and creates tables if they don't exist.
    """
    init_db()
    print(f"[STARTUP] {settings.APP_NAME} started successfully!")


@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint with API information.
    """
    return {
        "name": settings.APP_NAME,
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint for monitoring.
    """
    return {"status": "healthy"}