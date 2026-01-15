import type { Props } from "../types/Props";

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <div className="task-card">
      <div>
        <h3 className={task.isCompleted ? "done" : ""}>
          {task.title}
        </h3>
        {task.description && <p>{task.description}</p>}
      </div>

      <div className="actions">
        <button onClick={onToggle}>
          {task.isCompleted ? "Undo" : "Done"}
        </button>
        <button className="danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
