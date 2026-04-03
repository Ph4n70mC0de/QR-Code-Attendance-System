"""
Authentication schemas for Pydantic validation.
Defines request/response models for authentication endpoints.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserRegister(BaseModel):
    """Schema for user registration request."""

    email: EmailStr
    password: str
    name: str
    role: Optional[str] = "student"

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "securepassword123",
                "name": "John Doe",
                "role": "student",
            }
        }


class UserLogin(BaseModel):
    """Schema for user login request."""

    email: EmailStr
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "securepassword123",
            }
        }


class Token(BaseModel):
    """Schema for JWT token response."""

    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Schema for decoded token data."""

    email: Optional[str] = None
    user_id: Optional[int] = None
    exp: Optional[datetime] = None