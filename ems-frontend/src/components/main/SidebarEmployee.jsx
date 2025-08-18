import React from 'react';
import {
  FaThLarge,
  FaClipboardList,
  FaChartBar,
  FaCalendarCheck,
  FaCogs,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarEmployee = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/employee-dashboard', icon: FaThLarge, label: 'Dashboard' },
    { path: '/employee-tasks', icon: FaClipboardList, label: 'My Tasks' },
    { path: '/calendar', icon: FaCalendarCheck, label: 'Calendar' },
    { path: '/settings-page', icon: FaCogs, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-gray-900 dark:bg-gray-950 text-white flex flex-col border-r dark:border-gray-800">
      <div className="text-2xl font-bold text-center py-6 border-b border-gray-700 dark:border-gray-800">
        <span className="bg-gradient-to-r from-blue-400 to-emerald-500 bg-clip-text text-transparent">
          Employee MS
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition-all ${
                isActive
                  ? 'bg-blue-600 dark:bg-blue-700 text-white shadow-lg'
                  : 'hover:bg-gray-800 dark:hover:bg-gray-800/50'
              }`}
            >
              <Icon className={isActive ? 'text-white' : 'text-gray-400'} />
              <span className={isActive ? 'font-semibold' : ''}>{label}</span>
            </button>
          );
        })}
      </nav>
      
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 p-4 border-t border-gray-700 dark:border-gray-800 hover:bg-gray-800 dark:hover:bg-gray-800/50 w-full justify-center transition-colors"
      >
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
};

export default SidebarEmployee;
