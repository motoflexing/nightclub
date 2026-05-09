import React, { createContext, useContext, useMemo, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("nightlife_user");
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem("nightlife_token");
      localStorage.removeItem("nightlife_user");
      return null;
    }
  });

  async function login(phone, password) {
    const data = await api("/auth/login", { method: "POST", body: JSON.stringify({ phone, password }) });
    localStorage.setItem("nightlife_token", data.token);
    localStorage.setItem("nightlife_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function signup(payload) {
    const data = await api("/auth/signup", { method: "POST", body: JSON.stringify(payload) });
    localStorage.setItem("nightlife_token", data.token);
    localStorage.setItem("nightlife_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("nightlife_token");
    localStorage.removeItem("nightlife_user");
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, signup, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
