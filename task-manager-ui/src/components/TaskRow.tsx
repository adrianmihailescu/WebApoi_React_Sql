import type { Props } from "../types/Props";

export default function TaskRow({ task, onToggle, onDelete }: Props) {
  return (
    <tr className={task.isCompleted ? "done-row" : ""}>
        <td>{task.id}</td>
        <td>{task.title}</td>
        <td>{task.description || "-"}</td>
        <td>{task.isCompleted ? "Completed" : "Pending"}</td>
        <td>
            <button onClick={onToggle}>Toggle</button>
            <button onClick={onDelete}>Delete</button>
        </td>
    </tr>
  );
}
