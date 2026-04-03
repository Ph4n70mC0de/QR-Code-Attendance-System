/**
 * Scanner Page
 * Camera-based QR code scanner for attendance
 */
import { useState, useRef, useEffect } from 'react';
import { CameraIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Html5Qrcode } from 'html5-qrcode';
import DashboardLayout from '../components/layout/DashboardLayout';
import AttendanceService from '../services/attendance.service';
import toast from 'react-hot-toast';

const Scanner = () => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const html5QrCodeRef = useRef(null);

  // Request camera permissions and list cameras on mount
  useEffect(() => {
    const initCameras = async () => {
      try {
        // Request camera permission first
        await navigator.mediaDevices.getUserMedia({ video: true });
        
        const cameras = await Html5Qrcode.getCameras();
        setCameras(cameras);
        if (cameras.length > 0) {
          // Prefer back camera on mobile devices
          const backCamera = cameras.find(c => 
            c.label.toLowerCase().includes('back') || 
            c.label.toLowerCase().includes('environment')
          );
          setSelectedCamera(backCamera?.id || cameras[0].id);
        }
      } catch (error) {
        console.error('Camera access error:', error);
        toast.error('Camera access denied. Please allow camera permissions.');
      }
    };

    initCameras();

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    if (!selectedCamera) {
      toast.error('No camera selected');
      return;
    }

    try {
      html5QrCodeRef.current = new Html5Qrcode('scanner-container');
      
      await html5QrCodeRef.current.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        onScanSuccess,
        onScanError
      );
      
      setScanning(true);
      setScanResult(null);
      toast.success('Scanner started');
    } catch (error) {
      console.error('Scanner start error:', error);
      toast.error('Failed to start scanner: ' + error.message);
    }
  };

  const stopScanner = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
        setScanning(false);
      }).catch((error) => {
        console.error('Failed to stop scanner:', error);
      });
    } else {
      setScanning(false);
    }
  };

  const onScanSuccess = async (decodedText) => {
    // Stop scanning after successful scan
    stopScanner();
    
    try {
      const result = await AttendanceService.scanAttendance({
        qr_token: decodedText,
        status: 'time-in',
      });
      
      setScanResult({
        success: true,
        message: 'Attendance recorded successfully!',
        data: result,
      });
      toast.success('Attendance recorded!');
    } catch (error) {
      setScanResult({
        success: false,
        message: error.response?.data?.detail || 'Failed to record attendance',
      });
      toast.error('Failed to record attendance');
    } finally {
      // Done
    }
  };

  const onScanError = (error) => {
    // Ignore scanning errors - they happen frequently when no QR is detected
    if (error?.message?.includes('QR code not found')) {
      return;
    }
    console.warn('Scan error:', error);
  };

  const resetScanner = () => {
    setScanResult(null);
    startScanner();
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">QR Scanner</h1>
          <p className="text-gray-500 mt-1">
            Scan a QR code to mark your attendance.
          </p>
        </div>

        {/* Camera Selection */}
        {!scanning && !scanResult && cameras.length > 1 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Camera
            </label>
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {cameras.map((camera) => (
                <option key={camera.id} value={camera.id}>
                  {camera.label || `Camera ${camera.id.slice(0, 8)}...`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Scanner Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {!scanResult ? (
            <>
              {/* Camera View */}
              <div id="scanner-container" className="bg-gray-900" style={{ minHeight: '400px' }}></div>
              
              {/* Controls */}
              <div className="p-4">
                {!scanning ? (
                  <button
                    onClick={startScanner}
                    className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <CameraIcon className="h-5 w-5 mr-2" />
                    Start Scanner
                  </button>
                ) : (
                  <button
                    onClick={stopScanner}
                    className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Stop Scanner
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Scan Result */
            <div className="p-8">
              <div className="text-center">
                {scanResult.success ? (
                  <>
                    <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Success!
                    </h2>
                    <p className="text-gray-600 mb-4">{scanResult.message}</p>
                    {scanResult.data && (
                      <div className="bg-green-50 p-4 rounded-lg text-left">
                        <p className="text-sm text-gray-600">
                          <strong>Time:</strong>{' '}
                          {new Date(scanResult.data.timestamp).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Status:</strong> {scanResult.data.status}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Failed
                    </h2>
                    <p className="text-gray-600 mb-4">{scanResult.message}</p>
                  </>
                )}

                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={resetScanner}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Scan Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Point your camera at the QR code</li>
            <li>• Hold steady until the code is recognized</li>
            <li>• Attendance will be recorded automatically</li>
            <li>• Make sure you have good lighting</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Scanner;