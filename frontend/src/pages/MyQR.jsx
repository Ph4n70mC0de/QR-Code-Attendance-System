/**
 * My QR Code Page
 * Display user's personal QR code for attendance
 */
import { useState, useEffect } from 'react';
import { ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../components/layout/DashboardLayout';
import QRService from '../services/qr.service';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MyQR = () => {
  const { user } = useAuth();
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchQRCode = async () => {
    try {
      const data = await QRService.getMyQRCode();
      setQrData(data);
    } catch {
      toast.error('Failed to load QR code');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRCode();
  }, []);

  const handleRefresh = async () => {
    if (!window.confirm('Are you sure you want to refresh your QR code? This will invalidate your current QR code.')) {
      return;
    }

    setRefreshing(true);
    try {
      await QRService.refreshQRCode();
      toast.success('QR code refreshed successfully');
      fetchQRCode();
    } catch {
      toast.error('Failed to refresh QR code');
    } finally {
      setRefreshing(false);
    }
  };

  const handleDownload = () => {
    if (qrData?.qr_image) {
      const link = document.createElement('a');
      link.href = qrData.qr_image;
      link.download = `qr-code-${user?.name || 'user'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My QR Code</h1>
          <p className="text-gray-500 mt-1">
            Show this QR code to mark your attendance.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center">
            {/* QR Code Image */}
            <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
              {qrData?.qr_image ? (
                <img
                  src={qrData.qr_image}
                  alt="Your QR Code"
                  className="w-64 h-64 object-contain"
                />
              ) : (
                <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No QR code available</span>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>

            {/* Token Info */}
            {qrData?.token && (
              <div className="w-full mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">QR Token</p>
                <p className="font-mono text-sm break-all text-gray-700">
                  {qrData.token}
                </p>
              </div>
            )}

            {/* Expiry Info */}
            {qrData?.expires_at && (
              <div className="w-full mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This QR code expires at{' '}
                  {new Date(qrData.expires_at).toLocaleString()}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleDownload}
                disabled={!qrData?.qr_image}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Download
              </button>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-50"
              >
                <ArrowPathIcon className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Show this QR code to the scanner/instructor</li>
            <li>• The QR code is time-limited and will expire</li>
            <li>• Click "Refresh" to generate a new QR code if needed</li>
            <li>• You can download the QR code for offline use</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyQR;