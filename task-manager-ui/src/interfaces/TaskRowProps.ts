import type { DraggableProvided } from "@hello-pangea/dnd";
import type Task from "./Task";

export interface TaskRowProps {
  task: Task;
  index: number;
  provided: DraggableProvided;
  isDragging: boolean;
  onTaskUpdate: () => void;
}