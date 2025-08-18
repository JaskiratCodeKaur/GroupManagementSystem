const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-6 py-8 transition-colors">
      {children}
    </div>
  );
};

export default DashboardLayout;
