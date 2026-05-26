import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = false;

const ProtectedRoute = () => {
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;