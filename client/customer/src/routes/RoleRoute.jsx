import { Navigate, Outlet } from "react-router-dom";

const currentUserRole = "customer";

const allowedRoles = ["admin"];

const RoleRoute = () => {
  return allowedRoles.includes(
    currentUserRole,
  ) ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default RoleRoute;