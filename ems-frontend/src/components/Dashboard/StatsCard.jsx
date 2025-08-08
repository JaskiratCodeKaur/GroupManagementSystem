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
        return "border-green-300 bg-green-50";
      case "warning":
        return "border-yellow-300 bg-yellow-50";
      case "destructive":
        return "border-red-300 bg-red-50";
      default:
        return "border-indigo-300 bg-indigo-50";
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case "success":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "destructive":
        return "text-red-600 bg-red-100";
      default:
        return "text-indigo-600 bg-indigo-100";
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

  if (loading) return <div className="p-5">Loading...</div>;
  if (error) return <div className="p-5 text-red-500">{error}</div>;

  return (
    <div
      className={cn(
        "stat-card border rounded-xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow min-w-[280px]",
        getVariantStyles()
      )}
    >
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
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
