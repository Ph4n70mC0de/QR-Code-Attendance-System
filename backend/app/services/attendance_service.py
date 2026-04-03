"""
Attendance service module.
Handles attendance logging, validation, and reporting.
"""

from datetime import datetime, date, time
from typing import List, Optional

from sqlalchemy import and_, func
from sqlalchemy.orm import Session

from ..models.attendance import Attendance
from ..models.session import Session as SessionModel
from ..models.user import User
from ..schemas.attendance import AttendanceReport


class AttendanceService:
    """Service class for attendance operations."""

    def __init__(self, db: Session):
        """
        Initialize AttendanceService.

        Args:
            db: SQLAlchemy database session.
        """
        self.db = db

    def record_attendance(
        self,
        user: User,
        status: str,
        qr_token: str,
        session_id: Optional[int] = None
    ) -> Optional[Attendance]:
        """
        Record an attendance entry for a user.

        Args:
            user: The User object.
            status: "time-in" or "time-out".
            qr_token: The QR token that was scanned.
            session_id: Optional session ID to associate with.

        Returns:
            The created Attendance record, or None if duplicate.

        Raises:
            ValueError: If business rules are violated.
        """
        today = date.utcnow()

        # Check for existing time-in today
        existing_time_in = (
            self.db.query(Attendance)
            .filter(
                and_(
                    Attendance.user_id == user.id,
                    func.date(Attendance.timestamp) == today,
                    Attendance.status == "time-in",
                )
            )
            .first()
        )

        if status == "time-in":
            # Prevent duplicate time-in on same day
            if existing_time_in:
                raise ValueError("Time-in already recorded for today")
        else:  # time-out
            # Must have time-in before time-out
            if not existing_time_in:
                raise ValueError("No time-in record found for today")

            # Check if time-out already recorded
            existing_time_out = (
                self.db.query(Attendance)
                .filter(
                    and_(
                        Attendance.user_id == user.id,
                        func.date(Attendance.timestamp) == today,
                        Attendance.status == "time-out",
                    )
                )
                .first()
            )
            if existing_time_out:
                raise ValueError("Time-out already recorded for today")

        # If session_id provided, validate session exists and is active
        if session_id:
            session = (
                self.db.query(SessionModel)
                .filter(SessionModel.id == session_id)
                .first()
            )
            if not session:
                raise ValueError("Session not found")
            if not session.is_active:
                raise ValueError("Session is not active")

        # Create attendance record
        attendance = Attendance(
            user_id=user.id,
            session_id=session_id,
            status=status,
            qr_token=qr_token,
            timestamp=datetime.utcnow(),
        )
        self.db.add(attendance)
        self.db.commit()
        self.db.refresh(attendance)
        return attendance

    def get_attendance_by_user(
        self, 
        user_id: int, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Attendance]:
        """
        Get attendance records for a specific user.

        Args:
            user_id: The user's ID.
            skip: Number of records to skip.
            limit: Maximum records to return.

        Returns:
            List of Attendance records.
        """
        return (
            self.db.query(Attendance)
            .filter(Attendance.user_id == user_id)
            .order_by(Attendance.timestamp.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_attendance_report(
        self, 
        filters: AttendanceReport,
        skip: int = 0,
        limit: int = 100
    ) -> List[Attendance]:
        """
        Get attendance records based on filter criteria.

        Args:
            filters: AttendanceReport schema with filter options.
            skip: Number of records to skip.
            limit: Maximum records to return.

        Returns:
            List of Attendance records matching filters.
        """
        query = self.db.query(Attendance)

        if filters.user_id:
            query = query.filter(Attendance.user_id == filters.user_id)
        if filters.session_id:
            query = query.filter(Attendance.session_id == filters.session_id)
        if filters.start_date:
            query = query.filter(Attendance.timestamp >= filters.start_date)
        if filters.end_date:
            query = query.filter(Attendance.timestamp <= filters.end_date)
        if filters.status:
            query = query.filter(Attendance.status == filters.status)

        return (
            query.order_by(Attendance.timestamp.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_daily_attendance(
        self, 
        target_date: Optional[date] = None
    ) -> List[Attendance]:
        """
        Get all attendance records for a specific date.

        Args:
            target_date: The date to query (defaults to today).

        Returns:
            List of Attendance records for the date.
        """
        if target_date is None:
            target_date = date.utcnow()

        return (
            self.db.query(Attendance)
            .filter(func.date(Attendance.timestamp) == target_date)
            .order_by(Attendance.timestamp)
            .all()
        )

    def get_user_attendance_summary(
        self, 
        user_id: int,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> dict:
        """
        Get attendance summary for a user.

        Args:
            user_id: The user's ID.
            start_date: Start date for the summary period.
            end_date: End date for the summary period.

        Returns:
            Dictionary with attendance statistics.
        """
        query = self.db.query(Attendance).filter(Attendance.user_id == user_id)

        if start_date:
            query = query.filter(func.date(Attendance.timestamp) >= start_date)
        if end_date:
            query = query.filter(func.date(Attendance.timestamp) <= end_date)

        records = query.all()

        time_ins = [r for r in records if r.status == "time-in"]
        time_outs = [r for r in records if r.status == "time-out"]

        return {
            "user_id": user_id,
            "total_time_ins": len(time_ins),
            "total_time_outs": len(time_outs),
            "total_records": len(records),
            "period": {
                "start": start_date.isoformat() if start_date else None,
                "end": end_date.isoformat() if end_date else None,
            },
        }

    def get_session_attendance(
        self, 
        session_id: int
    ) -> List[Attendance]:
        """
        Get all attendance records for a session.

        Args:
            session_id: The session's ID.

        Returns:
            List of Attendance records for the session.
        """
        return (
            self.db.query(Attendance)
            .filter(Attendance.session_id == session_id)
            .order_by(Attendance.timestamp)
            .all()
        )