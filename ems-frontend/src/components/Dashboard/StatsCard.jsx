import React, { useEffect, useState } from "react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const StatsCard = ({
  title,
  icon: Icon,
  variant = "default",
  statKey, // e.g. 'totalTasks', 'completed', 'inProgress', 'overdue'
}) => {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20";
      case "warning":
        return "border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20";
      case "destructive":
        return "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20";
      default:
        return "border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20";
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case "success":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/40";
      case "destructive":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40";
      default:
        return "text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40";
    }
  };

  useEffect(() => {
    const fetchAndCalculate = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tasksData = await response.json();
        const tasks = tasksData.tasks || tasksData || [];

        const now = new Date();

        let val = 0;
        switch (statKey) {
          case "totalTasks":
            val = tasks.length;
            break;
          case "completed":
            val = tasks.filter(t => t.status === "completed").length;
            break;
          case "inProgress":
            val = tasks.filter(t => t.status === "in progress").length;
            break;
          case "overdue":
            val = tasks.filter(t => new Date(t.dueDate) < now && t.status !== "completed").length;
            break;
          default:
            val = 0;
        }

        setValue(val);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculate();
  }, [statKey]);

  if (loading) return <div className="p-5 text-gray-600 dark:text-gray-400">Loading...</div>;
  if (error) return <div className="p-5 text-red-500 dark:text-red-400">{error}</div>;

  return (
    <div
      className={cn(
        "stat-card border rounded-xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow min-w-[280px]",
        getVariantStyles()
      )}
    >
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      </div>
      <div
        className={cn(
          "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
          getIconStyles()
        )}
      >
        {Icon && <Icon className="w-6 h-6" />}
      </div>
    </div>
  );
};

export default StatsCard;
