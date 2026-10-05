import axios from "axios";

const api = axios.create({ baseURL: "http://127.0.0.1:8000/api/" });

const PUBLIC = ["token/", "register/"];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token && !PUBLIC.includes(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !PUBLIC.includes(err.config.url)) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;