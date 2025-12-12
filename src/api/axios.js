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
axiosReq.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh_token")
    ) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh_token");
        const res = await axios.post(`${BASE_URL}/api/token/refresh/`, { refresh });
        
        localStorage.setItem("access_token", res.data.access);
        axiosReq.defaults.headers.Authorization = `Bearer ${res.data.access}`;

        return axiosReq(originalRequest);
      } catch (refreshError) {
        console.log("Refresh failed", refreshError);
      }
    }

    return Promise.reject(error);
  }
);



// Authenticated response instance (used with interceptors)
export const axiosRes = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default axiosPublic;
