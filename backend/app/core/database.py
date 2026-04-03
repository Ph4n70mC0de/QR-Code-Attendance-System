"""
Database connection and session management module.
Provides SQLAlchemy engine and session factory for database operations.
Optimized with connection pooling and performance settings.
"""

import logging
from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool

from .config import settings

logger = logging.getLogger(__name__)

# Create SQLAlchemy engine with optimized connection pool settings
engine = create_engine(
    settings.DATABASE_URL,
    poolclass=QueuePool,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_timeout=settings.DB_POOL_TIMEOUT,
    pool_pre_ping=True,  # Enable connection health checks
    pool_recycle=3600,   # Recycle connections after 1 hour
    echo=settings.DB_ECHO,  # SQL logging (development only)
    # MySQL-specific optimizations
    connect_args={
        "charset": "utf8mb4",
        "collation": "utf8mb4_unicode_ci",
        "autocommit": False,
        "connect_timeout": 10,
    }
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False  # Prevent stale data issues
)

# Base class for declarative models
Base = declarative_base()


@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    """
    Event listener for connection creation.
    Can be used to set connection-specific settings.
    """
    # MySQL-specific settings could be set here if needed
    pass


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
    db: Session = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database error: {e}")
        db.rollback()
        raise
    finally:
        db.close()


def get_db_context():
    """
    Context manager for database sessions.
    Useful for background tasks or scripts outside of request context.
    
    Usage:
        with get_db_context() as db:
            # use db session
    """
    db: Session = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Database error in context: {e}")
        raise
    finally:
        db.close()


def init_db():
    """
    Initialize the database by creating all tables.
    
    This function should be called on application startup to ensure
    all database tables are created based on the defined models.
    """
    logger.info("Initializing database...")
    Base.metadata.create_all(bind=engine, checkfirst=True)
    logger.info("Database initialization complete")


def check_db_connection():
    """
    Check if database connection is healthy.
    
    Returns:
        bool: True if connection is successful, False otherwise.
    """
    try:
        connection = engine.connect()
        connection.close()
        return True
    except Exception as e:
        logger.error(f"Database connection check failed: {e}")
        return False


def get_engine():
    """
    Get the SQLAlchemy engine instance.
    Useful for advanced operations or debugging.
    """
    return engine