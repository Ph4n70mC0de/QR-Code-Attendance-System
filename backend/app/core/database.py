"""
Database connection and session management module.
Provides SQLAlchemy engine and session factory for database operations.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from .config import settings

# Create SQLAlchemy engine with connection pool settings
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,  # Recycle connections after 1 hour
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative models
Base = declarative_base()


def get_db():
    """
    Dependency that provides a database session.
    
    Yields:
        Session: A SQLAlchemy database session.
        
    Note:
        This function is used as a FastAPI dependency to inject database
        sessions into route handlers. The session is automatically closed
        after the request is completed.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initialize the database by creating all tables.
    
    This function should be called on application startup to ensure
    all database tables are created based on the defined models.
    """
    Base.metadata.create_all(bind=engine, checkfirst=True)
