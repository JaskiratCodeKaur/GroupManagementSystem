import { useState, useEffect } from 'react';
import axios from 'axios';

const MyActivity = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMyLogs();
  }, [page]);

  const fetchMyLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `http://localhost:5000/api/audit/me?page=${page}&limit=20`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLogs(response.data.logs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      alert('Failed to fetch your activity');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionIcon = (action) => {
    const icons = {
      LOGIN: '🔐',
      LOGOUT: '🚪',
      CREATE: '➕',
      READ: '👁️',
      UPDATE: '✏️',
      DELETE: '🗑️',
      ACCESS: '🔍',
    };
    return icons[action] || '📝';
  };

  const getActionColor = (action) => {
    const colors = {
      LOGIN: 'text-green-600',
      LOGOUT: 'text-gray-600',
      CREATE: 'text-blue-600',
      READ: 'text-emerald-600',
      UPDATE: 'text-yellow-600',
      DELETE: 'text-red-600',
      ACCESS: 'text-indigo-600',
    };
    return colors[action] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Activity</h1>
          <p className="text-gray-600 mt-2">
            View your recent actions and system access history
          </p>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading your activity...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              No activity recorded yet
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {logs.map((log, index) => (
                  <div
                    key={log._id}
                    className="flex items-start gap-4 p-4 border-l-4 border-blue-500 bg-gray-50 rounded-r-lg hover:bg-gray-100 transition"
                  >
                    <div className={`text-3xl ${getActionColor(log.action)}`}>
                      {getActionIcon(log.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {log.action} - {log.resourceType}
                          </h3>
                          {log.resourceName && (
                            <p className="text-sm text-gray-600 mt-1">
                              {log.resourceName}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {log.endpoint} ({log.method})
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            {formatDate(log.createdAt)}
                          </div>
                          {log.ipAddress && (
                            <div className="text-xs text-gray-400 mt-1">
                              IP: {log.ipAddress}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {log.metadata?.responseTime && (
                        <div className="mt-2 text-xs text-gray-500">
                          Response time: {log.metadata.responseTime}ms
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <div className="text-sm text-gray-700">
                  Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">ℹ️</div>
            <div>
              <h3 className="font-semibold text-blue-900">About Activity Logs</h3>
              <p className="text-sm text-blue-800 mt-1">
                This page shows all your actions in the system. Every time you log in, view records, 
                create or update tasks, it's automatically recorded here for transparency and security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyActivity;
