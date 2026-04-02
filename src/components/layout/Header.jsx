import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context';
import { ROUTES } from '../../utils';

/**
 * Header navigation component
 */
const Header = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: ROUTES.HOME, label: 'Home' },
    { path: ROUTES.DASHBOARD, label: 'Dashboard' },
    { path: ROUTES.ATTENDANCE, label: 'Attendance' },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center">
            <h1 className="text-xl font-bold text-[#aa3bff]">QR Attendance</h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-[#aa3bff] bg-[#aa3bff]/10'
                    : 'text-gray-700 dark:text-gray-300 hover:text-[#aa3bff] hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated() && user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="px-4 py-2 text-sm font-medium text-white bg-[#aa3bff] rounded-lg hover:bg-[#8f2ae8] transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;