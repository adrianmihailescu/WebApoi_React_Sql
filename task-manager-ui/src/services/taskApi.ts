import axios from "axios";

// const API_URL = "https://localhost:5001/api/tasks";
const API_URL = "http://localhost:5020/api/tasks";

export const getTasks = () => axios.get(API_URL);
export const createTask = (task: any) => axios.post(API_URL, task);
export const updateTask = (id: number, task: any) =>
  axios.put(`${API_URL}/${id}`, task);
export const deleteTask = (id: number) =>
  axios.delete(`${API_URL}/${id}`);
