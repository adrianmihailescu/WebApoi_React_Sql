import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskApi";

import type Task from "../interfaces/Task";
import TaskRow from "../components/TaskRow";
import TaskForm from "../components/TaskForm";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] =
    useState<"all" | "pending" | "completed">("all");
  const [search, setSearch] = useState("");

  const loadTasks = async () => {
    const res = await getTasks();
    setTasks(res.data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (title: string, description?: string) => {
    await createTask({
      title,
      description,
      isCompleted: false
    });
    loadTasks();
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && task.isCompleted) ||
      (statusFilter === "pending" && !task.isCompleted);

    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description ?? "").toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="container">
      <TaskForm onAdd={addTask} />

      <div className="filters">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={e =>
            setStatusFilter(e.target.value as "all" | "pending" | "completed")
          }
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {filteredTasks.length === 0 && <p>No matching tasks.</p>}

      {filteredTasks.length > 0 && (
        <table className="task-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={() =>
                  updateTask({
                    ...task,
                    isCompleted: !task.isCompleted
                  }).then(loadTasks)
                }
                onDelete={() =>
                  deleteTask(task.id).then(loadTasks)
                }
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
