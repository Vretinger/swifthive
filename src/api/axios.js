import axios from "axios";
import Cookies from "js-cookie";

// Base API URL
const BASE_URL = process.env.REACT_APP_BASE_URL;

// Configure the default global axios instance
axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true; // Send cookies (for CSRF)
axios.defaults.headers.common["X-CSRFToken"] = Cookies.get("csrftoken");

// Public instance (no auth)
const axiosPublic = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // No cookies needed for public requests
});

// Authenticated instance
export const axiosReq = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Required for session cookies and CSRF
});

// Attach access token to all authenticated requests
axiosReq.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authenticated response instance (used with interceptors)
export const axiosRes = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default axiosPublic;
