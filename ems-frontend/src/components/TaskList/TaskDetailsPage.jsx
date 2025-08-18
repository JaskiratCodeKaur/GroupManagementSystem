import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SidebarEmployee from '../main/SidebarEmployee';

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [note, setNote] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);

  const fetchTask = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTask(response.data);
      setNote(response.data.notes || '');
      setAttachments(response.data.attachments || []);

      // If the task is responded to
      if (['in progress', 'completed', 'declined'].includes(response.data.status)) {
        setHasResponded(true);
      }
    } catch (err) {
      console.error('Failed to fetch task:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const handleAction = async (action) => {
    const token = localStorage.getItem('token');
    const statusMap = {
      accept: 'in progress',
      complete: 'completed',
      decline: 'declined',
    };

    const status = statusMap[action];
    if (!status) return;

    try {
      setActionInProgress(true);

      const formData = new FormData();
      formData.append('status', status);
      formData.append('notes', note);
      attachments.forEach((file) => formData.append('attachments', file));

      await axios.patch(
        `http://localhost:5000/api/tasks/${taskId}/status`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      await fetchTask(); // Refresh task with updated data
      if (action === 'complete') {
        setHasResponded(true);
      }
    } catch (err) {
      console.error('Failed to update task status:', err);
    } finally {
      setActionInProgress(false);
    }
  };

  const handleFileChange = (e) => {
    setAttachments([...e.target.files]);
  };

  const isCompleted = task?.status === 'completed';

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
        <SidebarEmployee />
        <main className="flex-1 flex items-center justify-center text-lg text-gray-600 dark:text-gray-400">
          Loading task details...
        </main>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
        <SidebarEmployee />
        <main className="flex-1 flex items-center justify-center text-lg text-red-600 dark:text-red-400">
          Failed to load task. Please try again later.
        </main>
      </div>
    );
  }

  const assignedByText =
    typeof task.createdBy === 'object'
      ? task.createdBy.name || 'N/A'
      : task.createdBy || 'N/A';

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
      <SidebarEmployee />
      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Task Details</h2>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow dark:shadow-gray-800 space-y-4 mb-6 border dark:border-gray-700">
          <p className="text-gray-900 dark:text-gray-100"><strong>Title:</strong> {task.title}</p>
          <p className="text-gray-900 dark:text-gray-100"><strong>Description:</strong> {task.description}</p>
          <p className="text-gray-900 dark:text-gray-100"><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
          <p className="text-gray-900 dark:text-gray-100"><strong>Status:</strong> <span className="capitalize">{task.status}</span></p>
          <p className="text-gray-900 dark:text-gray-100"><strong>Category:</strong> {task.category || 'N/A'}</p>
          <p className="text-gray-900 dark:text-gray-100"><strong>Assigned By:</strong> {assignedByText}</p>
        </div>

        {/* Notes Section */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow dark:shadow-gray-800 mb-6 border dark:border-gray-700">
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Notes / Comments:</label>
          <textarea
            disabled={isCompleted}
            className="w-full border border-gray-300 dark:border-gray-600 rounded p-3 text-gray-800 dark:text-gray-100 disabled:opacity-60 bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500"
            rows="4"
            placeholder="Write your notes or summary here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* File Upload / View Section */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow dark:shadow-gray-800 mb-6 border dark:border-gray-700">
          <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
            {isCompleted ? 'Submitted Attachments:' : 'Attach Files:'}
          </label>

          {isCompleted ? (
            task.attachments && task.attachments.length > 0 ? (
              <ul className="list-disc list-inside text-blue-600 dark:text-blue-400">
                {task.attachments.map((fileUrl, idx) => (
                  <li key={idx}>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700 dark:hover:text-blue-300">
                      {fileUrl.split('/').pop()}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No attachments submitted.</p>
            )
          ) : (
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded px-3 py-2"
              disabled={isCompleted}
            />
          )}
        </div>

        {/* Action Buttons */}
        {!isCompleted && (
          <div className="flex space-x-4 mb-4">
            {!hasResponded ? (
              <>
                <button
                  onClick={() => handleAction('accept')}
                  disabled={actionInProgress}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-6 py-2 rounded-xl font-medium disabled:opacity-50 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAction('decline')}
                  disabled={actionInProgress}
                  className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white px-6 py-2 rounded-xl font-medium disabled:opacity-50 transition-colors"
                >
                  Decline
                </button>
              </>
            ) : (
              task.status === 'in progress' && (
                <button
                  onClick={() => handleAction('complete')}
                  disabled={actionInProgress}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-6 py-2 rounded-xl font-medium disabled:opacity-50 transition-colors"
                >
                  Mark as Complete
                </button>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TaskDetailsPage;
