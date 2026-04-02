import { useAuth } from '../context';
import { ROUTES } from '../utils';

/**
 * Dashboard page component
 */
const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      label: 'Total Attendance',
      value: '1,234',
      change: '+12%',
      positive: true,
    },
    {
      label: 'Present Today',
      value: '89',
      change: '+5%',
      positive: true,
    },
    {
      label: 'Absent Today',
      value: '11',
      change: '-3%',
      positive: true,
    },
    {
      label: 'Late Arrivals',
      value: '7',
      change: '+2%',
      positive: false,
    },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your attendance system today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {stat.label}
            </p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <span
                className={`text-sm font-medium ${
                  stat.positive
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    New check-in recorded
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    John Doe - Computer Science 101
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {index + 1} min ago
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Upcoming Sessions
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
              >
                <div className="w-10 h-10 bg-[#aa3bff]/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#aa3bff]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Data Structures 201
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Today, {10 + index}:00 AM
                  </p>
                </div>
                <button className="text-sm text-[#aa3bff] hover:text-[#8f2ae8] font-medium">
                  Generate QR
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-6">
        <a
          href={ROUTES.ATTENDANCE}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#aa3bff]/10 rounded-lg flex items-center justify-center">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                View Attendance
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Check all records
              </p>
            </div>
          </div>
        </a>

        <a
          href="#"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Generate Report
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Export attendance data
              </p>
            </div>
          </div>
        </a>

        <a
          href="#"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Manage Users
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add or remove users
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Dashboard;