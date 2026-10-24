import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const errMsg = (e) =>
  e?.response?.data?.message || (e?.code === "ERR_NETWORK" ? "Cannot reach the server. Is the backend running?" : e?.message) || "Something went wrong";

export default api;
