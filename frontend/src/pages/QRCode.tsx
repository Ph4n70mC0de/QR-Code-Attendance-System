import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { qrApi, sessionApi } from '../services/api';
import type { Session } from '../types';

export default function QRCodePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<number | ''>('');
  const [qrValue, setQrValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSessions = async () => {
    try {
      const response = await sessionApi.getActive();
      setSessions(response.data);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  };

  const generateQRCode = async () => {
    if (!selectedSession) {
      setError('Please select a session');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await qrApi.generate({
        session_id: typeof selectedSession === 'number' ? selectedSession : parseInt(selectedSession as string),
        valid_duration: 30, // 30 minutes
      });

      setQrValue(response.data.data?.code || '');
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">QR Code Generator</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Generation Form */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Generate QR Code</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Session
              </label>
              <select
                className="input"
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value === '' ? '' : parseInt(e.target.value))}
                onFocus={fetchSessions}
                aria-label="Select session"
              >
                <option value="">Choose a session...</option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.title}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              onClick={generateQRCode}
              disabled={loading || !selectedSession}
              className="btn btn-primary w-full"
            >
              {loading ? 'Generating...' : 'Generate QR Code'}
            </button>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">QR Code Preview</h2>

          {qrValue ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <QRCodeSVG
                  value={qrValue}
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Share this QR code with students</p>
                <p className="text-xs text-gray-500 font-mono break-all">
                  {qrValue}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Select a session and click generate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}