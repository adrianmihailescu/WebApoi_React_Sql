import TasksPage from "./pages/TaskPage";
import AuthForm from "./components/AuthForm";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 20, textAlign: "center" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Task Management System</h1>
      {isAuthenticated ? <TasksPage /> : <AuthForm />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
