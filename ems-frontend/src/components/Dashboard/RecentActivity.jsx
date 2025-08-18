const RecentActivity = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md dark:shadow-gray-800 p-6 border dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Recent Activity</h2>
      <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
        <li>User John completed task “Design Logo”</li>
        <li>Alice joined the platform</li>
        <li>Server backup completed</li>
      </ul>
    </div>
  );
};

export default RecentActivity;
