import { useCallback, createContext, useContext, useEffect, useState } from "react"; // React hooks for managing state and side effects
import axios from "axios"; // Axios library for making HTTP requests
import { axiosReq, axiosRes } from "api/axios"; // Custom Axios instances for requests and responses
import { useNavigate } from "react-router"; // React Router for navigation
import { shouldRefreshToken } from "utils/helpers"; // Utility function for token refresh check
import LoadingSpinner from "components/LoadingSpinner"; // Component to show a loading spinner

// Creating context for accessing current user and function to set it
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

// Custom hooks for accessing the context values
export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

// The provider component that will wrap the app and manage current user state
export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // State to store the current user data
  const navigate = useNavigate(); // Hook to navigate to different routes
  const [loading, setLoading] = useState(true); // State to manage loading state

  // Function to sign out the user by clearing local storage and redirecting to sign-in page
  const signOut = useCallback(() => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setCurrentUser(null);
    navigate("/signin");
  }, [navigate]);

  // Function to refresh the access token using the refresh token stored in localStorage
  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      console.warn("Refresh token is missing.");
      return null;
    }

    try {
      const { data } = await axios.post("api/auth/token/refresh/", {
        refresh: refreshToken,
      });
      localStorage.setItem("access_token", data.access); // Store the new access token
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`; // Set new access token in Axios headers
      return data.access;
    } catch (err) {
      console.error("Failed to refresh token", err);
      return null;
    }
  }, []);

  // Function to try to restore the session by refreshing the token and fetching the user data
  const tryRestoreSession = useCallback(async () => {
    try {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        const { data } = await axiosRes.get("/api/users/"); // Fetch the current user data
        setCurrentUser(data);
        localStorage.setItem("currentUser", JSON.stringify(data)); // Store user data in localStorage
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (err) {
      console.error("Failed to mount current user", err);
      signOut(); // Sign out the user if the session restoration fails
    }
  }, [refreshAccessToken, signOut]);

  // Effect to restore session when the component mounts, using data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (storedUser && accessToken) {
      setCurrentUser(JSON.parse(storedUser)); // Set the user from localStorage
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`; // Set the access token in Axios headers
      setLoading(false);
    } else if (refreshToken) {
      tryRestoreSession().finally(() => setLoading(false)); // Try restoring session if only refresh token is available
    } else {
      setLoading(false); // Stop loading if no session info is found
    }
  }, [tryRestoreSession]);

  // Set up interceptors for handling token refresh during API requests
  useEffect(() => {
    const requestInterceptor = axiosReq.interceptors.request.use(
      async (config) => {
        if (shouldRefreshToken()) { // Check if the token should be refreshed
          const newAccessToken = await refreshAccessToken();
          if (!newAccessToken) {
            console.warn("Token refresh failed during request.");
            signOut(); // Sign out if token refresh fails
          } else {
            config.headers["Authorization"] = `Bearer ${newAccessToken}`; // Attach the new access token
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
              err.config.headers["Authorization"] = `Bearer ${newAccessToken}`; // Attach new token and retry the request
              return axios(err.config);
            } else {
              throw new Error("Token refresh failed");
            }
          } catch (error) {
            console.error("Failed to retry request after token refresh", error);
            signOut(); // Sign out if the refresh failed
          }
        }
        return Promise.reject(err);
      }
    );

    // Cleanup interceptors on unmount to prevent memory leaks
    return () => {
      axiosReq.interceptors.request.eject(requestInterceptor);
      axiosRes.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshAccessToken, signOut]);

  return (
    // Providing the current user and sign-out function to the rest of the app via context
    <CurrentUserContext.Provider value={{ currentUser, signOut, loading }}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {loading ? (
          // Show loading spinner while session is being restored
          <LoadingSpinner size="lg" text="Please wait, restoring your session..." />
        ) : (
          // Render the child components once the session is loaded
          children
        )}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
