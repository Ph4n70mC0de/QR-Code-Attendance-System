"""
Comprehensive API test script for QR Code Attendance System.
Tests all endpoints in a logical flow.
"""

import requests
import sys
import time
from datetime import datetime, date

BASE_URL = "http://localhost:8000/api/v1"

# Test results tracking
results = {"passed": 0, "failed": 0, "total": 0}


def print_result(test_name, success, response=None):
    """Print test result with formatting."""
    results["total"] += 1
    if success:
        results["passed"] += 1
        print(f"[PASS] {test_name}")
    else:
        results["failed"] += 1
        print(f"[FAIL] {test_name}")
        if response:
            print(f"   Response: {response.status_code} - {response.text[:200]}")


def test_auth_flow():
    """Test authentication endpoints."""
    print("\n" + "=" * 50)
    print("TESTING AUTHENTICATION ENDPOINTS")
    print("=" * 50)

    # Test registration
    print("\n--- Registration ---")
    test_email = f"test_{int(time.time())}@example.com"
    register_data = {
        "email": test_email,
        "password": "TestPassword123!",
        "name": "Test User",
        "role": "student"
    }
    response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
    print_result("Register new user", response.status_code == 200, response)

    if response.status_code != 200:
        return None

    user_data = response.json()
    user_id = user_data.get("id")

    # Test login
    print("\n--- Login ---")
    login_data = {
        "username": test_email,
        "password": "TestPassword123!"
    }
    response = requests.post(f"{BASE_URL}/auth/login", data=login_data)
    print_result("Login with credentials", response.status_code == 200, response)

    if response.status_code != 200:
        return None

    access_token = response.json().get("access_token")
    headers = {"Authorization": f"Bearer {access_token}"}

    # Test get current user
    print("\n--- Get Current User ---")
    response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print_result("Get current user info", response.status_code == 200, response)

    return {"token": access_token, "headers": headers, "email": test_email, "user_id": user_id}


def test_user_management(auth):
    """Test user management endpoints."""
    print("\n" + "=" * 50)
    print("TESTING USER MANAGEMENT ENDPOINTS")
    print("=" * 50)

    headers = auth["headers"]

    # Test list users
    print("\n--- List Users ---")
    response = requests.get(f"{BASE_URL}/users/", headers=headers, params={"skip": 0, "limit": 10})
    print_result("List users with pagination", response.status_code == 200, response)

    # Test get user by ID
    print("\n--- Get User by ID ---")
    user_id = auth["user_id"]
    response = requests.get(f"{BASE_URL}/users/{user_id}", headers=headers)
    print_result("Get user by ID", response.status_code == 200, response)

    # Test update user
    print("\n--- Update User ---")
    update_data = {"name": "Updated Test User"}
    response = requests.put(f"{BASE_URL}/users/{user_id}", headers=headers, json=update_data)
    print_result("Update user", response.status_code == 200, response)

    return auth


def test_qr_code_system(auth):
    """Test QR code generation and validation."""
    print("\n" + "=" * 50)
    print("TESTING QR CODE SYSTEM")
    print("=" * 50)

    headers = auth["headers"]

    # Test generate QR code
    print("\n--- Generate QR Code ---")
    response = requests.get(f"{BASE_URL}/qr/my-qr", headers=headers)
    print_result("Generate QR code for current user", response.status_code == 200, response)

    if response.status_code != 200:
        return auth

    qr_data = response.json()
    qr_token = qr_data.get("token")

    # Test validate QR code
    print("\n--- Validate QR Code ---")
    validate_data = {"token": qr_token}
    response = requests.post(f"{BASE_URL}/qr/validate", json=validate_data)
    print_result("Validate QR code token", response.status_code == 200, response)

    # Test refresh QR token
    print("\n--- Refresh QR Token ---")
    response = requests.post(f"{BASE_URL}/qr/refresh", headers=headers)
    print_result("Refresh QR token", response.status_code == 200, response)

    return auth


