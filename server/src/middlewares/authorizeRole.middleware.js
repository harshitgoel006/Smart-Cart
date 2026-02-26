import { ApiError } from "../utils/ApiError.js";

const ROLE_PRIORITY = Object.freeze({
  customer: 1,
  seller: 2,
  moderator: 3,
  admin: 4,
  superadmin: 5
});

export const authorizeRoles = (options = {}) => {

  const {
    allow = [],            
    allowHierarchy = false 
  } = options;

  const allowedRoles = Object.freeze(
    allow.map(r => String(r).toLowerCase())
  );

  return (req, res, next) => {

    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    if (req.user.isDeleted) {
      throw new ApiError(403, "Account is deleted");
    }

    if (req.user.isSuspended) {
      throw new ApiError(403, "Account is suspended");
    }

    if (req.user.isBlocked) {
      throw new ApiError(403, "Account is blocked");
    }

    const userRole = String(req.user.role || "").toLowerCase();

    if (!userRole) {
      throw new ApiError(403, "Invalid role");
    }

    if (allowHierarchy) {

      const userPriority = ROLE_PRIORITY[userRole] || 0;

      const isAuthorized = allowedRoles.some(role => {
        const requiredPriority = ROLE_PRIORITY[role] || 0;
        return userPriority >= requiredPriority;
      });

      if (!isAuthorized) {
        throw new ApiError(
          403,
          "You do not have sufficient privileges"
        );
      }

    } else {

      if (!allowedRoles.includes(userRole)) {
        throw new ApiError(
          403,
          "You do not have permission to access this resource"
        );
      }
    }


    next();
  };
};