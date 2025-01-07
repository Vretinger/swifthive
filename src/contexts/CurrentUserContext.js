import { useCallback, createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useNavigate } from "react-router";
import { shouldRefreshToken } from "../utils/utils";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    console.log("Stored refreshToken:", refreshToken); 
    if (!refreshToken) {
      console.warn("Refresh token is missing.");
      return null; // Don't throw an error, just return null
    }

    try {
      const { data } = await axios.post("/dj-rest-auth/token/refresh/", {
        refresh: refreshToken,
      });
      localStorage.setItem("access_token", data.access);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;
      return data.access;
    } catch (err) {
      console.error("Failed to refresh token", err);
      return null;
    }
  }, []); // Empty dependency array ensures the function is only created once

  const handleMount = useCallback(async () => {
    try {
      // Refresh the token and fetch user data
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        const { data } = await axiosRes.get("/dj-rest-auth/user/");
        setCurrentUser(data);
        localStorage.setItem("currentUser", JSON.stringify(data));
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (err) {
      console.error("Failed to mount current user", err);
      setCurrentUser(null);
      // Clear only user-related data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("currentUser");
    }
  }, [refreshAccessToken, setCurrentUser]); // handleMount depends on refreshAccessToken

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const accessToken = localStorage.getItem("access_token");
    console.log("storedUser:", storedUser); 

    if (storedUser && accessToken) {
      setCurrentUser(JSON.parse(storedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
      handleMount();
    }
  }, [handleMount]);

  useMemo(() => {
    axiosReq.interceptors.request.use(
      async (config) => {
        if (shouldRefreshToken()) {
          const newAccessToken = await refreshAccessToken();
          if (!newAccessToken) {
            console.warn("Token refresh failed during request.");
            setCurrentUser(null);
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
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
              err.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
              return axios(err.config); // Retry original request
            } else {
              throw new Error("Token refresh failed");
            }
          } catch (err) {
            console.error("Failed to retry request after token refresh", err);
            setCurrentUser(null);
            navigate("/signin");
          }
        }
        return Promise.reject(err);
      }
    );
  }, [navigate, refreshAccessToken]); // Add refreshAccessToken as a dependency

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
