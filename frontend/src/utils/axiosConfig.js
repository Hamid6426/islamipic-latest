import axios from "axios";

const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://islamipic-web.onrender.com/" // Production URL
    : "http://localhost:3000"; // Development URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export default axiosInstance;
