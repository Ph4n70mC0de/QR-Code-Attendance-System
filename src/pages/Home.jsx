import { Link } from 'react-router-dom';
import { Button } from '../components';
import { ROUTES } from '../utils';

/**
 * Home page component
 */
const Home = () => {
  return (
    <div className="text-center">
      {/* Hero Section */}
      <div className="py-16">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          QR Code Attendance System
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          Streamline your attendance tracking with our modern QR code-based system.
          Quick, efficient, and reliable.
        </p>
        <div className="flex justify-center gap-4">
          <Link to={ROUTES.LOGIN}>
            <Button size="large">Get Started</Button>
          </Link>
          <Link to={ROUTES.DASHBOARD}>
            <Button variant="outline" size="large">
              View Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-[#aa3bff]/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-[#aa3bff]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              QR Code Check-in
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Generate unique QR codes for quick and contactless attendance marking.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-[#aa3bff]/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-[#aa3bff]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Real-time Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track attendance patterns and generate detailed reports instantly.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-[#aa3bff]/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-[#aa3bff]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Secure & Reliable
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enterprise-grade security with encrypted data and secure authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;