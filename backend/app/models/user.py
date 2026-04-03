"""
User database model.
Defines the User table structure and relationships.
"""

from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text
from sqlalchemy.orm import relationship

from ..core.database import Base


class User(Base):
    """
    User model representing the users table.
    
    Attributes:
        id: Primary key identifier.
        name: User's full name.
        email: Unique email address used for login.
        password_hash: Bcrypt hashed password.
        role: User role (admin, instructor, student).
        qr_code_token: Unique token for QR code generation.
        is_active: Whether the user account is active.
        created_at: Timestamp of account creation.
        updated_at: Timestamp of last update.
    """

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(
        String(20), 
        nullable=False, 
        default="student",
        comment="User role: admin, instructor, student"
    )
    qr_code_token = Column(String(255), unique=True, index=True, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    attendance_records = relationship("Attendance", back_populates="user")