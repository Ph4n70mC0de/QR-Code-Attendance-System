"""
Attendance API routes.
Handles attendance scanning, logging, and reporting.
"""

from datetime import date, datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..schemas.attendance import AttendanceCreate, AttendanceReport, AttendanceResponse
from ..services.attendance_service import AttendanceService
from ..services.qr_service import QRService
from .auth import get_current_user

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("/scan", response_model=AttendanceResponse)
def scan_attendance(
    attendance_data: AttendanceCreate,
    session_id: Optional[int] = Query(None, description="Optional session ID"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Record attendance by scanning a QR code.
    
    The QR token should be obtained from the QR code image.
    
    Args:
        attendance_data: Attendance data including QR token and status.
        session_id: Optional session ID to associate with.
        db: Database session.
        current_user: Current authenticated user.
        
    Returns:
        The created attendance record.
        
    Raises:
        HTTPException: If QR token is invalid or business rules violated.
    """
    # Validate QR token
    qr_service = QRService(db)
    is_valid, qr_user, error_message = qr_service.validate_qr_token(attendance_data.qr_token)
    
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid QR code: {error_message}",
        )
    
    # Record attendance
    attendance_service = AttendanceService(db)
    try:
        attendance = attendance_service.record_attendance(
            user=qr_user,
            status=attendance_data.status,
            qr_token=attendance_data.qr_token,
            session_id=session_id,
        )
        return attendance
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get("/", response_model=List[AttendanceResponse])
def get_attendance(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get attendance records.
    
    For regular users, returns their own attendance.
    For admins/instructors, returns all attendance records.
    
    Args:
        skip: Number of records to skip.
        limit: Maximum records to return.
        db: Database session.
        current_user: Current authenticated user.
        
    Returns:
        List of attendance records.
    """
    attendance_service = AttendanceService(db)
    
    # Check user role for access control
    if current_user.role in ["admin", "instructor"]:
        # Return all attendance records
        return attendance_service.get_attendance_report(
            AttendanceReport(), skip=skip, limit=limit
        )
    else:
        # Return only own attendance
        return attendance_service.get_attendance_by_user(
            current_user.id, skip=skip, limit=limit
        )


@router.get("/my-attendance", response_model=List[AttendanceResponse])
def get_my_attendance(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get current user's own attendance records.
    
    Args:
        skip: Number of records to skip.
        limit: Maximum records to return.
        db: Database session.
        current_user: Current authenticated user.
        
    Returns:
        List of user's attendance records.
    """
    attendance_service = AttendanceService(db)
    return attendance_service.get_attendance_by_user(
        current_user.id, skip=skip, limit=limit
    )


@router.get("/report")
def get_attendance_report(
    user_id: Optional[int] = Query(None),
    session_id: Optional[int] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    status: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get attendance report with filtering options.
    
    Available to admins and instructors only.
    
    Args:
        user_id: Filter by user ID.
        session_id: Filter by session ID.
        start_date: Filter by start date.
        end_date: Filter by end date.
        status: Filter by status (time-in or time-out).
        skip: Number of records to skip.
        limit: Maximum records to return.
        db: Database session.
        current_user: Current authenticated user.
        
    Returns:
        Filtered attendance records.
        
    Raises:
        HTTPException: If user is not authorized.
    """
    # Check authorization
    if current_user.role not in ["admin", "instructor"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view reports",
        )
    
    # Build filter
    filters = AttendanceReport(
        user_id=user_id,
        session_id=session_id,
        start_date=start_date,
        end_date=end_date,
        status=status,
    )
    
    attendance_service = AttendanceService(db)
    return attendance_service.get_attendance_report(filters, skip=skip, limit=limit)


@router.get("/daily")
def get_daily_attendance(
    target_date: Optional[date] = Query(None, description="Date in YYYY-MM-DD format"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get all attendance records for a specific date.
    
    Available to admins and instructors only.
    
    Args:
        target_date: The date to query (defaults to today).
        db: Database session.
        current_user: Current authenticated user.
        
    Returns:
        Attendance records for the date.
        
    Raises:
        HTTPException: If user is not authorized.
    """
    # Check authorization
    if current_user.role not in ["admin", "instructor"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view daily attendance",
        )
    
    attendance_service = AttendanceService(db)
    return attendance_service.get_daily_attendance(target_date)


@router.get("/summary")
def get_attendance_summary(
    user_id: Optional[int] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get attendance summary statistics.
    
    If no user_id provided, returns summary for current user.
    
    Args:
        user_id: User ID for summary (optional).
        start_date: Start date for period.
        end_date: End date for period.
        db: Database session.
        current_user: Current authenticated user.
        
    Returns:
        Attendance summary statistics.
    """
    # Use current user's ID if not specified
    target_user_id = user_id or current_user.id
    
    # Check authorization for viewing other users
    if user_id and current_user.role not in ["admin", "instructor"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view other users' summaries",
        )
    
    attendance_service = AttendanceService(db)
    return attendance_service.get_user_attendance_summary(
        target_user_id, start_date=start_date, end_date=end_date
    )