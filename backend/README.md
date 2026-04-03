# QR Code Attendance System - Backend

A scalable and secure FastAPI backend for managing attendance using QR codes.

## Features

- **User Authentication** - JWT-based authentication with registration and login
- **User Management** - CRUD operations for users with role-based access (admin, instructor, student)
- **QR Code Generation** - Time-limited QR codes with secure token validation
- **Attendance Tracking** - Record time-in/time-out with business rule validation
- **Reporting** - Filterable attendance reports and summaries
- **Session Management** - Optional session-based attendance tracking

## Tech Stack

- **Python** - FastAPI web framework
- **MySQL** - Relational database
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation and settings management
- **JWT** - Secure token-based authentication
- **QRCode** - QR code generation library

## Project Structure

```
backend/
├── app/
│   ├── api/           # API route handlers
│   │   ├── auth.py    # Authentication endpoints
│   │   ├── users.py   # User management endpoints
│   │   ├── qr.py      # QR code endpoints
│   │   └── attendance.py  # Attendance endpoints
│   ├── core/          # Core configuration
│   │   ├── config.py  # Application settings
│   │   ├── security.py # Authentication & hashing
│   │   └── database.py # Database connection
│   ├── models/        # SQLAlchemy database models
│   ├── schemas/       # Pydantic validation schemas
│   ├── services/      # Business logic layer
│   ├── db/            # Database utilities
│   ├── utils/         # Helper functions
│   └── main.py        # FastAPI application entry point
├── .env               # Environment variables
├── .gitignore         # Git ignore rules
└── requirements.txt   # Python dependencies
```

## Getting Started

### Prerequisites

