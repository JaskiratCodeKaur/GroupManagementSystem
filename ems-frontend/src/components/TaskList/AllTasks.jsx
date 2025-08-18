import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../main/Sidebar';
import { useNavigate } from 'react-router-dom';

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please login.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Extract tasks and role from response
      const taskList = Array.isArray(response.data.tasks)
        ? response.data.tasks
        : [];

      setTasks(taskList);
      if (response.data.role) {
        setRole(response.data.role);
      } else {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role) setRole(user.role);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 text-black dark:text-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg dark:shadow-gray-800 border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-6">All Tasks</h1>

          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading tasks...</p>
          ) : error ? (
            <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No tasks found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-gray-200 dark:border-gray-700 rounded-md">
                <thead className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Title</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Assigned To</th>
                    {role.toLowerCase() !== 'admin' && (
                      <th className="px-4 py-3 font-semibold">Created By</th>
                    )}
                    <th className="px-4 py-3 font-semibold">Due Date</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800 dark:text-gray-200">
                  {tasks.map((task, index) => (
                    <tr
                      key={task._id}
                      className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}
                    >
                      <td className="px-4 py-4 font-medium">{task.title}</td>
                      <td className="px-4 py-4">{task.category}</td>
                      <td className="px-4 py-4">{task.assignedTo?.name || 'Unassigned'}</td>

                      {/* Only show Created By cell if NOT admin */}
                      {role.toLowerCase() !== 'admin' && (
                        <td className="px-4 py-4">{task.createdBy?.name || 'N/A'}</td>
                      )}

                      <td className="px-4 py-4">{new Date(task.dueDate).toLocaleDateString()}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            task.status === 'completed'
                              ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
                              : task.status === 'in progress'
                              ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400'
                              : task.status === 'declined'
                              ? 'bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-400'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {task.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {task.status === 'completed' && (
                          <button
                            onClick={() => navigate(`/admin/tasks/${task._id}`)}
                            className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded transition-colors"
                          >
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllTasks;
