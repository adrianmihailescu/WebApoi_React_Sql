import type Task from "../interfaces/Task";

export type Props = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};