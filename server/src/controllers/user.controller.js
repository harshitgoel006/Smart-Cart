import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { userService } from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// ======================================================
// =============== AUTHENTHICATION HANDLERS ============
// ======================================================

// This controller is used for sending OTP to user's email for both registration and login. The service will handle the logic of determining whether it's for registration or login based on the presence of the user in the database and the provided role.
const sendOtp = asyncHandler(async (req, res) => {
  const { email, role } = req.body;

  await userService.sendOtp(email, role);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP sent successfully to your email"));
});

// This controller is used for registering a new user. It expects email, username, fullname, password, role and phone in the request body. The service will handle the logic of creating the user and sending the OTP for verification.
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

// This controller is used for verifying the OTP sent to the user's email during registration or login. It expects email and otp in the request body. The service will handle the logic of verifying the OTP and activating the user account if it's for registration or allowing login if it's for login.
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  await userService.verifyOtp(email, otp);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP verified successfully"));
});

// This controller is used for logging in a user. It expects email and password in the request body. The service will handle the logic of authenticating the user and generating access and refresh tokens.
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

// This controller is used for logging out a user. It expects the refresh token to be sent in the cookies, request body or query parameters. The service will handle the logic of invalidating the refresh token and clearing the cookies.
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

// This controller is used for changing the current password of a logged in user. It expects oldPassword and newPassword in the request body. The service will handle the logic of verifying the old password and updating it to the new password.
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

// This controller is used for sending OTP to user's email for password reset. It expects email in the request body. The service will handle the logic of generating the OTP and sending it to the user's email.
const sendResetOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await userService.sendResetOtp(email);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP sent successfully to your email"));
});

// This controller is used for verifying the OTP sent to the user's email during password reset. It expects email and otp in the request body. The service will handle the logic of verifying the OTP and allowing the user to reset the password if the OTP is valid.
const verifyResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  await userService.verifyResetOtp(email, otp);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP verified successfully"));
});

// This controller is used for resetting the password of a user who has verified the OTP sent to their email. It expects email, otp and newPassword in the request body. The service will handle the logic of verifying the OTP again for security and updating the password to the new password.
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  await userService.resetPassword(email, otp, newPassword);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

// This controller is used for refreshing the access token using a valid refresh token. It expects the refresh token to be sent in the cookies, request body or query parameters. The service will handle the logic of verifying the refresh token and generating a new access token and refresh token pair.
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

// This controller is used for updating the user's avatar. It expects a file to be uploaded in the request. The service will handle the logic of uploading the file to cloud storage, updating the user's avatar URL in the database and deleting the old avatar from cloud storage if it exists.
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

// This controller is used for updating the user's address. It expects address details in the request body. The service will handle the logic of updating the user's address in the database.
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

// This controller is used for fetching the current logged in user's details. It expects the user to be authenticated and the user details to be available in the request object. The service will handle the logic of fetching the user details from the database if needed and returning it.
const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

// This controller is used for updating the current logged in user's account details like fullname, phone etc. It expects the user to be authenticated and the user details to be available in the request object. It also expects the updated details in the request body. The service will handle the logic of updating the user details in the database and returning the updated user.
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

// This controller is used for fetching the seller profile of the current logged in user. It expects the user to be authenticated and the user details to be available in the request object. The service will handle the logic of fetching the seller profile from the database and returning it.
const getSellerProfile = asyncHandler(async (req, res) => {
  const seller = await userService.getSellerProfile(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, seller, "Seller profile fetched successfully"));
});

// This controller is used for updating the seller profile of the current logged in user. It expects the user to be authenticated and the user details to be available in the request object. It also expects the updated seller profile details in the request body and a file for the shop image. The service will handle the logic of updating the seller profile in the database, uploading the shop image to cloud storage and returning the updated seller profile.
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

// This controller is used for fetching the product wise sales breakdown for the current logged in seller. It expects the user to be authenticated and the user details to be available in the request object. The service will handle the logic of fetching the sales data from the database, aggregating it by product and returning the breakdown.
const getProductWiseBreakdown = asyncHandler(async (req, res) => {
  const data = await userService.getProductWiseBreakdown(req.user._id);

  res.status(200).json({
    success: true,
    data,
  });
});

// This controller is used for fetching the top selling items for the current logged in seller. It expects the user to be authenticated and the user details to be available in the request object. The service will handle the logic of fetching the sales data from the database, sorting it by quantity sold and returning the top selling items.
const getTopSellingItems = asyncHandler(async (req, res) => {
  const topProducts = await userService.getTopSellingItems(req.user._id);

  res.status(200).json({
    success: true,
    topProducts,
  });
});

// This controller is used for fetching the daily sales data for the current logged in seller. It expects the user to be authenticated and the user details to be available in the request object. The service will handle the logic of fetching the sales data from the database, grouping it by day and returning the daily sales data.
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

// This controller is used for approving a seller account. It expects the admin to be authenticated and the admin details to be available in the request object. It also expects the seller id to be provided as a path parameter. The service will handle the logic of approving the seller account in the database and returning the updated seller details.
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

// This controller is used for suspending a seller account. It expects the admin to be authenticated and the admin details to be available in the request object. It also expects the seller id to be provided as a path parameter. The service will handle the logic of suspending the seller account in the database and returning the updated seller details.
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

// This controller is used for unsuspending a seller account. It expects the admin to be authenticated and the admin details to be available in the request object. It also expects the seller id to be provided as a path parameter. The service will handle the logic of unsuspending the seller account in the database and returning the updated seller details.
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

// This controller is used for fetching all users in the system. It expects the admin to be authenticated and the admin details to be available in the request object. It also accepts pagination parameters in the query string. The service will handle the logic of fetching the users from the database with pagination and returning the list of users.
const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const result = await userService.getAllUsers({ page, limit });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Users fetched successfully"));
});

// This controller is used for fetching all customers in the system. It expects the admin to be authenticated and the admin details to be available in the request object. It also accepts pagination parameters in the query string. The service will handle the logic of fetching the customers from the database with pagination and returning the list of customers.
const getAllCustomers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const result = await userService.getAllCustomers({ page, limit });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Customers fetched successfully"));
});

// This controller is used for fetching all sellers in the system. It expects the admin to be authenticated and the admin details to be available in the request object. It also accepts pagination parameters in the query string. The service will handle the logic of fetching the sellers from the database with pagination and returning the list of sellers.
const getAllSellers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const result = await userService.getAllSellers({ page, limit });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Sellers fetched successfully"));
});

// This controller is used for deactivating a user account. It expects the admin to be authenticated and the admin details to be available in the request object. It also expects the user id to be provided as a path parameter. The service will handle the logic of deactivating the user account in the database and returning the updated user details.
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

// This controller is used for reactivating a user account. It expects the admin to be authenticated and the admin details to be available in the request object. It also expects the user id to be provided as a path parameter. The service will handle the logic of reactivating the user account in the database and returning the updated user details.
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

// Exporting all the controllers as an object for easier import in routes
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
