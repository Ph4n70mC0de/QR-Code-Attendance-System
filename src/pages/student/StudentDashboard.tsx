import React, { useState } from 'react';
import { QrCode, Calendar, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Card, Button } from '../../components/ui';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

interface AttendanceRecord {
  id: string;
  className: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  time?: string;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [attendanceRecords] = useState<AttendanceRecord[]>([
    { id: '1', className: 'CS 101', date: '2024-01-15', status: 'present', time: '10:05 AM' },
    { id: '2', className: 'CS 201', date: '2024-01-15', status: 'present', time: '2:03 PM' },
    { id: '3', className: 'MATH 101', date: '2024-01-14', status: 'late', time: '11:15 AM' },
    { id: '4', className: 'CS 101', date: '2024-01-14', status: 'present', time: '10:02 AM' },
  ]);

  const stats = {
    totalClasses: 4,
    attendanceRate: 92,
    presentDays: 45,
    lateDays: 3,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Student Dashboard</h2>
        <p className="text-gray-600 mt-1">Track your attendance and view your QR code</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Enrolled Classes</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalClasses}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
        </Card>
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.attendanceRate}%</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </Card>
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Days Present</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.presentDays}</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <CheckCircle className="h-6 w-6 text-purple-600" />
          </div>
        </Card>
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Days Late</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.lateDays}</p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-full">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
        </Card>
      </div>

      {/* QR Code Card */}
      <Card className="max-w-md mx-auto">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Personal QR Code</h3>
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white border-2 border-gray-200 rounded-lg inline-block">
              <QRCodeSVG
                value="STU-2024-001-JOHN-DOE"
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Show this QR code to your instructor to mark attendance
          </p>
          <Button variant="primary" onClick={() => navigate('/student/qr')}>
            <QrCode className="h-4 w-4 mr-2" />
            View Full QR Code
          </Button>
        </div>
      </Card>

      {/* Recent Attendance */}
      <Card title="Recent Attendance" description="Your latest attendance records">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceRecords.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.className}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(record.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.time || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Button variant="outline" onClick={() => navigate('/student/history')}>
            View Full History
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboard;