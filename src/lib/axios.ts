import axios from "axios";

// Crear una instancia de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL // http://localhost:4000/api
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('AUTH_TOKEN');
  if(token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
})

export default api;