import React from 'react';
import {
  FaTasks,
  FaUserPlus,
  FaUsers,
  FaCalendarCheck,
  FaBuilding,
  FaCogs,
  FaSignOutAlt,
  FaThLarge,
  FaPlus,
  FaHistory,
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/admin-dashboard', icon: FaThLarge, label: 'Dashboard' },
    { path: '/calendar', icon: FaCalendarCheck, label: 'Calendar' },
    { path: '/create-task', icon: FaPlus, label: 'Create Task' },
    { path: '/create-member', icon: FaUserPlus, label: 'Add Member' },
    { path: '/view-members', icon: FaBuilding, label: 'Employees' },
    { path: '/all-tasks', icon: FaTasks, label: 'Tasks' },
    { path: '/settings', icon: FaCogs, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-gray-900 dark:bg-gray-950 text-white flex flex-col border-r border-gray-800 dark:border-gray-900">
      <div className="text-2xl font-bold text-center py-6 border-b border-gray-800 dark:border-gray-900 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
        Employee MS
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'hover:bg-gray-800 dark:hover:bg-gray-900 text-gray-300'
              }`}
            >
              <Icon className={isActive ? 'text-white' : 'text-gray-400'} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 p-4 border-t border-gray-800 dark:border-gray-900 hover:bg-gray-800 dark:hover:bg-gray-900 w-full justify-center transition-colors text-red-400 hover:text-red-300"
      >
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;
