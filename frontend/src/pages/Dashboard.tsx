import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { sessionApi } from '../services/api';
import type { Session } from '../types';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalAttendance: 0,
    upcomingSessions: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [sessionsResponse] = await Promise.all([
        sessionApi.getActive(),
      ]);
      
      setSessions(sessionsResponse.data.slice(0, 5));
      setStats({
        totalSessions: sessionsResponse.data.length,
        totalAttendance: Math.floor(Math.random() * 100), // Placeholder
        upcomingSessions: sessionsResponse.data.filter(s => new Date(s.start_time) > new Date()).length,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Welcome Message */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Welcome back, {user?.name}!
        </h2>
        <p className="text-gray-600">
          Role: <span className="capitalize">{user?.role}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {stats.totalSessions}
          </div>
          <div className="text-gray-600">Total Sessions</div>
        </div>

        <div className="card">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {stats.totalAttendance}
          </div>
          <div className="text-gray-600">Total Attendance</div>
        </div>

        <div className="card">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {stats.upcomingSessions}
          </div>
          <div className="text-gray-600">Upcoming Sessions</div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Active Sessions</h3>
          <Link to="/sessions" className="text-primary-600 hover:underline text-sm">
            View All
          </Link>
        </div>

        {sessions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No active sessions. {user?.role === 'instructor' && 'Create one to get started!'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Start Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    End Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.map((session) => (
                  <tr key={session.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {session.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(session.start_time).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(session.end_time).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {session.location || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        {user?.role === 'instructor' && (
          <>
            <Link to="/sessions/new" className="card hover:shadow-lg transition-shadow">
              <div className="text-lg font-semibold text-primary-600 mb-2">
                + Create New Session
              </div>
              <p className="text-gray-600">
                Set up a new attendance session with QR code generation
              </p>
            </Link>

            <Link to="/qr" className="card hover:shadow-lg transition-shadow">
              <div className="text-lg font-semibold text-primary-600 mb-2">
                Generate QR Code
              </div>
              <p className="text-gray-600">
                Create QR codes for existing sessions
              </p>
            </Link>
          </>
        )}

        {user?.role === 'student' && (
          <Link to="/attendance" className="card hover:shadow-lg transition-shadow">
            <div className="text-lg font-semibold text-primary-600 mb-2">
              View My Attendance
            </div>
            <p className="text-gray-600">
              Check your attendance history and records
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}