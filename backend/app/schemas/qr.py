"""
QR Code schemas for Pydantic validation.
Defines request/response models for QR code endpoints.
"""

from pydantic import BaseModel


class QRCodeResponse(BaseModel):
    """Schema for QR code response data."""

    user_id: int
    qr_code_data: str  # Base64 encoded image or token
    token: str
    expires_in: int  # Seconds until expiration

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": 1,
                "qr_code_data": "data:image/png;base64,iVBOR...",
                "token": "user123-token-abc",
                "expires_in": 300,
            }
        }


class QRCodeValidateRequest(BaseModel):
    """Schema for QR code validation request."""

    token: str

    class Config:
        json_schema_extra = {
            "example": {
                "token": "user123-token-abc",
            }
        }