/**
 * Attendance Page
 * View personal attendance history
 */
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AttendanceService from '../services/attendance.service';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Attendance = () => {
  useAuth(); // Ensure user is authenticated
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  const fetchAttendance = async () => {
    try {
      const [attendanceData, summaryData] = await Promise.all([
        AttendanceService.getMyAttendance({ limit: 50 }),
        AttendanceService.getAttendanceSummary(),
      ]);
      setAttendance(attendanceData);
      setSummary(summaryData);
    } catch {
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Group attendance by date
  const groupedAttendance = attendance.reduce((groups, record) => {
    const date = new Date(record.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {});

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
        <p className="text-gray-500 mt-1">
          View your attendance history and statistics.
        </p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500 mb-1">Total Days Present</p>
            <p className="text-2xl font-bold text-gray-900">
              {summary.total_days_present || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500 mb-1">Time In Records</p>
            <p className="text-2xl font-bold text-green-600">
              {summary.total_time_in || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500 mb-1">Time Out Records</p>
            <p className="text-2xl font-bold text-blue-600">
              {summary.total_time_out || 0}
            </p>
          </div>
        </div>
      )}

      {/* Attendance List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Attendance History</h2>
        </div>

        {Object.keys(groupedAttendance).length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No attendance records found.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {Object.entries(groupedAttendance)
              .sort((a, b) => new Date(b[0]) - new Date(a[0]))
              .map(([date, records]) => (
                <div key={date} className="p-4">
                  <h3 className="font-medium text-gray-900 mb-3">
                    {date === new Date().toLocaleDateString()
                      ? 'Today'
                      : date}
                  </h3>
                  <div className="space-y-2">
                    {records.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              record.status === 'time-in'
                                ? 'bg-green-500'
                                : 'bg-blue-500'
                            }`}
                          />
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {record.status}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(record.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Attendance;