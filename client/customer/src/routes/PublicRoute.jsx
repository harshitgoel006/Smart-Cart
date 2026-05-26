import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = false;

const PublicRoute = () => {
  return !isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default PublicRoute;