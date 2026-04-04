import React, { useState } from 'react';
import { Users, CheckCircle, QrCode, Play, Square } from 'lucide-react';
import { Card, Button } from '../../components/ui';
import { useNavigate } from 'react-router-dom';

interface Session {
  id: string;
  className: string;
  classCode: string;
  isActive: boolean;
  startTime: string;
  attendees: number;
  totalStudents: number;
}

const InstructorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sessions] = useState<Session[]>([
    {
      id: '1',
      className: 'CS 101 - Introduction to Programming',
      classCode: 'CS101',
      isActive: true,
      startTime: '10:00 AM',
      attendees: 32,
      totalStudents: 40,
    },
    {
      id: '2',
      className: 'CS 201 - Data Structures',
      classCode: 'CS201',
      isActive: false,
      startTime: '2:00 PM',
      attendees: 0,
      totalStudents: 35,
    },
  ]);

  const activeSession = sessions.find((s) => s.isActive);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h2>
        <p className="text-gray-600 mt-1">Manage your classes and attendance sessions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Classes</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">3</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </Card>
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Sessions</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {sessions.filter((s) => s.isActive).length}
            </p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <Play className="h-6 w-6 text-green-600" />
          </div>
        </Card>
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Today's Attendance</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">85%</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <CheckCircle className="h-6 w-6 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Active Session */}
      {activeSession && (
        <Card className="border-2 border-green-500 bg-green-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500 rounded-full">
                <QrCode className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full animate-pulse">
                    LIVE
                  </span>
                  <p className="font-semibold text-gray-900">{activeSession.className}</p>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Started at {activeSession.startTime} • {activeSession.attendees}/{activeSession.totalStudents} students marked present
                </p>
              </div>
            </div>
            <Button variant="danger" onClick={() => {}} size="sm">
              <Square className="h-4 w-4 mr-2" />
              End Session
            </Button>
          </div>
        </Card>
      )}

      {/* Classes List */}
      <Card title="Your Classes" description="Manage your class sessions">
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                session.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-gray-900">{session.className}</p>
                  {session.isActive && (
                    <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Code: {session.classCode} • {session.totalStudents} students
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {!session.isActive && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/instructor/scan')}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Start Session
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/instructor/sessions/${session.id}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default InstructorDashboard;