"""
Server startup script that properly configures the Python path.
Run this script to start the FastAPI development server.
"""

import sys
import os

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Now import and run uvicorn
import uvicorn

if __name__ == "__main__":
    print("=" * 60)
    print("QR Code Attendance System - Backend Server")
    print("=" * 60)
    print(f"Starting server at: http://localhost:8000")
    print(f"API Documentation: http://localhost:8000/docs")
    print(f"ReDoc: http://localhost:8000/redoc")
    print("=" * 60)
    print()
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )