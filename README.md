# QR Code Attendance System - Frontend

A modern, responsive frontend for a QR Code-based attendance management system built with React, Vite, TypeScript, and Tailwind CSS.

## Features

### Admin
- Dashboard with analytics overview
- User Management (CRUD for students and instructors)
- Generate QR codes for sessions
- View all attendance logs
- Export reports

### Instructor
- Dashboard showing assigned classes
- Start/End attendance sessions
- View student attendance per class
- Live QR scanner interface

### Student
- Personal dashboard
- Display personal QR code for attendance
- View attendance history

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and development server
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v7** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **qrcode.react** - QR code generation
- **html5-qrcode** - QR code scanning
- **Lucide React** - Icons

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components (Button, Input, Card, Modal, Loader)
│   ├── layout/       # Layout components (Sidebar, Navbar, DashboardLayout)
│   └── features/     # Feature-specific components
├── pages/
│   ├── admin/        # Admin pages
│   ├── instructor/   # Instructor pages
│   └── student/      # Student pages
├── layouts/          # Page layouts
├── hooks/            # Custom hooks (useAuth)
├── services/         # API services (auth, user, attendance)
├── store/            # Zustand stores (auth, UI)
├── utils/            # Utility functions
├── routes/           # Route definitions
└── types/            # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ph4n70mC0de/QR-Code-Attendance-System.git
cd QR-Code-Attendance-System
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your API base URL:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Demo Accounts

Use these demo credentials to test the application:

| Role       | Email                  | Password     |
|------------|------------------------|--------------|
| Admin      | admin@example.com      | password123  |
| Instructor | instructor@example.com | password123  |
| Student    | student@example.com    | password123  |

## Available Scripts

| Script        | Description                                    |
|---------------|------------------------------------------------|
| `npm run dev` | Start development server                       |
| `npm run build` | Build for production                         |
| `npm run preview` | Preview production build                   |
| `npm run lint` | Run ESLint                                    |

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## API Integration

The frontend expects a REST API with the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user

### Users
- `GET /users` - Get all users (paginated)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Classes
- `GET /classes` - Get all classes
- `GET /classes/:id` - Get class by ID
- `POST /classes` - Create class
- `PUT /classes/:id` - Update class
- `DELETE /classes/:id` - Delete class

### Sessions
- `GET /sessions/:id` - Get session
- `POST /classes/:id/sessions` - Create session
- `POST /sessions/:id/start` - Start session
- `POST /sessions/:id/end` - End session
- `POST /sessions/:id/scan` - Scan QR code

### Attendance
- `GET /sessions/:id/attendance` - Get attendance for session
- `GET /students/:id/attendance` - Get student attendance history
- `POST /sessions/:id/attendance` - Mark attendance

### Reports
- `GET /dashboard/stats` - Get dashboard statistics
- `GET /reports/attendance/export` - Export attendance report

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.