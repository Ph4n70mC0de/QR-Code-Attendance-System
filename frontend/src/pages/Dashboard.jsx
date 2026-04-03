/**
 * Dashboard Page
 * Overview of attendance statistics and quick actions
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../components/layout/DashboardLayout';
import AttendanceService from '../services/attendance.service';
import UserService from '../services/user.service';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          {Icon && <Icon className={`h-6 w-6 text-${color}-600`} />}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    todayAttendance: 0,
    myAttendance: 0,
    myQRStatus: 'Active',
  });
  const [loading, setLoading] = useState(true);
  const [recentAttendance, setRecentAttendance] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user's attendance
        const myAttendance = await AttendanceService.getMyAttendance({ limit: 10 });
        setRecentAttendance(myAttendance);

        // Calculate stats
        const today = new Date().toISOString().split('T')[0];
        const todayRecords = myAttendance.filter(
          (record) => record.timestamp?.split('T')[0] === today
        );

        setStats((prev) => ({
          ...prev,
          myAttendance: myAttendance.length,
          todayAttendance: todayRecords.length,
        }));

        // Admin-specific stats
        if (user?.role === 'admin' || user?.role === 'instructor') {
          const users = await UserService.getUsers({ limit: 100 });
          setStats((prev) => ({
            ...prev,
            totalUsers: users.length,
          }));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.role]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const isAdmin = user?.role === 'admin' || user?.role === 'instructor';

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your attendance today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isAdmin && (
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={UsersIcon}
            color="blue"
          />
        )}
        <StatCard
          title="Today's Attendance"
          value={stats.todayAttendance}
          icon={CheckCircleIcon}
          color="green"
        />
        <StatCard
          title="My Total Attendance"
          value={stats.myAttendance}
          icon={ClockIcon}
          color="yellow"
        />
        <Link to="/my-qr">
          <StatCard
            title="My QR Code"
            value={stats.myQRStatus}
            icon={QrCodeIcon}
            color="purple"
          />
        </Link>
      </div>

      {/* Recent Attendance */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Attendance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                {isAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentAttendance.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 3 : 2}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No attendance records yet.
                  </td>
                </tr>
              ) : (
                recentAttendance.slice(0, 5).map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.timestamp).toLocaleString()}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.user?.name || 'N/A'}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          record.status === 'time-in'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {recentAttendance.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Link
              to="/attendance"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all attendance →
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;