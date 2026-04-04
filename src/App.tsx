import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { DashboardLayout } from './components/layout';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import StudentDashboard from './pages/student/StudentDashboard';

// Placeholder components for pages not yet created
const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-96">
    <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
    <p className="text-gray-600">This page is coming soon!</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes with DashboardLayout */}
        <Route element={<DashboardLayout />}>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ComingSoon title="User Management" />} />
          <Route path="/admin/qr-generator" element={<ComingSoon title="QR Code Generator" />} />
          <Route path="/admin/reports" element={<ComingSoon title="Reports" />} />

          {/* Instructor routes */}
          <Route path="/instructor" element={<InstructorDashboard />} />
          <Route path="/instructor/sessions" element={<ComingSoon title="Sessions" />} />
          <Route path="/instructor/scan" element={<ComingSoon title="QR Scanner" />} />
          <Route path="/instructor/sessions/:id" element={<ComingSoon title="Session Details" />} />

          {/* Student routes */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/qr" element={<ComingSoon title="My QR Code" />} />
          <Route path="/student/history" element={<ComingSoon title="Attendance History" />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;