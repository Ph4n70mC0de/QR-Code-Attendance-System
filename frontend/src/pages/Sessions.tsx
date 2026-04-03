import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sessionApi } from '../services/api';
import type { Session } from '../types';

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await sessionApi.getActive();
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sessions</h1>
        <Link to="/sessions/new" className="btn btn-primary">
          + New Session
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No sessions found</p>
          <Link to="/sessions/new" className="btn btn-primary">
            Create Your First Session
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <div key={session.id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{session.title}</h3>
                  <p className="text-gray-600 mt-1">
                    {session.description || 'No description'}
                  </p>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Start: {new Date(session.start_time).toLocaleString()}</p>
                    <p>End: {new Date(session.end_time).toLocaleString()}</p>
                    {session.location && <p>Location: {session.location}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/sessions/${session.id}`}
                    className="btn btn-secondary text-sm"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}