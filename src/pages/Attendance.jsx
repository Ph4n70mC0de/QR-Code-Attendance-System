import { useState } from 'react';
import { Button, Input } from '../components';

/**
 * Attendance page component
 */
const Attendance = () => {
  const [attendanceData] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'present',
      time: '09:15 AM',
      date: '2024-04-02',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'late',
      time: '09:45 AM',
      date: '2024-04-02',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      status: 'absent',
      time: '-',
      date: '2024-04-02',
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice@example.com',
      status: 'present',
      time: '09:10 AM',
      date: '2024-04-02',
    },
    {
      id: 5,
      name: 'Charlie Wilson',
      email: 'charlie@example.com',
      status: 'excused',
      time: '-',
      date: '2024-04-02',
    },
  ]);

  const [filter, setFilter] = useState('all');

  const filteredData =
    filter === 'all'
      ? attendanceData
      : attendanceData.filter((item) => item.status === filter);

  const getStatusBadge = (status) => {
    const styles = {
      present:
        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      absent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      late: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      excused:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Attendance Records
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage attendance for all sessions
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export CSV
            </Button>
            <Button>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Mark Attendance
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Input
            placeholder="Search by name or email..."
            className="max-w-md"
            leftIcon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />
          <div className="flex gap-2">
            {['all', 'present', 'absent', 'late', 'excused'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  filter === status
                    ? 'bg-[#aa3bff] text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {record.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {record.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {record.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-[#aa3bff] hover:text-[#8f2ae8] dark:hover:text-[#c084fc] mr-4">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900 dark:hover:text-red-400">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">{filteredData.length}</span> of{' '}
              <span className="font-medium">{filteredData.length}</span> results
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="small" disabled>
                Previous
              </Button>
              <Button variant="secondary" size="small" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;