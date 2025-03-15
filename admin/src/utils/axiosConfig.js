import axios from "axios";

const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://islamipic-web.onrender.com/" // Production URL
    : "http://localhost:3000"; // Development URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

// Interceptor to attach Authorization header if token exists
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;