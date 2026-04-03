/**
 * Sidebar Component
 * Navigation sidebar with role-based menu items
 */
import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  QrCodeIcon,
  CameraIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'My QR Code', href: '/my-qr', icon: QrCodeIcon },
  { name: 'Scanner', href: '/scanner', icon: CameraIcon },
  { name: 'My Attendance', href: '/attendance', icon: ClipboardDocumentListIcon },
];

const adminNavigation = [
  { name: 'User Management', href: '/users', icon: UsersIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
];

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'instructor';

  const fullNavigation = isAdmin
    ? [...navigation, ...adminNavigation]
    : navigation;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white shadow-lg z-40">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 bg-gray-800 border-b border-gray-700">
        <h1 className="text-xl font-bold text-primary-400">QR Attendance</h1>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          {fullNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
            <span className="text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role || 'user'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;