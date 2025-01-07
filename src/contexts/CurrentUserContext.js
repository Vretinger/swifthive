import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useNavigate  } from "react-router";
import { shouldRefreshToken } from "../utils/utils";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate  = useNavigate ();

  const handleMount = async () => {
    try {
      const { data } = await axiosRes.get("dj-rest-auth/user/");
      setCurrentUser(data);
      localStorage.setItem("currentUser", JSON.stringify(data));
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
    } catch (err) {
      console.log(err);
      setCurrentUser(null);
      localStorage.removeItem("currentUser");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };
  
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const accessToken = localStorage.getItem("accessToken");
  
    if (storedUser && accessToken) {
      setCurrentUser(JSON.parse(storedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
      handleMount();
    }
  }, []);

  useMemo(() => {
    axiosReq.interceptors.request.use(
      async (config) => {
        if (shouldRefreshToken()) {
          try {
            const { data } = await axios.post("/dj-rest-auth/token/verify/", {
              refresh: localStorage.getItem("refreshToken"),
            });
            localStorage.setItem("accessToken", data.access);
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;
          } catch (err) {
            console.log("Token refresh failed", err);
            setCurrentUser(null);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            navigate("/signin");
          }
        }
        return config;
      },
      (err) => Promise.reject(err)
    );
    

    axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          try {
            const { data } = await axios.post("/dj-rest-auth/token/refresh/", {
              refresh: localStorage.getItem("refreshToken"),
            });
            localStorage.setItem("accessToken", data.access);
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;
            return axios(err.config); // Retry the original request
          } catch (err) {
            console.log("Refresh token expired or invalid", err);
            setCurrentUser(null);
            localStorage.clear();
            navigate("/signin");
          }
        }
        return Promise.reject(err);
      }
    );    
  }, [navigate]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};