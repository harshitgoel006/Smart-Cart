import { ApiError } from "../utils/ApiError.js";

export const authorizedRole = (requiredRole) =>{
    return(req, next) =>{
        const userRole = req.user?.role;
        if (!userRole || userRole !== requiredRole) {
            throw new ApiError(403, `Access denied. Only ${requiredRole}s are allowed.`);
        }
        next();
    }
}