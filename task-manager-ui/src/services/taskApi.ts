import axios from "axios";
import type Task from "../interfaces/Task";

const api = axios.create({
  baseURL: "http://localhost:5020/api"
});

export const getTasks = () => api.get<Task[]>("/tasks");
export const createTask = (task: Omit<Task, "id">) =>
  api.post("/tasks", task);
export const updateTask = (task: Task) =>
  api.put(`/tasks/${task.id}`, task);
export const deleteTask = (id: number) =>
  api.delete(`/tasks/${id}`);
export const reorderTasks = (ids: number[]) =>
  api.put("/tasks/reorder", ids);
