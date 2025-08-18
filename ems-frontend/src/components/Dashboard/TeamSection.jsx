import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMailBulk, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [tasks, setTasks] = useState([]); // New state to hold tasks
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');

        // Fetch team members
        const membersRes = await axios.get('http://localhost:5000/api/auth/members', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch tasks
        const tasksRes = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTeamMembers(membersRes.data || []);
        setTasks(tasksRes.data.tasks || []);
        setError('');
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-gray-600 dark:text-gray-400">Loading team members...</p>;
  if (error) return <p className="text-red-500 dark:text-red-400">{error}</p>;

  // Helper to count tasks assigned to a member
  const countTasksForMember = (memberId) => {
    return tasks.filter(task => task.assignedTo?._id === memberId).length;
  };

  return (
    <section className="bg-white dark:bg-gray-900 rounded-2xl shadow dark:shadow-gray-800 p-6 max-w-3xl mx-auto border dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">My Team</h2>
        <button
          onClick={() => navigate('/create-member')}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-emerald-600 rounded-md hover:from-indigo-600 hover:to-emerald-700 transition-all"
        >
          <FaPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>
      {teamMembers.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500">No team members found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {teamMembers.map((member) => (
            <div
              key={member._id || member.id}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:shadow-lg dark:hover:shadow-gray-700 transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="inline-block rounded-full bg-gray-200 dark:bg-gray-700 w-12 h-12 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-semibold text-lg">
                      {member.name
                        ? member.name.split(' ').map(n => n[0]).join('')
                        : 'NA'}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{member.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{member.role || 'Employee'}</p>
                  </div>
                </div>
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {countTasksForMember(member._id || member.id)} tasks
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1 truncate max-w-[120px]">
                  <FaMailBulk className="w-3 h-3" />
                  <span>{member.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default TeamSection;
