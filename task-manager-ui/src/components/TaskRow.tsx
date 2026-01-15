import { updateTask, deleteTask } from "../services/taskApi";
import type { TaskRowProps } from "../interfaces/TaskRowProps";

export default function TaskRow({
  task,
  index,
  provided,
  isDragging,
  onTaskUpdate,
}: TaskRowProps) {
  return (
    <tr
      ref={provided.innerRef}
      {...provided.draggableProps}
      style={{
        ...provided.draggableProps.style,
        background: isDragging ? "#f0f0f0" : "white",
      }}
    >
      <td {...provided.dragHandleProps}>☰</td>
      <td>{index + 1}</td>
      <td>{task.title}</td>
      <td>{task.description}</td>
      <td>
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() =>
            updateTask({
              ...task,
              isCompleted: !task.isCompleted,
            }).then(onTaskUpdate)
          }
        />
      </td>
      <td>
        <button onClick={() => deleteTask(task.id).then(onTaskUpdate)}>
          Delete
        </button>
      </td>
    </tr>
  );
}
