import { ApiError } from "../utils/ApiError.js";

// This middleware factory function generates a middleware that checks if the authenticated user has the required role(s) to access a particular route. It supports both strict role checking and hierarchical role checking based on a predefined role priority. If the user does not meet the required role criteria, it throws an appropriate ApiError.

const ROLE_PRIORITY = Object.freeze({
  customer: 1,
  seller: 2,
  moderator: 3,
  admin: 4,
  superadmin: 5,
});

export const authorizedRole = (options = {}) => {
  const { allow = [], allowHierarchy = false } = options;

  const allowedRoles = Object.freeze(allow.map((r) => String(r).toLowerCase()));

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

      const isAuthorized = allowedRoles.some((role) => {
        const requiredPriority = ROLE_PRIORITY[role] || 0;
        return userPriority >= requiredPriority;
      });

      if (!isAuthorized) {
        throw new ApiError(403, "You do not have sufficient privileges");
      }
    } else {
      if (!allowedRoles.includes(userRole)) {
        throw new ApiError(
          403,
          "You do not have permission to access this resource",
        );
      }
    }

    next();
  };
};
