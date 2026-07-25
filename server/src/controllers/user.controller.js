import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { userService } from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// ======================================================
// =============== AUTHENTHICATION HANDLERS ============
// ======================================================

const sendOtp = asyncHandler(async (req, res) => {
  const { email, role } = req.body;

  await userService.sendOtp(email, role);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP sent successfully to your email"));
});

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, fullname, password, role, phone } = req.body;

  const createdUser = await userService.registerUser({
    email,
    username,
    fullname,
    password,
    role,
    phone,
    files: req.files,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  await userService.verifyOtp(email, otp);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP verified successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await userService.loginUser(
    email,
    password,
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "User logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken || req.query.refreshToken;

  await userService.logoutUser(req.user._id, incomingRefreshToken);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logout Successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  await userService.changeCurrentPassword(
    req.user._id,
    oldPassword,
    newPassword,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const sendResetOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await userService.sendResetOtp(email);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP sent successfully to your email"));
});

const verifyResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  await userService.verifyResetOtp(email, otp);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP verified successfully"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  await userService.resetPassword(email, otp, newPassword);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken || req.query.refreshToken;

  const { user, accessToken, refreshToken } =
    await userService.refreshAccessToken(incomingRefreshToken);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "Token refreshed successfully",
      ),
    );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateUserAvatar(
    req.user?._id,
    req.file,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User avatar updated successfully"),
    );
});

const updateAddress = asyncHandler(async (req, res) => {
  const updatedAddress = await userService.updateAddress(
    req.user?._id,
    req.body,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAddress, "Address updated successfully"));
});



// ======================================================
// =============== CUSTOMER ACCOUNT HANDLERS ============
// ======================================================

const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateAccountDetails(
    req.user?._id,
    req.body,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedUser,
        "User account details updated successfully",
      ),
    );
});



// ======================================================
// =============== SELLER ACCOUNT HANDLERS ==============
// ======================================================

const getSellerProfile = asyncHandler(async (req, res) => {
  const seller = await userService.getSellerProfile(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, seller, "Seller profile fetched successfully"));
});

const updateSellerProfile = asyncHandler(async (req, res) => {
  const seller = await userService.updateSellerProfile(
    req.user._id,
    req.body,
    req.file,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, seller, "Seller profile updated successfully"));
});

const getProductWiseBreakdown = asyncHandler(async (req, res) => {
  const data = await userService.getProductWiseBreakdown(req.user._id);

  res.status(200).json({
    success: true,
    data,
  });
});

const getTopSellingItems = asyncHandler(async (req, res) => {
  const topProducts = await userService.getTopSellingItems(req.user._id);

  res.status(200).json({
    success: true,
    topProducts,
  });
});

const getDailySalesData = asyncHandler(async (req, res) => {
  const dailyData = await userService.getDailySalesData(req.user._id);

  res.status(200).json({
    success: true,
    dailyData,
  });
});



// ======================================================
// =============== ADMIN ACCOUNT HANDLERS ===============
// ======================================================

const approveSeller = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await userService.approveSeller(id);

  if (result.alreadyApproved) {
    return res.status(400).json({ message: "Seller is already approved" });
  }

  res.status(200).json({
    success: true,
    message: "Seller approved successfully",
    seller: result.seller,
  });
});

const suspendSeller = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await userService.suspendSeller(id);

  if (result.alreadySuspended) {
    return res.status(400).json({ message: "Seller is already suspended" });
  }

  res.status(200).json({
    success: true,
    message: "Seller suspended successfully",
    seller: result.seller,
  });
});

const unsuspendSeller = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await userService.unsuspendSeller(id);
  if (result.notSuspended) {
    return res.status(400).json({ message: "Seller is not suspended" });
  }

  res.status(200).json({
    success: true,
    message: "Seller unsuspended successfully",
    seller: result.seller,
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const result = await userService.getAllUsers({ page, limit });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Users fetched successfully"));
});

const getAllCustomers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const result = await userService.getAllCustomers({ page, limit });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Customers fetched successfully"));
});

const getAllSellers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const result = await userService.getAllSellers({ page, limit });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Sellers fetched successfully"));
});

const deactivateUserAccount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await userService.deactivateUserAccount(id);

  if (result.alreadyDeactivated) {
    return res.status(400).json({
      message: "User account already deactivated",
    });
  }

  return res.status(200).json({
    success: true,
    message: "User account deactivated successfully",
    user: result.user,
  });
});

const reactivateUserAccount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await userService.reactivateUserAccount(id);

  if (result.alreadyActive) {
    return res.status(400).json({
      message: "User already active",
    });
  }

  return res.status(200).json({
    success: true,
    message: "User reactivated successfully",
    user: result.user,
  });
});

export {
  sendOtp,
  registerUser,
  verifyOtp,
  loginUser,
  logoutUser,
  changeCurrentPassword,
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
  refreshAccessToken,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateAddress,
  getSellerProfile,
  updateSellerProfile,
  getProductWiseBreakdown,
  getTopSellingItems,
  getDailySalesData,
  approveSeller,
  suspendSeller,
  unsuspendSeller,
  getAllUsers,
  getAllCustomers,
  getAllSellers,
  deactivateUserAccount,
  reactivateUserAccount,
};
