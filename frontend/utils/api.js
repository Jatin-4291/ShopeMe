import axios from "axios";
const VITE_BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
const api = axios.create({
  baseURL: `${VITE_BACKEND_URL}/api/v1`,
  withCredentials: true,
});

export default api;