def test_attendance_system(auth):
    """Test attendance recording and viewing."""
    print("\n" + "=" * 50)
    print("TESTING ATTENDANCE SYSTEM")
    print("=" * 50)

    headers = auth["headers"]

    # First, get a fresh QR token
    print("\n--- Getting Fresh QR Token ---")
    response = requests.get(f"{BASE_URL}/qr/my-qr", headers=headers)
    if response.status_code == 200:
        qr_token = response.json().get("token")
    else:
        print("[WARN] Could not get QR token, skipping attendance test")
        return auth

    # Test record time-in
    print("\n--- Record Time-In ---")
    scan_data = {"qr_token": qr_token, "status": "time-in"}
    response = requests.post(f"{BASE_URL}/attendance/scan", headers=headers, json=scan_data)
    print_result("Record time-in attendance", response.status_code == 200, response)

    # Test get my attendance
    print("\n--- Get My Attendance ---")
    response = requests.get(f"{BASE_URL}/attendance/my-attendance", headers=headers, params={"skip": 0, "limit": 10})
    print_result("Get my attendance records", response.status_code == 200, response)

    # Test duplicate time-in prevention
    print("\n--- Test Duplicate Prevention ---")
    response = requests.post(f"{BASE_URL}/attendance/scan", headers=headers, json=scan_data)
    print_result("Duplicate time-in prevention", response.status_code == 400, response)

    # Test get attendance summary
    print("\n--- Get Attendance Summary ---")
    response = requests.get(f"{BASE_URL}/attendance/summary", headers=headers)
    print_result("Get attendance summary", response.status_code == 200, response)

    return auth


def test_reporting(auth):
    """Test reporting endpoints."""
    print("\n" + "=" * 50)
    print("TESTING REPORTING ENDPOINTS")
    print("=" * 50)

    headers = auth["headers"]

    # Test daily attendance
    print("\n--- Daily Attendance ---")
    response = requests.get(f"{BASE_URL}/attendance/daily", headers=headers, params={"date": date.today().isoformat()})
    print_result("Get daily attendance", response.status_code == 200, response)

    # Test attendance report
    print("\n--- Attendance Report ---")
    response = requests.get(f"{BASE_URL}/attendance/report", headers=headers, params={
        "skip": 0,
        "limit": 10,
        "start_date": date.today().isoformat(),
        "end_date": date.today().isoformat()
    })
    print_result("Get attendance report", response.status_code == 200, response)

    return auth


def run_all_tests():
    """Run all API tests."""
    print("\n" + "=" * 60)
    print("QR CODE ATTENDANCE SYSTEM - API TEST SUITE")
    print("=" * 60)
    print(f"Base URL: {BASE_URL}")
    print(f"Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Test authentication flow
    auth = test_auth_flow()
    if auth is None:
        print("\n[FAIL] Authentication tests failed. Cannot continue.")
        print_summary()
        return

    # Test user management
    auth = test_user_management(auth)

    # Test QR code system
    auth = test_qr_code_system(auth)

    # Test attendance system
    auth = test_attendance_system(auth)

    # Test reporting
    auth = test_reporting(auth)

    # Print summary
    print_summary()


def print_summary():
    """Print test summary."""
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(f"Total Tests: {results['total']}")
    print(f"[PASS] Passed: {results['passed']}")
    print(f"[FAIL] Failed: {results['failed']}")
    print(f"Pass Rate: {(results['passed'] / results['total'] * 100):.1f}%" if results['total'] > 0 else "N/A")
    print("=" * 60)


if __name__ == "__main__":
    print("\n[WARN] Make sure the FastAPI server is running on http://localhost:8000")
    # Skip prompt if --no-prompt flag is passed or if no stdin available
    if len(sys.argv) > 1 and sys.argv[1] == "--no-prompt":
        print("Starting tests immediately...")
    else:
        try:
            input("Press Enter to start tests...")
        except EOFError:
            print("No input available, starting tests...")
    run_all_tests()
