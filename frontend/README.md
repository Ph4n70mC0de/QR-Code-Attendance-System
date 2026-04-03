# QR Code Attendance System - Frontend

A modern React-based frontend for the QR Code Attendance System, built with Vite, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**: Login, register, and session management
- **Dashboard**: Overview of sessions and attendance statistics
- **Session Management**: Create, view, and manage attendance sessions
- **QR Code Generation**: Generate QR codes for session check-ins
- **Attendance Tracking**: View and manage attendance records
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **TanStack React Query** - Data fetching and caching
- **qrcode.react** - QR code generation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running on `http://localhost:8000`

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   # Copy .env.example to .env and update values
   cp .env.example .env
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   └── Layout.tsx  # Main layout with navigation
├── pages/          # Page components
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Sessions.tsx
│   ├── Attendance.tsx
│   └── QRCode.tsx
├── services/       # API service layer
│   └── api.ts      # Axios instance and API endpoints
├── store/          # Zustand stores
│   └── authStore.ts # Authentication state
├── types/          # TypeScript type definitions
│   └── index.ts
├── App.tsx         # Main app component with routing
├── main.tsx        # Entry point
└── index.css       # Global styles with Tailwind
```

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: `http://localhost:8000/api/v1`)

## API Integration

The frontend communicates with the FastAPI backend through a typed API service layer. All API calls are centralized in `services/api.ts` and include:

- **Auth API**: Register, login, get current user
- **User API**: CRUD operations for users
- **Session API**: Manage attendance sessions
- **QR Code API**: Generate and validate QR codes
- **Attendance API**: Record and view attendance

## Authentication

The app uses JWT tokens for authentication. Tokens are stored in localStorage and automatically included in API requests via axios interceptors. Protected routes redirect unauthenticated users to the login page.

## Styling

The app uses Tailwind CSS with custom components defined in `index.css`:
- `.btn` - Base button styles
- `.btn-primary` - Primary button variant
- `.btn-secondary` - Secondary button variant
- `.input` - Form input styles
- `.card` - Card container styles

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request