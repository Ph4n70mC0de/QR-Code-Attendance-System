# Frontend Prompt Outline for Cline AI

## Project Title

QR Code Attendance System Frontend (React + Vite + Tailwind + Axios)

---

## 1. Objective

Build a modern, responsive frontend for a QR Code Attendance System that communicates with a Python (FastAPI) backend.

---

## 2. Tech Stack Requirements

- React (with Vite)
- Tailwind CSS (for styling)
- Axios (for API requests)
- React Router (for navigation)
- Optional: Zustand or Context API (state management)

---

## 3. Core Features

### Authentication

- Login page
- Store JWT token (localStorage or cookies)
- Protected routes

### Admin Dashboard

- Overview cards (total users, attendance today, etc.)
- Navigation sidebar

### User Management

- Create, edit, delete users
- Display user list in table
- Search and filter users

### QR Code Module

- Display generated QR codes per user
- Download QR codes

### Scanner Module

- Use camera to scan QR codes
- Decode QR using library (html5-qrcode)
- Send scanned data to backend

### Attendance Tracking

- Display real-time scan result
- Show success/failure messages

### Reports

- View attendance logs
- Filter by date range
- Export to CSV

---

## 4. Project Structure

/src
/components
/pages
/services
/hooks
/context
/layouts
/utils

---

## 5. Routing Structure

- /login
- /dashboard
- /users
- /scanner
- /reports

---

## 6. UI/UX Requirements

- Clean dashboard layout
- Mobile responsive design
- Sidebar navigation
- Toast notifications
- Loading indicators

---

## 7. API Integration (Axios)

- Create Axios instance with base URL
- Add interceptor for JWT token

Example Endpoints:

- POST /login
- GET /users
- POST /scan
- GET /attendance

---

## 8. Component Breakdown

### Reusable Components

- Button
- Input Field
- Modal
- Table
- Card

### Layout Components

- Sidebar
- Navbar
- Page Wrapper

---

## 9. State Management

- Store auth state (user + token)
- Manage global UI states (loading, notifications)

---

## 10. Scanner Implementation Details

- Use html5-qrcode library
- Access device camera
- Scan continuously
- Handle scan success and errors

---

## 11. Security Considerations

- Protect routes using token validation
- Handle token expiration
- Sanitize user input

---

## 12. Styling Guidelines

- Use Tailwind utility classes
- Maintain consistent spacing and colors
- Use responsive breakpoints

---

## 13. Expected Output

Cline AI should:

- Generate clean, modular React code
- Use functional components and hooks
- Follow best practices
- Include comments
- Ensure responsiveness

---

## 14. Constraints

- Use only specified stack
- Avoid unnecessary libraries
- Keep code readable and maintainable

---

## 15. Stretch Goals

- Dark mode support
- Role-based UI rendering
- Real-time updates (WebSockets)

---

End of Prompt
