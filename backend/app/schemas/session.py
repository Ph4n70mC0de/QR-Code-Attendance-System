"""
Session schemas for Pydantic validation.
Defines request/response models for session endpoints.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class SessionBase(BaseModel):
    """Base schema with common session attributes."""

    name: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime


class SessionCreate(SessionBase):
    """Schema for creating a new session."""

    class Config:
        json_schema_extra = {
            "example": {
                "name": "CS101 Lecture",
                "description": "Introduction to Computer Science",
                "start_time": "2024-01-15T09:00:00",
                "end_time": "2024-01-15T10:30:00",
            }
        }


class SessionUpdate(BaseModel):
    """Schema for updating a session."""

    name: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    is_active: Optional[bool] = None

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Updated Session Name",
                "is_active": False,
            }
        }


class SessionResponse(SessionBase):
    """Schema for session response data."""

    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True