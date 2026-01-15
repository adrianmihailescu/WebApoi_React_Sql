import { useState } from "react";
import "./TaskForm.css";

type Props = {
  onAdd: (title: string, description?: string) => void;
};

export default function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim().length < 3) {
        setError("Title must be at least 3 characters");
        return;
    }

    if (description.length > 500) {
        setError("Description too long");
        return;
    }
    
    if (!title.trim())
        return;

    onAdd(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={submit} className="task-form">
      <input
        placeholder="Task title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <button>Add Task</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
