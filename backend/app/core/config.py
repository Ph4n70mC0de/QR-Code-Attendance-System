"""
Application configuration module.
Loads environment variables and provides typed configuration settings.
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "QR Code Attendance System"
    APP_DEBUG: bool = False
    
    # Override env_file to ensure .env is loaded first
    model_config = {'env_file': '.env', 'extra': 'ignore'}

    # Security
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Database
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_NAME: str = "qr_attendance"
    DB_USER: str = "root"
    DB_PASSWORD: str = ""

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    # QR Code
    QR_CODE_EXPIRY_MINUTES: int = 5

    @property
    def DATABASE_URL(self) -> str:
        """Construct MySQL database URL from settings."""
        return (
            f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )


# Global settings instance
settings = Settings()