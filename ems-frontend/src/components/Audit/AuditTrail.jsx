import { useState, useEffect } from 'react';
import axios from 'axios';

const AuditTrail = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 50,
    resourceType: '',
    action: '',
    search: '',
    startDate: '',
    endDate: '',
  });
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const resourceTypes = ['USER', 'TASK', 'DEPARTMENT', 'AUTH', 'SYSTEM'];
  const actions = ['LOGIN', 'LOGOUT', 'CREATE', 'READ', 'UPDATE', 'DELETE', 'ACCESS'];

  useEffect(() => {
    fetchAuditLogs();
    fetchStats();
  }, [filters.page, filters.limit]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Build query params
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const response = await axios.get(
        `http://localhost:5000/api/audit?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLogs(response.data.logs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      alert('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/audit/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching audit stats:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const applyFilters = () => {
    fetchAuditLogs();
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 50,
      resourceType: '',
      action: '',
      search: '',
      startDate: '',
      endDate: '',
    });
    setTimeout(fetchAuditLogs, 100);
  };

  const exportLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filters.resourceType) params.append('resourceType', filters.resourceType);
      if (filters.action) params.append('action', filters.action);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await axios.get(
        `http://localhost:5000/api/audit/export?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit-logs-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting logs:', error);
      alert('Failed to export audit logs');
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

  const getActionBadgeColor = (action) => {
    const colors = {
      LOGIN: 'bg-green-100 text-green-800',
      LOGOUT: 'bg-gray-100 text-gray-800',
      CREATE: 'bg-blue-100 text-blue-800',
      READ: 'bg-emerald-100 text-emerald-800',
      UPDATE: 'bg-yellow-100 text-yellow-800',
      DELETE: 'bg-red-100 text-red-800',
      ACCESS: 'bg-indigo-100 text-indigo-800',
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Audit Trail</h1>
              <p className="text-gray-600 mt-2">
                Complete record of system access and user activities
              </p>
            </div>
            <button
              onClick={exportLogs}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              📥 Export CSV
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600">Total Logs</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalLogs}</div>
              <div className="text-xs text-gray-500">{stats.period}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600">Recent Activity</div>
              <div className="text-2xl font-bold text-blue-600">{stats.recentActivity}</div>
              <div className="text-xs text-gray-500">Last 24 hours</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600">Top Action</div>
              <div className="text-2xl font-bold text-emerald-600">
                {stats.actionBreakdown[0]?.action || 'N/A'}
              </div>
              <div className="text-xs text-gray-500">
                {stats.actionBreakdown[0]?.count || 0} times
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600">Active Users</div>
              <div className="text-2xl font-bold text-green-600">
                {stats.topUsers?.length || 0}
              </div>
              <div className="text-xs text-gray-500">Making changes</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex justify-between items-center text-left font-semibold text-gray-700"
          >
            <span>🔍 Filters</span>
            <span>{showFilters ? '▲' : '▼'}</span>
          </button>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="border rounded px-3 py-2"
              />

              <select
                value={filters.resourceType}
                onChange={(e) => handleFilterChange('resourceType', e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="">All Resources</option>
                {resourceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={filters.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="">All Actions</option>
                {actions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>

              <input
                type="date"
                placeholder="Start Date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="border rounded px-3 py-2"
              />

              <input
                type="date"
                placeholder="End Date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="border rounded px-3 py-2"
              />

              <div className="flex gap-2">
                <button
                  onClick={applyFilters}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                >
                  Apply
                </button>
                <button
                  onClick={clearFilters}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading audit logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              No audit logs found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Timestamp</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">User</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Action</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Resource</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Details</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {logs.map((log) => (
                      <tr key={log._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(log.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                          <div className="text-xs text-gray-500">{log.userEmail}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getActionBadgeColor(log.action)}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">{log.resourceType}</div>
                          {log.resourceName && (
                            <div className="text-xs text-gray-500">{log.resourceName}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <div className="text-xs">{log.endpoint}</div>
                          <div className="text-xs text-gray-400">{log.method}</div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {log.ipAddress || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-gray-50 px-4 py-3 border-t flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {filters.page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
                    disabled={filters.page === 1}
                    className="px-3 py-1 bg-white border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handleFilterChange('page', Math.min(totalPages, filters.page + 1))}
                    disabled={filters.page === totalPages}
                    className="px-3 py-1 bg-white border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
