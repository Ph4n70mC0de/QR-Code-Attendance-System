"""
QR Code API routes.
Handles QR code generation and validation.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..schemas.qr import QRCodeResponse
from ..services.qr_service import QRService
from .auth import get_current_user

router = APIRouter(prefix="/qr", tags=["QR Code"])


@router.get("/my-qr", response_model=QRCodeResponse)
def get_my_qr_code(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Generate a QR code for the current user.
    
    Returns a time-limited QR code that can be used for attendance.
    
    Args:
        db: Database session.
        current_user: Current authenticated user.
        
    Returns:
        QR code data including base64 image and token.
    """
    qr_service = QRService(db)
    qr_data = qr_service.generate_qr_image(current_user)
    return qr_data


@router.get("/user/{user_id}", response_model=QRCodeResponse)
def get_user_qr_code(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Generate a QR code for a specific user.
    
    Typically used by admins or instructors to generate QR codes for students.
    
    Args:
        user_id: The user's ID.
        db: Database session.
        current_user: Current authenticated user.
        
    Returns:
        QR code data including base64 image and token.
        
    Raises:
        HTTPException: If user not found.
    """
    # Get the user
    from ..services.user_service import UserService
    
    user_service = UserService(db)
    user = user_service.get_user(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Generate QR code
    qr_service = QRService(db)
    qr_data = qr_service.generate_qr_image(user)
    return qr_data


@router.post("/validate")
def validate_qr_code(
    token: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Validate a QR code token.
    
    Used to verify a QR code before recording attendance.
    
    Args:
        token: The QR code token to validate.
        db: Database session.
        current_user: Current authenticated user.
        
    Returns:
        Validation result with user info if valid.
    """
    qr_service = QRService(db)
    is_valid, user, error_message = qr_service.validate_qr_token(token)
    
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_message,
        )
    
    return {
        "valid": True,
        "user_id": user.id,
        "user_name": user.name,
        "user_email": user.email,
    }


@router.post("/refresh")
def refresh_qr_code(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Refresh the current user's QR code token.
    
    This invalidates any existing QR codes for the user.
    
    Args:
        db: Database session.
        current_user: Current authenticated user.
        
    Returns:
        Confirmation message.
    """
    qr_service = QRService(db)
    new_token = qr_service.refresh_qr_token(current_user)
    
    return {
        "message": "QR code token refreshed",
        "new_token": new_token,
    }