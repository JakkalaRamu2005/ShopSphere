import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import "./login.css";
// import axios from "axios";
import { useNavigate, Link, Navigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";
import { API_BASE_URL } from "../../config/api";


function Login() {
  const { setIsLoggedIn, isLoggedIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    const result = await login(form);
    if (result.success) {
      setMsg("Login successful! Welcome back.");
      navigate("/");
    } else {
      setMsg(result.message);
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setMsg("");
      const response = await fetch(`${API_BASE_URL}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        navigate("/");
      } else {
        setMsg(data.message || "Google login failed");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setMsg("An error occurred during Google login");
    }
  };

  const handleGoogleError = () => {
    setMsg("Google login was unsuccessful. Try again.");
  };
  return (

    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            placeholder="Email"
            id="email"
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            value={form.password}
            placeholder="Password"
            type="password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <button type="submit">Login</button>
        {msg && <p className="message">{msg}</p>}

        <div className="login-divider">
          <span>OR</span>
        </div>

        <div className="google-login-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="filled_blue"
            shape="pill"
            width="100%"
          />
        </div>
        <p className="redirect-text">
          Don't have an account? <Link to="/register">Register now</Link>
        </p>
      </form>
    </div>
  );

};


export default Login;
