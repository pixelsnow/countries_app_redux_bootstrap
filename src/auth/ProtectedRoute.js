import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    /* Replaces current component with this */
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export { ProtectedRoute };
