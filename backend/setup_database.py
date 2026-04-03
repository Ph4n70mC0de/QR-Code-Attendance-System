"""
Database setup script for QR Code Attendance System.
Creates the MySQL database and tables.
"""

import mysql.connector
from mysql.connector import Error
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration from environment
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", 3306))
DB_NAME = os.getenv("DB_NAME", "qr_attendance")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")


def create_database():
    """
    Create the MySQL database if it doesn't exist.
    
    Returns:
        bool: True if database was created or already exists, False on error.
    """
    try:
        # Connect to MySQL without specifying a database
        connection = mysql.connector.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Create database if it doesn't exist
            cursor.execute(f"""
                CREATE DATABASE IF NOT EXISTS {DB_NAME}
                CHARACTER SET utf8mb4
                COLLATE utf8mb4_unicode_ci
            """)
            
            print(f"[OK] Database '{DB_NAME}' is ready.")
            cursor.close()
            connection.close()
            return True
            
    except Error as e:
        print(f"[ERROR] Error creating database: {e}")
        return False
    
    return False


def test_connection():
    """
    Test the database connection.
    
    Returns:
        bool: True if connection successful, False otherwise.
    """
    try:
        connection = mysql.connector.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
        )
        
        if connection.is_connected():
            print(f"[OK] Successfully connected to MySQL")
            print(f"  Host: {DB_HOST}:{DB_PORT}")
            print(f"  Database: {DB_NAME}")
            print(f"  User: {DB_USER}")
            
            cursor = connection.cursor()
            cursor.execute("SELECT VERSION()")
            db_version = cursor.fetchone()
            print(f"  MySQL Version: {db_version[0]}")
            
            cursor.close()
            connection.close()
            return True
            
    except Error as e:
        print(f"[ERROR] Error connecting to MySQL: {e}")
        return False


def main():
    """Main setup function."""
    print("=" * 50)
    print("QR Code Attendance System - Database Setup")
    print("=" * 50)
    print()
    
    # Step 1: Create database
    print("Step 1: Creating database...")
    if create_database():
        print()
        
        # Step 2: Test connection
        print("Step 2: Testing database connection...")
        if test_connection():
            print()
            print("=" * 50)
            print("[OK] Database setup completed successfully!")
            print("=" * 50)
            print()
            print("Next steps:")
            print("1. Install dependencies: pip install -r requirements.txt")
            print("2. Run the application: uvicorn app.main:app --reload")
            print("3. Access API docs: http://localhost:8000/docs")
            return 0
        else:
            print("[ERROR] Connection test failed. Please check your credentials.")
            return 1
    else:
        print("[ERROR] Database creation failed.")
        return 1


if __name__ == "__main__":
    sys.exit(main())