"""
Attendance schemas for Pydantic validation.
Defines request/response models for attendance endpoints.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class AttendanceBase(BaseModel):
    """Base schema with common attendance attributes."""

    status: str  # "time-in" or "time-out"


class AttendanceCreate(AttendanceBase):
    """Schema for creating an attendance record via scan."""

    qr_token: str

    class Config:
        json_schema_extra = {
            "example": {
                "qr_token": "user123-token-abc",
                "status": "time-in",
            }
        }


class AttendanceResponse(AttendanceBase):
    """Schema for attendance response data."""

    id: int
    user_id: int
    session_id: Optional[int] = None
    timestamp: datetime
    qr_token: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AttendanceReport(BaseModel):
    """Schema for attendance report filtering."""

    user_id: Optional[int] = None
    session_id: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": 1,
                "start_date": "2024-01-01T00:00:00",
                "end_date": "2024-01-31T23:59:59",
                "status": "time-in",
            }
        }