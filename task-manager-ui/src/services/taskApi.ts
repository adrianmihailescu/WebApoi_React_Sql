import axios from "axios";
import type Task from "../interfaces/Task";

// const API_URL = "https://localhost:5001/api/tasks";
// todo fix the problem with https
// dotnet dev-certs https --clean
// dotnet dev-certs https --trust
// const API_URL = "http://localhost:5020/api/tasks";
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
