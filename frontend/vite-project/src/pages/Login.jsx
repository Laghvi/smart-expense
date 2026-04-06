import { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import ErrorCard from "../pages/ErrorCard";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleLogin = async () => {
    setError("");
    setShowRegisterPrompt(false);

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email (example@gmail.com)");
      return;
    } else {
      setEmailError("");
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setError("User not found");
          setShowRegisterPrompt(true);
        } else {
          setError(data.message || "Login failed");
        }
        setLoading(false);
        return;
      }

      // 🔥 CLEAR OLD USER + SET NEW
      localStorage.clear();
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.name);

      // 🔥 FORCE FULL RELOAD
      window.location.href = "/dashboard";

    } catch (error) {
      console.log(error);
      setError("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">

      <ErrorCard
        message={error}
        showRegister={showRegisterPrompt}
        onClose={() => {
          setError("");
          setShowRegisterPrompt(false);
        }}
        onRegister={() => (window.location.href = "/register")}
      />

      <div className="auth-box">
        <h2>YAYY!! Welcome Back</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
        />

        {emailError && <p className="input-error">{emailError}</p>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don’t have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;