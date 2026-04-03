"""
Attendance database model.
Defines the Attendance table structure and relationships.
"""

from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from ..core.database import Base


class Attendance(Base):
    """
    Attendance model representing the attendance table.
    
    Attributes:
        id: Primary key identifier.
        user_id: Foreign key reference to the user.
        session_id: Optional foreign key reference to a session.
        timestamp: Time of the attendance record.
        status: Type of attendance (time-in or time-out).
        qr_token: The QR token that was scanned.
        created_at: Timestamp of record creation.
    """

    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    status = Column(
        Enum("time-in", "time-out", name="attendance_status"),
        nullable=False,
        default="time-in"
    )
    qr_token = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="attendance_records")
    session = relationship("Session", back_populates="attendance_records")