"""
Authentication API routes.
Handles user registration, login, and token management.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..schemas.auth import Token, UserLogin, UserRegister, UserResponse
from ..services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Dependency to get the current authenticated user from JWT token.
    
    Args:
        token: JWT token from Authorization header.
        db: Database session.
        
    Returns:
        The authenticated User object.
        
    Raises:
        HTTPException: If token is invalid or user not found.
    """
    from ..core.security import decode_access_token
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    auth_service = AuthService(db)
    user = auth_service.get_user_by_id(int(user_id))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    return user


@router.post("/register", response_model=UserResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user.
    
    Args:
        user_data: User registration data.
        db: Database session.
        
    Returns:
        The created user data.
        
    Raises:
        HTTPException: If email already exists.
    """
    auth_service = AuthService(db)
    try:
        user = auth_service.register_user(user_data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Authenticate user and return access token.
    
    Uses OAuth2 password flow. The username field should contain the email.
    
    Args:
        form_data: OAuth2 form data with username (email) and password.
        db: Database session.
        
    Returns:
        Access token and token type.
        
    Raises:
        HTTPException: If credentials are invalid.
    """
    auth_service = AuthService(db)
    token = auth_service.login(form_data.username, form_data.password)
    
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user = Depends(get_current_user)):
    """
    Get current authenticated user information.
    
    Args:
        current_user: The authenticated user (from dependency).
        
    Returns:
        The current user's data.
    """
    return current_user