import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarEmployee from '../main/SidebarEmployee';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import {
  FaTasks, FaCheckCircle, FaSpinner, FaHourglassEnd,
} from 'react-icons/fa';

const COLORS = ['#fbbf24', '#3b82f6', '#10b981'];

const EmployeeDashboard = () => {
  const [user, setUser] = useState(null);
  const [taskCount, setTaskCount] = useState(0);
  const [taskStatusData, setTaskStatusData] = useState([]);
  const [taskTrends, setTaskTrends] = useState([]);
  const [overdueCount, setOverdueCount] = useState(0);
  const [todayTasks, setTodayTasks] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 'employee') {
        setUser(parsedUser);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      try {
        const tasksRes = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tasks = Array.isArray(tasksRes.data) ? tasksRes.data : [];
        const userTasks = tasks.filter(task => task.assignedTo === user._id);

        setTaskCount(userTasks.length);

        const statusCounts = userTasks.reduce((acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        }, {});
        setTaskStatusData([
          { name: 'Pending', value: statusCounts['pending'] || 0 },
          { name: 'In Progress', value: statusCounts['in-progress'] || 0 },
          { name: 'Completed', value: statusCounts['completed'] || 0 },
        ]);

        const now = new Date();
        const today = now.toISOString().split('T')[0];

        const overdue = userTasks.filter(task => new Date(task.dueDate) < now && task.status !== 'completed');
        setOverdueCount(overdue.length);

        const todayCount = userTasks.filter(task => task.dueDate?.startsWith(today)).length;
        setTodayTasks(todayCount);

        const trends = {};
        userTasks.forEach(task => {
          const date = new Date(task.createdAt).toLocaleDateString();
          trends[date] = (trends[date] || 0) + 1;
        });
        setTaskTrends(Object.entries(trends).map(([date, count]) => ({ date, count })));

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    if (user) fetchStats();
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarEmployee />
      <main className="flex-1 p-6 overflow-y-auto flex flex-col xl:flex-row">
        {/* Main Left Section */}
        <div className="flex-1 xl:pr-6">
          {/* Welcome Banner */}
          <div className="bg-white p-6 rounded-xl shadow mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Hello, {user.name}</h2>
              <p className="text-sm text-gray-500">You have {todayTasks} task{todayTasks !== 1 ? 's' : ''} today</p>
              <button className="mt-2 px-4 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
                View Task
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            <SummaryCard icon={<FaTasks />} label="Total Tasks" value={taskCount} color="indigo" />
            <SummaryCard icon={<FaCheckCircle />} label="Completed" value={taskStatusData.find(t => t.name === 'Completed')?.value || 0} color="green" />
            <SummaryCard icon={<FaSpinner />} label="In Progress" value={taskStatusData.find(t => t.name === 'In Progress')?.value || 0} color="blue" />
            <SummaryCard icon={<FaHourglassEnd />} label="Overdue" value={overdueCount} color="red" />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-white p-4 rounded-xl shadow">
              <h4 className="text-md font-semibold text-gray-700 mb-4">Task Summary</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={taskStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-white p-4 rounded-xl shadow">
              <h4 className="text-md font-semibold text-gray-700 mb-4">Task Activity</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={taskTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Optional Right Panel (Calendar, Schedule, Reminder) */}
        <div className="hidden xl:block w-80 ml-6 space-y-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h4 className="font-semibold text-gray-700 mb-2">Calendar</h4>
            <div className="text-gray-400 text-sm text-center py-8">📅 Calendar Placeholder</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h4 className="font-semibold text-gray-700 mb-2">Schedule</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>🕘 Team Stand-up – 9:00 AM</li>
              <li>💼 Client Sync – 1:00 PM</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h4 className="font-semibold text-gray-700 mb-2">Reminders</h4>
            <p className="text-sm text-gray-500">Submit your weekly report by 5 PM</p>
          </div>
        </div>
      </main>
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
    <div className={`text-3xl text-${color}-500`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className="text-xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

export default EmployeeDashboard;
