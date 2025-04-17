// ...your existing imports
import axios from "axios";
import Cookies from "js-cookie";

// Base URL
axios.defaults.baseURL = "https://swifthive-api-bad383c6f380.herokuapp.com/";

const axiosPublic = axios.create({
  baseURL: "https://swifthive-api-bad383c6f380.herokuapp.com/",
  withCredentials: false,
});

// CSRF Token
axios.defaults.headers.common["X-CSRFToken"] = Cookies.get("csrftoken");

// Include credentials
axios.defaults.withCredentials = true;

// Authenticated instance
export const axiosReq = axios.create({
  baseURL: "https://swifthive-api-bad383c6f380.herokuapp.com/",
});

// Automatically attach the access token to each request
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

// Response interceptor (optional)
export const axiosRes = axios.create({
  baseURL: "https://swifthive-api-bad383c6f380.herokuapp.com/",
});

export default axiosPublic;
