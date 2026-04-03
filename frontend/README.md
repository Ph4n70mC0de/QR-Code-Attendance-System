# QR Code Attendance System - Frontend

A modern, responsive React frontend for the QR Code Attendance System.

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v7** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Heroicons** - SVG icons
- **html5-qrcode** - QR code scanning library

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see backend/README.md)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   # Copy and edit .env file
   cp .env.example .env
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   └── layout/          # Layout components (Sidebar, Navbar, etc.)
├── pages/               # Page components
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Users.jsx
│   ├── MyQR.jsx
│   ├── Scanner.jsx
│   ├── Attendance.jsx
│   └── Reports.jsx
├── services/            # API service layer
│   ├── api.js           # Axios instance configuration
│   ├── auth.service.js
│   ├── user.service.js
│   ├── qr.service.js
│   └── attendance.service.js
├── context/             # React context providers
│   └── AuthContext.jsx
├── hooks/               # Custom hooks
├── utils/               # Utility functions
├── App.jsx              # Main app component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8000/api/v1` |

## Features

### Authentication
- JWT-based authentication
- Protected routes
- Auto-redirect on token expiration

### User Management (Admin)
- Create, edit, delete users
- Search and filter users
- Refresh QR tokens

### QR Code
- Display personal QR code
- Download QR code as image
- Refresh QR code token

### Scanner
- Camera-based QR code scanning
- Automatic attendance recording
- Camera selection (multi-camera support)

### Attendance
- View personal attendance history
- Grouped by date
- Summary statistics

### Reports (Admin)
- Filter by user, date range, status
- Export to CSV
- View all attendance records

## API Integration

The frontend communicates with the FastAPI backend through the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user

### Users
- `GET /users/` - List users
- `POST /users/` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `POST /users/:id/refresh-qr` - Refresh user QR token

### QR Code
- `GET /qr/my-qr` - Get personal QR code
- `POST /qr/validate` - Validate QR token
- `POST /qr/refresh` - Refresh personal QR code

### Attendance
- `POST /attendance/scan` - Record attendance
- `GET /attendance/` - List attendance records
- `GET /attendance/my-attendance` - Get personal attendance
- `GET /attendance/report` - Get attendance report (admin)
- `GET /attendance/summary` - Get attendance summary

## License

MIT