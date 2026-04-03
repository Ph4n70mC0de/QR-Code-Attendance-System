"""
Application configuration module.
Loads environment variables and provides typed configuration settings.
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import secrets


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "QR Code Attendance System"
    APP_DEBUG: bool = False
    APP_ENV: str = "development"  # development, staging, production
    
    # Override env_file to ensure .env is loaded first
    model_config = {'env_file': '.env', 'extra': 'ignore'}

    # Security
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    MAX_LOGIN_ATTEMPTS: int = 5
    LOCKOUT_DURATION_MINUTES: int = 15
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_AUTH_PER_MINUTE: int = 10
    
    # Password Policy
    MIN_PASSWORD_LENGTH: int = 8
    REQUIRE_PASSWORD_SPECIAL: bool = True
    REQUIRE_PASSWORD_NUMBER: bool = True
    REQUIRE_PASSWORD_UPPERCASE: bool = True

    # Database
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_NAME: str = "qr_attendance"
    DB_USER: str = "root"
    DB_PASSWORD: str = ""
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10
    DB_POOL_TIMEOUT: int = 30
    DB_ECHO: bool = False  # Set to True for SQL debugging (development only)

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["GET", "POST", "PUT", "DELETE", "PATCH"]
    CORS_ALLOW_HEADERS: List[str] = ["Authorization", "Content-Type"]

    # QR Code
    QR_CODE_EXPIRY_MINUTES: int = 5
    QR_CODE_SIZE: int = 256

    # File Upload
    MAX_UPLOAD_SIZE_MB: int = 10
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(levelname)s: %(message)s"

    @property
    def DATABASE_URL(self) -> str:
        """Construct MySQL database URL from settings."""
        return (
            f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )
    
    @property
    def DATABASE_URL_ASYNC(self) -> str:
        """Construct async MySQL database URL from settings."""
        return self.DATABASE_URL.replace("pymysql", "aiomysql")
    
    def validate_secret_key(self) -> None:
        """Validate that SECRET_KEY is properly set for production."""
        if self.APP_ENV == "production" and self.SECRET_KEY == "your-super-secret-key-change-this-in-production":
            raise ValueError(
                "SECRET_KEY must be changed in production! "
                "Generate a secure key using: python -c \"import secrets; print(secrets.token_urlsafe(32))\""
            )
    
    def generate_secure_key(self) -> str:
        """Generate a cryptographically secure random key."""
        return secrets.token_urlsafe(32)


# Global settings instance
settings = Settings()

# Validate settings on import (only in production)
if settings.APP_ENV == "production":
    settings.validate_secret_key()