- Python 3.9+
- MySQL 5.7+ or MariaDB 10.3+
- pip (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd QR-Code-Attendance-System/backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   
   Copy `.env` to `.env.local` and update the values:
   ```bash
   cp .env .env.local
   ```
   
   Edit `.env.local` with your database credentials and settings:
   ```
   # Application Settings
   APP_NAME="QR Code Attendance System"
   DEBUG=True
   SECRET_KEY=your-super-secret-key-change-this-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   
   # Database Settings
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=qr_attendance
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   
   # CORS Settings
   CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
   
   # QR Code Settings
   QR_CODE_EXPIRY_MINUTES=5
   ```

5. **Create the MySQL database**
   ```sql
   CREATE DATABASE qr_attendance CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

6. **Run the application**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

7. **Access the API documentation**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and get access token
- `GET /api/v1/auth/me` - Get current user info

### Users
- `GET /api/v1/users/` - List users (requires authentication)
- `GET /api/v1/users/{user_id}` - Get user by ID
- `POST /api/v1/users/` - Create new user
- `PUT /api/v1/users/{user_id}` - Update user
- `DELETE /api/v1/users/{user_id}` - Delete user
- `POST /api/v1/users/{user_id}/refresh-qr` - Refresh user's QR token

### QR Code
- `GET /api/v1/qr/my-qr` - Generate QR code for current user
- `GET /api/v1/qr/user/{user_id}` - Generate QR code for specific user
- `POST /api/v1/qr/validate` - Validate a QR code token
- `POST /api/v1/qr/refresh` - Refresh current user's QR token

### Attendance
- `POST /api/v1/attendance/scan` - Record attendance by scanning QR code
- `GET /api/v1/attendance/` - Get attendance records
- `GET /api/v1/attendance/my-attendance` - Get current user's attendance
- `GET /api/v1/attendance/report` - Get filtered attendance report
- `GET /api/v1/attendance/daily` - Get daily attendance
- `GET /api/v1/attendance/summary` - Get attendance summary

## Database Schema

### Users
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `password_hash` - Bcrypt hashed password
- `role` - User role (admin, instructor, student)
- `qr_code_token` - Unique token for QR code generation
- `is_active` - Account status
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Attendance
- `id` - Primary key
- `user_id` - Foreign key to users
- `session_id` - Optional foreign key to sessions
- `timestamp` - Attendance record time
- `status` - "time-in" or "time-out"
- `qr_token` - QR token used for validation
- `created_at` - Creation timestamp

### Sessions
- `id` - Primary key
- `name` - Session name
- `description` - Optional description
- `start_time` - Session start time
- `end_time` - Session end time
- `is_active` - Session status
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Business Rules

1. **One time-in per day** - Users can only record one time-in per day
2. **Time-out requires time-in** - Users must have a time-in before recording time-out
3. **QR codes expire** - QR codes are time-limited (default: 5 minutes)
4. **Token validation** - QR tokens are validated against user's current token
5. **Session validation** - Optional session-based attendance with active session check

## Security

### Authentication & Authorization
- **Password hashing** - Bcrypt for secure password storage with salt
- **JWT tokens** - Short-lived access tokens (30 min default) with refresh tokens (7 days)
- **Password policy** - Minimum 8 characters, requires uppercase, number, and special character
- **Login rate limiting** - Maximum 10 attempts per minute per IP
- **Account lockout** - After 5 failed attempts, account locked for 15 minutes
- **Role-based access** - Different permissions for admin, instructor, and student roles

### API Security
- **Rate limiting** - 60 requests per minute per IP (10 for auth endpoints)
- **CORS protection** - Configurable allowed origins and methods
- **Security headers** - HSTS, CSP, X-Frame-Options, X-Content-Type-Options
- **Input validation** - Pydantic schemas with sanitization for all inputs
- **Request validation** - Blocks suspicious user agents and invalid content types
- **CSRF protection** - Token-based CSRF protection available

### Data Protection
- **SQL injection prevention** - SQLAlchemy ORM with parameterized queries
- **XSS prevention** - Input sanitization and Content Security Policy
- **Secure random tokens** - Cryptographically secure token generation
- **Constant-time comparison** - For sensitive token validation

## Development

### Database Migrations

This project uses Alembic for database migrations.

#### Generate a new migration after model changes:
```bash
python generate_migration.py
```

Or using Alembic directly:
```bash
python -m alembic -c alembic.ini revision --autogenerate -m "Description of changes"
```

#### Run migrations:
```bash
python run_migration.py
```

Or using Alembic directly:
```bash
python -m alembic -c alembic.ini upgrade head
```

#### Rollback one migration:
```bash
python -m alembic -c alembic.ini downgrade -1
```

#### View current migration status:
```bash
python -m alembic -c alembic.ini current
```

#### View migration history:
```bash
python -m alembic -c alembic.ini history
```

### Running tests
```bash
pytest
```

### Code formatting
```bash
black app/
```

### Linting
```bash
flake8 app/
```

## Deployment

### Using Uvicorn (Production)
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Using Gunicorn (Production)
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker (Optional)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Performance Optimizations

### Database Optimizations
- **Connection pooling** - Configurable pool size (default: 5) with overflow handling
- **Connection recycling** - Automatic connection refresh every hour
- **Connection health checks** - Pre-ping to detect stale connections
- **Query optimization** - SQLAlchemy ORM with eager loading options

### API Performance
- **Rate limiting** - Prevents abuse and ensures fair usage
- **Request logging** - Performance monitoring with timing headers
- **Response compression** - Automatic gzip compression for large responses
- **Caching headers** - Proper cache control for static resources

### Scalability
- **Stateless design** - JWT tokens enable horizontal scaling
- **Connection pooling** - Efficient database connection management
- **Async support** - FastAPI's async capabilities for I/O operations
- **Worker processes** - Multi-worker support for production

## Configuration Reference

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `APP_ENV` | Environment (development/staging/production) | `development` |
| `SECRET_KEY` | JWT signing key | *(must be set in production)* |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | `30` |
| `RATE_LIMIT_PER_MINUTE` | General API rate limit | `60` |
| `RATE_LIMIT_AUTH_PER_MINUTE` | Auth endpoint rate limit | `10` |
| `DB_POOL_SIZE` | Database connection pool size | `5` |
| `DB_MAX_OVERFLOW` | Maximum overflow connections | `10` |
| `MIN_PASSWORD_LENGTH` | Minimum password length | `8` |

## Monitoring & Health Checks

### Health Endpoints
- `GET /health` - Full health check with database connectivity
- `GET /ping` - Simple ping for load balancer health checks

### Response Headers
- `X-RateLimit-Limit` - Rate limit ceiling
- `X-RateLimit-Remaining` - Remaining requests in window
- `X-Process-Time` - Request processing time in seconds

## License

MIT License
