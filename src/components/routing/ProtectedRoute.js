import { useCurrentUser } from "contexts/CurrentUserContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { currentUser } = useCurrentUser();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (roles.length && !roles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
