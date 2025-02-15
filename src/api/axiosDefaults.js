import axios from "axios";
import Cookies from "js-cookie";

// Set the base URL for your Axios requests
axios.defaults.baseURL = "https://swifthive-api-bad383c6f380.herokuapp.com/";

const axiosPublic = axios.create({
    baseURL: 'https://swifthive-api-bad383c6f380.herokuapp.com/',  // Your public API URL
    withCredentials: false,  // Disable credentials for this request
  });

// Include CSRF token in headers
axios.defaults.headers.common["X-CSRFToken"] = Cookies.get("csrftoken");

// Include credentials for cross-origin requests
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();
export default axiosPublic;