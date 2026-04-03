"""
Security module for authentication and password hashing.
Handles JWT token creation/validation and password hashing.
Enhanced with password policy validation and security features.
"""

import re
import secrets
import string
from datetime import datetime, timedelta
from typing import Optional, Tuple

from jose import JWTError, jwt
from passlib.context import CryptContext

from .config import settings

# Password hashing context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.

    Args:
        plain_password: The plain text password to verify.
        hashed_password: The hashed password to compare against.

    Returns:
        True if the passwords match, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hash a plain text password using bcrypt.

    Args:
        password: The plain text password to hash.

    Returns:
        The hashed password string.
    """
    return pwd_context.hash(password)


def validate_password(password: str) -> Tuple[bool, str]:
    """
    Validate password strength according to security policy.

    Args:
        password: The password to validate.

    Returns:
        Tuple of (is_valid, error_message)
    """
    if len(password) < settings.MIN_PASSWORD_LENGTH:
        return False, f"Password must be at least {settings.MIN_PASSWORD_LENGTH} characters long"
    
    if settings.REQUIRE_PASSWORD_NUMBER and not re.search(r"\d", password):
        return False, "Password must contain at least one number"
    
    if settings.REQUIRE_PASSWORD_SPECIAL and not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Password must contain at least one special character"
    
    if settings.REQUIRE_PASSWORD_UPPERCASE and not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    
    # Check for common weak passwords
    weak_passwords = ["password", "123456", "qwerty", "abc123", "letmein"]
    if password.lower() in weak_passwords:
        return False, "Password is too common. Please choose a stronger password"
    
    return True, ""


def generate_secure_token(length: int = 32) -> str:
    """
    Generate a cryptographically secure random token.

    Args:
        length: Length of the token in bytes.

    Returns:
        URL-safe base64-encoded token string.
    """
    return secrets.token_urlsafe(length)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.

    Args:
        data: The data to encode in the token (typically contains user info).
        expires_delta: Optional custom expiration time. If not provided,
                      uses ACCESS_TOKEN_EXPIRE_MINUTES from settings.

    Returns:
        The encoded JWT token string.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    """
    Create a JWT refresh token with longer expiration.

    Args:
        data: The data to encode in the token.

    Returns:
        The encoded refresh token string.
    """
    expires_delta = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = data.copy()
    to_encode.update({"exp": datetime.utcnow() + expires_delta})
    to_encode.update({"type": "refresh"})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode and validate a JWT access token.

    Args:
        token: The JWT token string to decode.

    Returns:
        The decoded payload as a dictionary if valid, None otherwise.
    """
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        # Check if token is a refresh token (shouldn't be used as access token)
        if payload.get("type") == "refresh":
            return None
        return payload
    except JWTError:
        return None


def decode_refresh_token(token: str) -> Optional[dict]:
    """
    Decode and validate a JWT refresh token.

    Args:
        token: The JWT token string to decode.

    Returns:
        The decoded payload as a dictionary if valid, None otherwise.
    """
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        # Verify it's actually a refresh token
        if payload.get("type") != "refresh":
            return None
        return payload
    except JWTError:
        return None


def sanitize_input(text: str, max_length: int = 1000) -> str:
    """
    Sanitize user input to prevent XSS and injection attacks.

    Args:
        text: The input text to sanitize.
        max_length: Maximum allowed length.

    Returns:
        Sanitized text string.
    """
    if not isinstance(text, str):
        return ""
    
    # Truncate to max length
    text = text[:max_length]
    
    # Remove potentially dangerous characters
    dangerous_patterns = [
        r'<script.*?</script>',  # Script tags
        r'javascript:',          # JavaScript protocol
        r'on\w+\s*=',            # Event handlers
        r'<iframe.*?</iframe>',  # Iframe tags
    ]
    
    for pattern in dangerous_patterns:
        text = re.sub(pattern, '', text, flags=re.IGNORECASE | re.DOTALL)
    
    return text.strip()


def generate_csrf_token() -> str:
    """
    Generate a CSRF token for form protection.

    Returns:
        A cryptographically secure CSRF token.
    """
    return secrets.token_hex(32)


def validate_csrf_token(token: str, expected_token: str) -> bool:
    """
    Validate a CSRF token using constant-time comparison.

    Args:
        token: The token to validate.
        expected_token: The expected token value.

    Returns:
        True if tokens match, False otherwise.
    """
    if not token or not expected_token:
        return False
    return secrets.compare_digest(token, expected_token)