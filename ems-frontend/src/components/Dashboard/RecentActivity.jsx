const RecentActivity = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Recent Activity</h2>
      <ul className="space-y-3 text-sm text-gray-600">
        <li>User John completed task “Design Logo”</li>
        <li>Alice joined the platform</li>
        <li>Server backup completed</li>
      </ul>
    </div>
  );
};

export default RecentActivity;
