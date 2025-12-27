import { useState } from "react";
import "./register.css";
import { useNavigate, Link, Navigate } from "react-router";
import { useAuth } from "../AuthContext";
import API_URL from "../../config/api";
// import axios from "axios";
function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Registration successful! Redirecting to login...");
        setForm({ name: "", email: "", password: "" });
        setTimeout(() => navigate("/login"), 1500);

      } else {
        setMsg(data.message || "Registration failed.");
      }
    } catch (error) {
      setMsg("An error occurred. Please try again.")
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            value={form.name}
            placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            value={form.email}
            type="email"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            value={form.password}
            placeholder="Password"
            type="password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <button className="" type="submit">Register</button>
      </form>
      {msg && <p className="message">{msg}</p>}
      <p className="redirect-text">
        Already have an account? <Link to="/login">Login</Link>
      </p>

    </div>

  );
}

export default Register;
