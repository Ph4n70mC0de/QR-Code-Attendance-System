import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store';

const Navbar: React.FC = () => {
  const { toggleSidebar } = useUIStore();
  const { user } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Open sidebar"
          title="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Page title - could be dynamic based on route */}
        <div className="hidden lg:block">
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'admin' && 'Admin Dashboard'}
            {user?.role === 'instructor' && 'Instructor Dashboard'}
            {user?.role === 'student' && 'Student Dashboard'}
          </h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-5 w-5 text-primary-600" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'Role'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;