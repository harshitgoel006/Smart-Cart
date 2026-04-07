// This module defines the verifyJWT middleware function that is responsible for authenticating incoming requests by verifying the JWT token provided in the request headers or cookies. It checks the validity of the token, decodes it to extract the user ID, and then retrieves the corresponding user from the database. If the user is found and active, it attaches the user object to the request for use in subsequent middleware or route handlers. If any of these checks fail, it throws an appropriate ApiError indicating unauthorized access or account issues.

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

// This middleware function verifies the JWT token sent in the request headers or cookies. It checks if the token is valid, decodes it to get the user ID, and then fetches the user from the database. If the user is found and active, it attaches the user object to the request and calls next() to proceed to the next middleware or route handler. If any of these checks fail, it throws an appropriate ApiError.
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "").trim();

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Invalid access token");
  }

  const user = await User.findById(decoded._id).select(
    "-password -refreshTokens",
  );

  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }

  if (!user.isActive || user.isDeleted) {
    throw new ApiError(403, "Account inactive or deleted");
  }

  if (
    user.role === "seller" &&
    (user.sellerProfile?.isSellerSuspended ||
      !user.sellerProfile?.isSellerApproved)
  ) {
    throw new ApiError(403, "Seller account not allowed. Contact support");
  }

  req.user = user;

  next();
});
