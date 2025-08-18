import React, { useState } from 'react';
import SidebarEmployee from '../main/SidebarEmployee';

const SettingsEmployee = () => {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    password: '',
    notifications: true,
    darkMode: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit settings update logic here
    console.log('Updated settings:', formData);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <SidebarEmployee />
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md dark:shadow-gray-800 border dark:border-gray-700">
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="notifications"
              checked={formData.notifications}
              onChange={handleChange}
              className="mr-2 w-4 h-4"
            />
            <label className="font-medium text-gray-700 dark:text-gray-300">Enable Notifications</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="darkMode"
              checked={formData.darkMode}
              onChange={handleChange}
              className="mr-2 w-4 h-4"
            />
            <label className="font-medium text-gray-700 dark:text-gray-300">Dark Mode</label>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsEmployee;
