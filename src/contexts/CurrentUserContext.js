import { useCallback, createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "api/axios";
import { useNavigate } from "react-router";
import { shouldRefreshToken } from "utils/helpers";
import LoadingSpinner from "components/LoadingSpinner";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  const signOut = useCallback(() => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setCurrentUser(null);
    navigate("/signin");
  }, [navigate]);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      console.warn("Refresh token is missing.");
      return null;
    }

    try {
      const { data } = await axios.post("/api/auth/token/refresh/", {
        refresh: refreshToken,
      });
      localStorage.setItem("access_token", data.access);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;
      return data.access;
    } catch (err) {
      console.error("Failed to refresh token", err);
      return null;
    }
  }, []);

  const tryRestoreSession = useCallback(async () => {
    try {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        const { data } = await axiosRes.get("/api/users/");
        setCurrentUser(data);
        localStorage.setItem("currentUser", JSON.stringify(data));
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (err) {
      console.error("Failed to mount current user", err);
      signOut();
    }
  }, [refreshAccessToken, signOut]);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
  
    if (storedUser && accessToken) {
      setCurrentUser(JSON.parse(storedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      setLoading(false);
    } else if (refreshToken) {
      tryRestoreSession().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [tryRestoreSession]);
  

  useEffect(() => {
    const requestInterceptor = axiosReq.interceptors.request.use(
      async (config) => {
        if (shouldRefreshToken()) {
          const newAccessToken = await refreshAccessToken();
          if (!newAccessToken) {
            console.warn("Token refresh failed during request.");
            signOut();
          } else {
            config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          }
        }
        return config;
      },
      (err) => Promise.reject(err)
    );
  
    const responseInterceptor = axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          try {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
              err.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
              return axios(err.config);
            } else {
              throw new Error("Token refresh failed");
            }
          } catch (error) {
            console.error("Failed to retry request after token refresh", error);
            signOut();
          }
        }
        return Promise.reject(err);
      }
    );
  
    // Cleanup interceptors on unmount
    return () => {
      axiosReq.interceptors.request.eject(requestInterceptor);
      axiosRes.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshAccessToken, signOut]);
  

  return (
    <CurrentUserContext.Provider value={{ currentUser, signOut, loading }}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {loading ? (
          <LoadingSpinner size="lg" text="Please wait, restoring your session..." />
        ) : (
          children
        )}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
