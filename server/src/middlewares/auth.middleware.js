import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {

  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "").trim();

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decoded;

  try {
    decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
  } catch {
    throw new ApiError(401, "Invalid access token");
  }

  const user = await User.findById(decoded._id)
    .select("-password -refreshTokens");

  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }

  if (!user.isActive || user.isDeleted) {
    throw new ApiError(403, "Account inactive or deleted");
  }

  if (
    user.role === "seller" &&
    (
      user.sellerProfile?.isSellerSuspended ||
      !user.sellerProfile?.isSellerApproved
    )
  ) {
    throw new ApiError(
      403,
      "Seller account not allowed. Contact support"
    );
  }

  req.user = user;

  next();
});