import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="text-center">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          QR Code Attendance System
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Streamline your attendance tracking with QR codes
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-lg font-semibold mb-2">Quick Check-in</h3>
          <p className="text-gray-600">
            Students can check in by simply scanning a QR code with their phone.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold mb-2">Real-time Tracking</h3>
          <p className="text-gray-600">
            Monitor attendance in real-time with detailed reports and analytics.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold mb-2">Secure & Reliable</h3>
          <p className="text-gray-600">
            Time-limited QR codes ensure secure and fraud-proof attendance.
          </p>
        </div>
      </div>

      {/* CTA */}
      {!isAuthenticated ? (
        <div className="space-x-4">
          <Link to="/register" className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-lg">
            Get Started
          </Link>
          <Link to="/login" className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-lg">
            Sign In
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-lg text-gray-600 mb-4">
            Welcome back, {user?.name}!
          </p>
          <Link to="/dashboard" className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-lg">
            Go to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}