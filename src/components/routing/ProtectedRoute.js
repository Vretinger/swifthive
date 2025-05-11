import { useCurrentUser } from "contexts/CurrentUserContext"; // Importing a custom hook to get the current user context
import { Navigate, useLocation } from "react-router-dom"; // Importing Navigate and useLocation for routing control

// ProtectedRoute component ensures that only authorized users can access certain routes
const ProtectedRoute = ({ children, roles = [] }) => {
  const { currentUser } = useCurrentUser(); // Extract the current user from context
  const location = useLocation(); // Get the current location to allow redirecting back after login

  // If there's no logged-in user, redirect to the signin page and preserve the current location for after login
  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If the user doesn't have the required role(s), redirect them to the homepage
  if (roles.length && !roles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  // If user is authenticated and has the correct role(s), render the children (protected content)
  return children;
};

export default ProtectedRoute;
