import type { DraggableProvided } from "@hello-pangea/dnd";

export default interface Task {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  provided: DraggableProvided;
}