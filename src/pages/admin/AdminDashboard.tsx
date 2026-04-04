import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, Clock, CheckCircle, TrendingUp, FileText } from 'lucide-react';
import { Card } from '../../components/ui';
import { DashboardStats } from '../../types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalInstructors: 0,
    totalClasses: 0,
    totalSessions: 0,
    attendanceRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration - replace with actual API call
    // In production: attendanceService.getDashboardStats().then(...)
    const mockStats: DashboardStats = {
      totalStudents: 150,
      totalInstructors: 12,
      totalClasses: 8,
      totalSessions: 45,
      attendanceRate: 87.5,
    };
    
    // Simulate API delay
    setTimeout(() => {
      setStats(mockStats);
      setIsLoading(false);
    }, 500);
  }, []);

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Total Instructors',
      value: stats.totalInstructors,
      icon: GraduationCap,
      color: 'bg-green-500',
      change: '+2',
    },
    {
      title: 'Total Classes',
      value: stats.totalClasses,
      icon: Clock,
      color: 'bg-purple-500',
      change: '0',
    },
    {
      title: 'Attendance Rate',
      value: `${stats.attendanceRate}%`,
      icon: CheckCircle,
      color: 'bg-orange-500',
      change: '+5%',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Card key={card.title} className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500 ml-1">{card.change}</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`p-4 rounded-full ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sessions */}
        <Card title="Recent Sessions" description="Latest attendance sessions">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">CS 101 - Lecture</p>
                  <p className="text-sm text-gray-500">Today, 10:00 AM</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    Active
                  </span>
                  <span className="text-sm text-gray-600">32/40 present</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions" description="Common administrative tasks">
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200 text-left">
              <Users className="h-5 w-5 text-primary-600 mb-2" />
              <p className="font-medium text-gray-900">Add User</p>
              <p className="text-sm text-gray-500">Create new account</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200 text-left">
              <CheckCircle className="h-5 w-5 text-primary-600 mb-2" />
              <p className="font-medium text-gray-900">Generate QR</p>
              <p className="text-sm text-gray-500">Create session QR</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200 text-left">
              <FileText className="h-5 w-5 text-primary-600 mb-2" />
              <p className="font-medium text-gray-900">Export Report</p>
              <p className="text-sm text-gray-500">Download attendance</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200 text-left">
              <GraduationCap className="h-5 w-5 text-primary-600 mb-2" />
              <p className="font-medium text-gray-900">Manage Classes</p>
              <p className="text-sm text-gray-500">View all classes</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;