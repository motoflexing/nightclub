import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      if (mode === "login") await login(form.phone, form.password);
      else await signup(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      <form className="panel auth" onSubmit={submit}>
        <p className="eyebrow">MVP access</p>
        <h1>{mode === "login" ? "Login" : "Create account"}</h1>
        {mode === "signup" && <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
        <input placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="button full">{mode === "login" ? "Login" : "Signup"}</button>
        <button type="button" className="ghost full" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
          {mode === "login" ? "Need an account?" : "Already registered?"}
        </button>
        {error && <p className="notice error">{error}</p>}
        <p className="muted">Demo: admin 9999999999, promoter 8888888888, user 7777777777. Password: password123.</p>
      </form>
    </div>
  );
}
