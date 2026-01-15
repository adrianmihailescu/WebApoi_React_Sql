import { createContext, useContext, useState, useEffect} from "react";
import type {ReactNode} from  "react"; 
import type { User } from "./../interfaces/User";
import type { AuthContextType } from "../types/AuthContextType";
import axios from "axios";

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const { authApi } = await import("../services/authApi");

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    const userData: User = {
      id: response.id,
      email: response.email,
      token: response.token,
    };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    // Set default auth header for axios
    const axios = await import("axios");
    axios.default.defaults.headers.common["Authorization"] =
      `Bearer ${response.token}`;
  };

  const register = async (email: string, password: string) => {
    const response = await authApi.register(email, password);
    const userData: User = {
      id: response.id,
      email: response.email,
      token: response.token,
    };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    const axios = await import("axios");
    axios.default.defaults.headers.common["Authorization"] =
      `Bearer ${response.token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    // const axios = require("axios");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
