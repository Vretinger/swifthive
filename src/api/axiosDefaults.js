import axios from "axios";

axios.defaults.baseURL = 'https://swifthive-api-bad383c6f380.herokuapp.com/';
axios.defaults.headers.post['Content-Type'] = 'multipart/from-data';
axios.defaults.withCredentials = true;