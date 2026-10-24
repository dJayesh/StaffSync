import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const Ctx = createContext(null);
export const roleHome = { HR: "/hr", Manager: "/manager", Employee: "/employee" };
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });

  const save = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    return user;
  };
  const login = async (email, password) => save((await api.post("/auth/login", { email, password })).data);
  const register = async (form) => save((await api.post("/auth/register", form)).data);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Re-validate the stored session once on load
  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    api.get("/auth/me")
      .then((r) => setUser(r.data.user))
      .catch((e) => { if (e.response?.status === 401) logout(); });
  }, []);

  return <Ctx.Provider value={{ user, setUser, login, register, logout }}>{children}</Ctx.Provider>;
}
