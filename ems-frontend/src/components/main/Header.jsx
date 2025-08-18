import React, { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ onLogout, onCreateMember, onCreateTask }) => {
  const [userName, setUserName] = useState('');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.name);
    }
  }, []);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex items-center justify-between transition-colors">
      <div className="flex items-center space-x-3">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">EMS</div>
        <div className="text-gray-600 dark:text-gray-400">Admin Dashboard</div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
        </button>
        
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">Welcome back,</div>
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">{userName || 'User'}</div>
        </div>

        <button onClick={onCreateMember} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Create Member
        </button>
        <button onClick={onCreateTask} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Create Task
        </button>
        <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
