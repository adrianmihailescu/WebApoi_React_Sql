import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./AuthForm.css";

export default function AuthForm() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validation
      if (!email.includes("@")) {
        setError("Please enter a valid email");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      if (!isLogin && password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }

      // Reset form on success
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      let errorMessage = "Authentication failed";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      // Handle axios errors
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosErr = err as any;
        if (axiosErr.response?.data?.message) {
          errorMessage = axiosErr.response.data.message;
        } else if (axiosErr.response?.data) {
          errorMessage = typeof axiosErr.response.data === 'string' 
            ? axiosErr.response.data 
            : JSON.stringify(axiosErr.response.data);
        } else if (axiosErr.message) {
          errorMessage = axiosErr.message;
        }
      }
      
      console.error('Auth error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />

        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
          />
        )}

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <div className="auth-toggle">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
            setPassword("");
            setConfirmPassword("");
          }}
          disabled={loading}
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </div>
    </div>
  );
}
