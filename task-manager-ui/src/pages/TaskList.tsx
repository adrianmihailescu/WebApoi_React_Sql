import { useEffect, useState } from "react";
import { getTasks, updateTask, deleteTask } from "../services/taskApi";
import TaskCard from "../components/TaskCard";

export default function TaskList() {
  const [tasks, setTasks] = useState<any[]>([]);

  const loadTasks = async () => {
    const res = await getTasks();
    setTasks(res.data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <>
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={() =>
            updateTask(task.id, { ...task, isCompleted: !task.isCompleted })
              .then(loadTasks)
          }
          onDelete={() => deleteTask(task.id).then(loadTasks)}
        />
      ))}
    </>
  );
}
