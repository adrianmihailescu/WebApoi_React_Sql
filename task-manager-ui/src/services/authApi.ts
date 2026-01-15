import axios from "axios";
import type { AuthResponse } from "../interfaces/AuthResponse";

const API_URL = "http://localhost:5020/api/Auth";

export const authApi = {
  register: async (email: string, password: string): Promise<AuthResponse> => {
    console.log(`authApi: ${email} ${password}`);
    console.log(API_URL);
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email,
        password,
      });
      console.log("Register response:", response.data);
      return response.data;
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosErr = error as any;
        console.error("Register error response:", axiosErr.response?.status, axiosErr.response?.data);
      }
      throw error;
    }
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      console.log("Login response:", response.data);
      return response.data;
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosErr = error as any;
        console.error("Login error response:", axiosErr.response?.status, axiosErr.response?.data);
      }
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    // Optional: notify backend of logout
    await axios.post(`${API_URL}/logout`).catch(() => {
      // Ignore errors on logout
    });
  },
};
