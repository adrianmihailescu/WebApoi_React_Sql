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

  return (
    <div className="container">
      <TaskForm onAdd={addTask} />

      {tasks.length === 0 && <p>No tasks yet.</p>}

      {tasks.length > 0 && (
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
            {tasks.map(task => (
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
