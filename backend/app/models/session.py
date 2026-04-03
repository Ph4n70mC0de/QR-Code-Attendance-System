"""
Session database model.
Defines the Session table structure for attendance sessions.
"""

from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text
from sqlalchemy.orm import relationship

from ..core.database import Base


class Session(Base):
    """
    Session model representing the sessions table.
    
    A session represents a class, meeting, or event where attendance is tracked.
    
    Attributes:
        id: Primary key identifier.
        name: Name of the session (e.g., "CS101 Lecture").
        description: Optional description of the session.
        start_time: When the session starts.
        end_time: When the session ends.
        is_active: Whether the session is currently active.
        created_at: Timestamp of session creation.
        updated_at: Timestamp of last update.
    """

    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    attendance_records = relationship("Attendance", back_populates="session")