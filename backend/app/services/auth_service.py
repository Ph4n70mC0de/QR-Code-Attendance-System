"""
Authentication service module.
Handles user registration, login, and token management.
"""

from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy.orm import Session

from ..core.security import create_access_token, get_password_hash, verify_password
from ..models.user import User
from ..schemas.auth import UserRegister


class AuthService:
    """Service class for authentication operations."""

    def __init__(self, db: Session):
        """
        Initialize AuthService.

        Args:
            db: SQLAlchemy database session.
        """
        self.db = db

    def register_user(self, user_data: UserRegister) -> User:
        """
        Register a new user.

        Args:
            user_data: User registration data.

        Returns:
            The created User object.

        Raises:
            ValueError: If email already exists.
        """
        # Check if user already exists
        existing_user = (
            self.db.query(User).filter(User.email == user_data.email).first()
        )
        if existing_user:
            raise ValueError("Email already registered")

        # Create new user
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            name=user_data.name,
            email=user_data.email,
            password_hash=hashed_password,
            role=user_data.role or "student",
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def authenticate_user(
        self, email: str, password: str
    ) -> Optional[User]:
        """
        Authenticate a user with email and password.

        Args:
            email: User's email address.
            password: User's plain text password.

        Returns:
            The authenticated User if credentials are valid, None otherwise.
        """
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            return None
        if not verify_password(password, user.password_hash):
            return None
        return user

    def create_token(self, user: User) -> str:
        """
        Create JWT access token for a user.

        Args:
            user: The authenticated User object.

        Returns:
            The encoded JWT token string.
        """
        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
        }
        return create_access_token(data=token_data)

    def login(self, email: str, password: str) -> Optional[str]:
        """
        Authenticate user and return access token.

        Args:
            email: User's email address.
            password: User's plain text password.

        Returns:
            JWT access token if authentication successful, None otherwise.
        """
        user = self.authenticate_user(email, password)
        if not user:
            return None
        return self.create_token(user)

    def get_user_by_email(self, email: str) -> Optional[User]:
        """
        Get user by email address.

        Args:
            email: User's email address.

        Returns:
            The User if found, None otherwise.
        """
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """
        Get user by ID.

        Args:
            user_id: User's unique identifier.

        Returns:
            The User if found, None otherwise.
        """
        return self.db.query(User).filter(User.id == user_id).first()