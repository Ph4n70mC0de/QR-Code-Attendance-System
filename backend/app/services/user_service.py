"""
User service module.
Handles user CRUD operations and management.
"""

import uuid
from typing import List, Optional

from sqlalchemy.orm import Session

from ..core.security import get_password_hash
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate


class UserService:
    """Service class for user operations."""

    def __init__(self, db: Session):
        """
        Initialize UserService.

        Args:
            db: SQLAlchemy database session.
        """
        self.db = db

    def get_user(self, user_id: int) -> Optional[User]:
        """
        Get a user by ID.

        Args:
            user_id: The user's unique identifier.

        Returns:
            The User if found, None otherwise.
        """
        return self.db.query(User).filter(User.id == user_id).first()

    def get_user_by_email(self, email: str) -> Optional[User]:
        """
        Get a user by email.

        Args:
            email: The user's email address.

        Returns:
            The User if found, None otherwise.
        """
        return self.db.query(User).filter(User.email == email).first()

    def get_users(
        self, 
        skip: int = 0, 
        limit: int = 100,
        role: Optional[str] = None,
        is_active: Optional[bool] = None
    ) -> List[User]:
        """
        Get a list of users with optional filtering.

        Args:
            skip: Number of records to skip (pagination).
            limit: Maximum number of records to return.
            role: Filter by user role.
            is_active: Filter by active status.

        Returns:
            List of User objects matching the criteria.
        """
        query = self.db.query(User)
        
        if role:
            query = query.filter(User.role == role)
        if is_active is not None:
            query = query.filter(User.is_active == is_active)
            
        return query.offset(skip).limit(limit).all()

    def create_user(self, user_data: UserCreate) -> User:
        """
        Create a new user.

        Args:
            user_data: User creation data.

        Returns:
            The created User object.

        Raises:
            ValueError: If email already exists.
        """
        # Check if email exists
        existing_user = self.db.query(User).filter(
            User.email == user_data.email
        ).first()
        if existing_user:
            raise ValueError("Email already registered")

        # Generate unique QR code token
        qr_token = str(uuid.uuid4())

        # Create user
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            name=user_data.name,
            email=user_data.email,
            password_hash=hashed_password,
            role=user_data.role or "student",
            qr_code_token=qr_token,
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def update_user(self, user_id: int, user_data: UserUpdate) -> Optional[User]:
        """
        Update a user's information.

        Args:
            user_id: The user's unique identifier.
            user_data: User update data.

        Returns:
            The updated User if found, None otherwise.

        Raises:
            ValueError: If updating email to one that already exists.
        """
        user = self.get_user(user_id)
        if not user:
            return None

        # Update fields
        update_data = user_data.model_dump(exclude_unset=True)
        
        # Check for email uniqueness if email is being updated
        if "email" in update_data and update_data["email"] != user.email:
            existing = self.db.query(User).filter(
                User.email == update_data["email"]
            ).first()
            if existing:
                raise ValueError("Email already in use")

        for field, value in update_data.items():
            setattr(user, field, value)

        self.db.commit()
        self.db.refresh(user)
        return user

    def delete_user(self, user_id: int) -> bool:
        """
        Delete a user.

        Args:
            user_id: The user's unique identifier.

        Returns:
            True if user was deleted, False if user not found.
        """
        user = self.get_user(user_id)
        if not user:
            return False

        self.db.delete(user)
        self.db.commit()
        return True

    def generate_qr_token(self, user_id: int) -> Optional[str]:
        """
        Generate a new QR code token for a user.

        Args:
            user_id: The user's unique identifier.

        Returns:
            The new QR token if user found, None otherwise.
        """
        user = self.get_user(user_id)
        if not user:
            return None

        new_token = str(uuid.uuid4())
        user.qr_code_token = new_token
        self.db.commit()
        return new_token