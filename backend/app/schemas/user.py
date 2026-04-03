"""
User schemas for Pydantic validation.
Defines request/response models for user management endpoints.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    """Base schema with common user attributes."""

    name: str
    email: EmailStr
    role: Optional[str] = "student"


class UserCreate(UserBase):
    """Schema for creating a new user (admin only)."""

    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "password": "securepassword123",
                "role": "student",
            }
        }


class UserUpdate(BaseModel):
    """Schema for updating user information."""

    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Updated",
                "is_active": True,
            }
        }


class UserResponse(UserBase):
    """Schema for user response data."""

    id: int
    is_active: bool
    qr_code_token: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True