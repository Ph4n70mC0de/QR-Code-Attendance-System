"""
QR Code service module.
Handles QR code generation and validation.
"""

import base64
import io
from datetime import datetime, timedelta
from typing import Optional, Tuple

import qrcode
from sqlalchemy.orm import Session

from ..core.config import settings
from ..core.security import create_access_token, decode_access_token
from ..models.user import User


class QRService:
    """Service class for QR code operations."""

    def __init__(self, db: Session):
        """
        Initialize QRService.

        Args:
            db: SQLAlchemy database session.
        """
        self.db = db

    def generate_qr_token(self, user: User) -> Tuple[str, datetime]:
        """
        Generate a time-limited QR code token for a user.

        Args:
            user: The User object to generate token for.

        Returns:
            Tuple of (token string, expiration datetime).
        """
        # Create token with short expiration for security
        expires_delta = timedelta(minutes=settings.QR_CODE_EXPIRY_MINUTES)
        token_data = {
            "user_id": user.id,
            "qr_token": user.qr_code_token,
            "type": "qr_code",
        }
        token = create_access_token(data=token_data, expires_delta=expires_delta)
        expiration = datetime.utcnow() + expires_delta
        return token, expiration

    def generate_qr_image(self, user: User) -> dict:
        """
        Generate a QR code image for a user.

        Args:
            user: The User object to generate QR code for.

        Returns:
            Dictionary containing token, base64 image, and expiration info.
        """
        # Generate token
        token, expiration = self.generate_qr_token(user)

        # Generate QR code image
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(token)
        qr.make(fit=True)

        # Create image
        img = qr.make_image(fill_color="black", back_color="white")

        # Convert to base64
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode()

        return {
            "user_id": user.id,
            "token": token,
            "qr_code_data": f"data:image/png;base64,{img_base64}",
            "expires_in": settings.QR_CODE_EXPIRY_MINUTES * 60,
            "expiration": expiration.isoformat(),
        }

    def validate_qr_token(self, token: str) -> Tuple[bool, Optional[User], str]:
        """
        Validate a QR code token.

        Args:
            token: The QR token string to validate.

        Returns:
            Tuple of (is_valid, User object or None, error message).
        """
        # Decode token
        payload = decode_access_token(token)
        
        if not payload:
            return False, None, "Invalid or expired token"

        # Check token type
        if payload.get("type") != "qr_code":
            return False, None, "Invalid token type"

        # Get user
        user_id = payload.get("user_id")
        if not user_id:
            return False, None, "No user ID in token"

        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return False, None, "User not found"

        # Check if user is active
        if not user.is_active:
            return False, None, "User account is inactive"

        # Verify QR token matches
        if payload.get("qr_token") != user.qr_code_token:
            return False, None, "Token mismatch - QR code may have been regenerated"

        return True, user, ""

    def refresh_qr_token(self, user: User) -> Optional[str]:
        """
        Refresh a user's QR code token (invalidate old one).

        Args:
            user: The User object to refresh token for.

        Returns:
            The new QR token string, or None if user not found.
        """
        import uuid
        
        if not user:
            return None

        # Generate new unique token
        new_token = str(uuid.uuid4())
        user.qr_code_token = new_token
        self.db.commit()
        self.db.refresh(user)
        
        return new_token