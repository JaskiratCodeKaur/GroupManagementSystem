import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock } from "lucide-react";
import Badge from "../Dashboard/ui/Badge";

const UpcomingEvents = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Map status to badge variant
  const statusVariant = {
    completed: "secondary",
    pending: "destructive",
    "in progress": "warning",
  };

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please login.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Adjust depending on your API response shape
        const taskList = Array.isArray(response.data.tasks)
          ? response.data.tasks
          : response.data; // fallback if tasks array not wrapped

        setTasks(taskList);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-2 max-w-3xl mx-auto">
      <h5 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4" />
        Tasks Assigned
      </h5>

      {loading ? (
        <p className="text-gray-600">Loading tasks...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No tasks assigned.</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id || task.id}
            className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">{task.title}</p>
              <p className="text-xs text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>
            <Badge
              variant={statusVariant[task.status] || "secondary"}
              className="text-xs capitalize"
            >
              {task.status}
            </Badge>
          </div>
        ))
      )}
    </div>
  );
};

export default UpcomingEvents;
