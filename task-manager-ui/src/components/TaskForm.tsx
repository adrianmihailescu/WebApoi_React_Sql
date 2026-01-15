import { useState } from "react";

type Props = {
  onAdd: (title: string, description?: string) => void;
};

export default function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

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
    </form>
  );
}
