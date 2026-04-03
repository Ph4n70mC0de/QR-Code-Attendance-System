"""
User management API routes.
Handles CRUD operations for users.
"""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..schemas.user import UserCreate, UserResponse, UserUpdate
from ..services.user_service import UserService
from .auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=List[UserResponse])
def get_users(
    skip: int = 0,
    limit: int = 100,
    role: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get list of users with optional filtering.
    
    Requires authentication. Admin users can see all users.
    
    Args:
        skip: Number of records to skip.
        limit: Maximum records to return.
        role: Filter by role.
        is_active: Filter by active status.
        db: Database session.
        current_user: Current authenticated user.
        
    Returns:
        List of users matching criteria.
    """
    # Check if current user is admin (for now, allow all authenticated users)
    user_service = UserService(db)
    users = user_service.get_users(skip=skip, limit=limit, role=role, is_active=is_active)
    return users


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get a specific user by ID.
    
    Args:
        user_id: The user's ID.
        db: Database session.
        current_user: Current authenticated user.
        
    Returns:
        The user data.
        
    Raises:
        HTTPException: If user not found.
    """
    user_service = UserService(db)
    user = user_service.get_user(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    return user


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new user.
    
    Args:
        user_data: User creation data.
        db: Database session.
        current_user: Current authenticated user.
        
    Returns:
        The created user data.
        
    Raises:
        HTTPException: If email already exists.
    """
    user_service = UserService(db)
    try:
        user = user_service.create_user(user_data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update a user's information.
    
    Args:
        user_id: The user's ID.
        user_data: User update data.
        db: Database session.
        current_user: Current authenticated user.
        
    Returns:
        The updated user data.
        
    Raises:
        HTTPException: If user not found or email already in use.
    """
    user_service = UserService(db)
    try:
        user = user_service.update_user(user_id, user_data)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Delete a user.
    
    Args:
        user_id: The user's ID.
        db: Database session.
        current_user: Current authenticated user.
        
    Raises:
        HTTPException: If user not found.
    """
    user_service = UserService(db)
    success = user_service.delete_user(user_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )


@router.post("/{user_id}/refresh-qr", response_model=dict)
def refresh_user_qr_token(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Refresh a user's QR code token.
    
    This invalidates any existing QR codes for the user.
    
    Args:
        user_id: The user's ID.
        db: Database session.
        current_user: Current authenticated user.
        
    Returns:
        The new QR token.
        
    Raises:
        HTTPException: If user not found.
    """
    user_service = UserService(db)
    new_token = user_service.generate_qr_token(user_id)
    
    if not new_token:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    return {"qr_token": new_token}