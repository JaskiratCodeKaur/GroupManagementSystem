import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/main/Sidebar';
import { useNavigate } from 'react-router-dom';

const ViewMembers = () => {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/members', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Members:', response.data);
        setMembers(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching members:', err);
        setError(err.response?.data?.message || 'Failed to fetch members');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-6">Team Members</h2>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading members...</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="min-w-full table-auto">
              <thead className="bg-emerald-100 dark:bg-emerald-900/30">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-emerald-700 dark:text-emerald-400">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-emerald-700 dark:text-emerald-400">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-emerald-700 dark:text-emerald-400">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-emerald-700 dark:text-emerald-400">Department</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-emerald-700 dark:text-emerald-400">Created At</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                  <tr key={member.id || index} className="border-t border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 font-medium">{member.name}</td>
                    <td className="px-6 py-4">{member.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 capitalize">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {member.department?.name || member.Department?.name || 
                        <span className="text-gray-500 dark:text-gray-500 italic">Not Assigned</span>
                      }
                    </td>
                    <td className="px-6 py-4">{new Date(member.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {members.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-lg font-medium">No members found</p>
                        <p className="text-sm mt-1">Create your first team member to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewMembers;
