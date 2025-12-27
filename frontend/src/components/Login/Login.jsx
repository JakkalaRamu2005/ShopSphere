import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import "./login.css";
// import axios from "axios";
import { useNavigate, Link, Navigate } from "react-router";


function Login() {
  const { setIsLoggedIn, isLoggedIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const {login} = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    
    const result = await login(form);
    if(result.success){
      setMsg("Login successful! Welcome back.");
      navigate("/");
    }else{
      setMsg(result.messsage);
    }
    
  }
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
        <p className="redirect-text">
          Don't have an account? <Link to="/register">Register now</Link>
        </p>
      </form>
    </div>
  );

};


export default Login;
