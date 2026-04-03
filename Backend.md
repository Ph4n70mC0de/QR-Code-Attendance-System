# Backend Prompt Outline for Cline AI

## Project Title

QR Code Attendance System Backend (Python + FastAPI + MySQL + SQLAlchemy)

---

## 1. Objective

Build a scalable, secure backend API for a QR Code Attendance System that handles authentication, QR validation, and attendance tracking.

---

## 2. Tech Stack Requirements

- Python (FastAPI preferred, Flask fallback)
- MySQL (Relational Database)
- SQLAlchemy ORM
- Pydantic (data validation)
- JWT Authentication
- QR Code Libraries: qrcode, OpenCV, or pyzbar

---

## 3. Core Features

### Authentication

- User registration
- Login with JWT token
- Role-based access (admin, instructor, student)

### User Management

- Create, update, delete users
- Assign roles
- Generate unique QR codes per user

### QR Code System

- Generate QR codes containing encrypted payload
- Decode and validate QR codes on scan

### Attendance System

- Time-in and time-out logging
- Prevent duplicate entries
- Associate logs with sessions (optional)

### Reporting

- Fetch attendance logs
- Filter by date/user/session
- Export support (CSV-ready data)

---

## 4. Project Structure

/app
/api
/models
/schemas
/services
/core
/db
/utils
main.py

---

## 5. Database Design

### users

- id (PK)
- name
- email (unique)
- password_hash
- role
- qr_code_token (unique)
- created_at

### attendance

- id (PK)
- user_id (FK)
- timestamp
- status (time-in/time-out)

### sessions (optional)

- id
- name
- start_time
- end_time

---

## 6. API Endpoints

### Auth

- POST /auth/register
- POST /auth/login

### Users

- GET /users
- POST /users
- PUT /users/{id}
- DELETE /users/{id}

### QR

- GET /qr/{user_id}

### Attendance

- POST /attendance/scan
- GET /attendance
- GET /attendance/report

---

## 7. QR Code Logic

### Generation

- Payload includes:
  - user_id
  - signed token (JWT or encrypted string)

### Validation

- Decode QR
- Verify token integrity
- Match user

---

## 8. Services Layer

- AuthService (login, token generation)
- UserService (CRUD operations)
- QRService (generate/validate QR)
- AttendanceService (logging and rules)

---

## 9. Security Considerations

- Hash passwords using bcrypt
- Use JWT with expiration
- Validate all inputs with Pydantic
- Prevent replay attacks on QR scans
- Rate limit scan endpoint

---

## 10. Business Logic Rules

- One time-in per day per session
- Time-out must follow time-in
- Reject invalid or expired QR codes

---

## 11. Expected Output

Cline AI should:

- Generate modular, clean Python code
- Use dependency injection (FastAPI Depends)
- Include docstrings and comments
- Provide requirements.txt
- Provide .env example

---

## 12. Constraints

- Must use Python
- Must use MySQL
- Use SQLAlchemy ORM (no raw SQL unless necessary)
- Keep code scalable and maintainable

---

## 13. Stretch Goals

- Docker support
- Background tasks (Celery or FastAPI BackgroundTasks)
- WebSocket support for real-time attendance
- Audit logs

---

## 14. Deployment Considerations

- Use Uvicorn or Gunicorn
- Environment-based configs
- Secure secrets in .env

---

End of Prompt
