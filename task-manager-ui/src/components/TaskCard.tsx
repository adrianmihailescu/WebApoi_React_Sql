type Props = {
  task: any;
  onToggle: () => void;
  onDelete: () => void;
};

export default function TaskCard({ task, onToggle, onDelete }: Props) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <button onClick={onToggle}>
        {task.isCompleted ? "Mark Incomplete" : "Mark Complete"}
      </button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}
