// This file defines the routes for user-related operations in the application. It imports necessary modules and middleware, sets up various routes for user authentication, account management, and admin functionalities, and associates each route with its corresponding controller function to handle the business logic for that route. The routes are organized into sections based on their functionality, such as authentication handlers, customer account handlers, seller account handlers, and admin account handlers. Each route is protected with appropriate middleware to ensure that only authorized users can access certain functionalities.

import { Router } from "express";
import {
  registerUser,
  sendOtp,
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
  getDailySalesData,
  getProductWiseBreakdown,
  getTopSellingItems,
  updateSellerProfile,
  approveSeller,
  suspendSeller,
  unsuspendSeller,
  getAllUsers,
  getAllSellers,
  getAllCustomers,
  reactivateUserAccount,
  deactivateUserAccount,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";

const router = Router();

// ======================================================
// =============== AUTHENTHICATION HANDLERS ============
// ======================================================

// This route is for user registration. It uses the multer middleware to handle file uploads, allowing users to upload an avatar image during registration. The controller function `registerUser` will handle the logic for validating the registration input, saving the user information in the database, and returning an appropriate response indicating the success or failure of the registration process.
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser,
);

// This route is for sending an OTP (One-Time Password) to the user's email or phone number for verification purposes. The controller function `sendOtp` will handle the logic for generating the OTP, sending it to the user, and returning an appropriate response indicating the success or failure of the OTP sending process.
router.route("/send-otp").post(sendOtp);

// This route is for verifying the OTP sent to the user. The controller function `verifyOtp` will handle the logic for validating the OTP provided by the user, checking it against the generated OTP, and returning an appropriate response indicating whether the OTP verification was successful or not.
router.route("/verify-otp").post(verifyOtp);

// This route is for user login. The controller function `loginUser` will handle the logic for validating the login credentials provided by the user, checking them against the stored user information in the database, and returning an appropriate response indicating the success or failure of the login attempt, along with any necessary authentication tokens or session information.
router.route("/login").post(loginUser);

// This route is for sending a password reset OTP to the user's email or phone number. The controller function `sendResetOtp` will handle the logic for generating the OTP, sending it to the user, and returning an appropriate response indicating the success or failure of the OTP sending process for password reset purposes.
router.route("/send-reset-otp").post(sendResetOtp);

// This route is for verifying the password reset OTP sent to the user. The controller function `verifyResetOtp` will handle the logic for validating the OTP provided by the user, checking it against the generated OTP for password reset, and returning an appropriate response indicating whether the OTP verification was successful or not, allowing the user to proceed with resetting their password if the OTP is valid.
router.route("/verify-reset-otp").post(verifyResetOtp);

// This route is for resetting the user's password. It requires the user to provide a valid password reset OTP for verification. The controller function `resetPassword` will handle the logic for validating the new password input, checking the validity of the provided OTP, updating the user's password in the database if the OTP is valid, and returning an appropriate response indicating the success or failure of the password reset process.
router.route("/reset-password").post(resetPassword);

// This route is for logging out the user. It requires the user to be authenticated using the verifyJWT middleware. The controller function `logoutUser` will handle the logic for invalidating the user's authentication token or session, effectively logging them out of the application, and returning an appropriate response indicating the success of the logout operation.

router.route("/logout").post(verifyJWT, logoutUser);

// This route is for changing the current password of the logged-in user. It requires the user to be authenticated using the verifyJWT middleware. The controller function `changeCurrentPassword` will handle the logic for validating the new password input, checking the user's current password for verification, updating the user's password in the database if the current password is correct, and returning an appropriate response indicating the success or failure of the password change process.
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

// This route is for refreshing the access token for an authenticated user. It requires the user to provide a valid refresh token (usually sent in the request body or cookies). The controller function `refreshAccessToken` will handle the logic for validating the refresh token, generating a new access token if the refresh token is valid, and returning the new access token in the response for continued authenticated access to protected routes in the application.
router.route("/refresh-token").post(refreshAccessToken);

// This route is for updating the user's avatar image. It requires the user to be authenticated using the verifyJWT middleware and allows them to upload a new avatar image using the multer middleware. The controller function `updateUserAvatar` will handle the logic for validating the uploaded image, updating the user's avatar information in the database, and returning an appropriate response indicating the success or failure of the avatar update process.

router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

// This route is for updating the user's address information. It requires the user to be authenticated using the verifyJWT middleware. The controller function `updateAddress` will handle the logic for validating the new address input, updating the user's address information in the database, and returning an appropriate response indicating the success or failure of the address update process.
router.route("/update-address").patch(verifyJWT, updateAddress);

// ======================================================
// =============== CUSTOMER ACCOUNT HANDLERS ============
// ======================================================

// This route is for fetching the current logged-in user's information. It requires the user to be authenticated using the verifyJWT middleware. The controller function `getCurrentUser` will handle the logic for retrieving the user's information from the database based on their authentication token, and returning it in the response for the user to view their account details.
router.route("/get-user").get(verifyJWT, getCurrentUser);

// This route is for updating the current logged-in user's account details. It requires the user to be authenticated using the verifyJWT middleware. The controller function `updateAccountDetails` will handle the logic for validating the new account details input, updating the user's information in the database, and returning an appropriate response indicating the success or failure of the account update process.
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

// ======================================================
// =============== SELLER ACCOUNT HANDLERS ==============
// ======================================================

// This route is for fetching the seller profile information of the logged-in user. It requires the user to be authenticated using the verifyJWT middleware and have the "seller" role. The controller function `getSellerProfile` will handle the logic for retrieving the seller's profile information from the database based on their authentication token, and returning it in the response for the seller to view their profile details.
router
  .route("/seller/profile")
  .get(verifyJWT, authorizedRole("seller"), getSellerProfile);

// This route is for updating the seller profile information of the logged-in user. It requires the user to be authenticated using the verifyJWT middleware and have the "seller" role. The controller function `updateSellerProfile` will handle the logic for validating the new seller profile input, updating the seller's information in the database, and returning an appropriate response indicating the success or failure of the profile update process.
router
  .route("/seller/update-account")
  .post(
    verifyJWT,
    authorizedRole("seller"),
    upload.single("storeBanner"),
    updateSellerProfile,
  );

// This route is for fetching daily sales data for the logged-in seller. It requires the user to be authenticated using the verifyJWT middleware and have the "seller" role. The controller function `getDailySalesData` will handle the logic for aggregating and retrieving daily sales data for the seller from the database, and returning it in the response for the seller to view their sales performance on a daily basis.
router
  .route("/seller/product-breakdown")
  .get(verifyJWT, authorizedRole("seller"), getProductWiseBreakdown);

// This route is for fetching a breakdown of sales data by product for the logged-in seller. It requires the user to be authenticated using the verifyJWT middleware and have the "seller" role. The controller function `getProductWiseBreakdown` will handle the logic for aggregating and retrieving sales data broken down by individual products for the seller from the database, and returning it in the response for the seller to analyze their sales performance at the product level.
router
  .route("/seller/top-products")
  .get(verifyJWT, authorizedRole("seller"), getTopSellingItems);

// This route is for fetching the top-selling items for the logged-in seller. It requires the user to be authenticated using the verifyJWT middleware and have the "seller" role. The controller function `getTopSellingItems` will handle the logic for aggregating and retrieving data on the top-selling products for the seller from the database, and returning it in the response for the seller to identify their best-performing products.
router
  .route("/seller/daily-sales")
  .get(verifyJWT, authorizedRole("seller"), getDailySalesData);

// ======================================================
// =============== ADMIN ACCOUNT HANDLERS ===============
// ======================================================

// This route is for approving a seller account by its ID. It requires the user to be authenticated using the verifyJWT middleware and have the "admin" role. The controller function `approveSeller` will handle the logic for ensuring that the seller account exists, updating the seller's approval status to approved in the database, and returning an appropriate response indicating the success or failure of the seller account approval process.
router
  .route("/admin/sellers/:id/approve")
  .post(verifyJWT, authorizedRole("admin"), approveSeller);

// This route is for suspending a seller account by its ID. It requires the user to be authenticated using the verifyJWT middleware and have the "admin" role. The controller function `suspendSeller` will handle the logic for ensuring that the seller account exists, updating the seller's status to suspended in the database, and returning an appropriate response indicating the success or failure of the seller account suspension process.
router
  .route("/admin/sellers/:id/suspend")
  .post(verifyJWT, authorizedRole("admin"), suspendSeller);

// This route is for unsuspending a seller account by its ID. It requires the user to be authenticated using the verifyJWT middleware and have the "admin" role. The controller function `unsuspendSeller` will handle the logic for ensuring that the seller account exists, updating the seller's status to active in the database, and returning an appropriate response indicating the success or failure of the seller account unsuspension process.
router
  .route("/admin/sellers/:id/unsuspend")
  .post(verifyJWT, authorizedRole("admin"), unsuspendSeller);

// This route is for fetching all users for admin management. It requires the user to be authenticated using the verifyJWT middleware and have the "admin" role. The controller function `getAllUsers` will handle the logic for retrieving all users from the database, applying filters, sorting, and pagination based on query parameters provided in the request, and returning them in the response for admin management purposes.
router
  .route("/admin/users")
  .get(verifyJWT, authorizedRole("admin"), getAllUsers);

// This route is for fetching all sellers for admin management. It requires the user to be authenticated using the verifyJWT middleware and have the "admin" role. The controller function `getAllSellers` will handle the logic for retrieving all sellers from the database, applying filters, sorting, and pagination based on query parameters provided in the request, and returning them in the response for admin management purposes.
router
  .route("/admin/sellers")
  .get(verifyJWT, authorizedRole("admin"), getAllSellers);

// This route is for fetching all customers for admin management. It requires the user to be authenticated using the verifyJWT middleware and have the "admin" role. The controller function `getAllCustomers` will handle the logic for retrieving all customers from the database, applying filters, sorting, and pagination based on query parameters provided in the request, and returning them in the response for admin management purposes.
router
  .route("/admin/customers")
  .get(verifyJWT, authorizedRole("admin"), getAllCustomers);

// This route is for reactivating a user account by its ID. It requires the user to be authenticated using the verifyJWT middleware and have the "admin" role. The controller function `reactivateUserAccount` will handle the logic for ensuring that the user account exists, updating the user's status to active in the database, and returning an appropriate response indicating the success or failure of the user account reactivation process.
router
  .route("/admin/users/:id/reactivate")
  .post(verifyJWT, authorizedRole("admin"), reactivateUserAccount);

// This route is for deactivating a user account by its ID. It requires the user to be authenticated using the verifyJWT middleware and have the "admin" role. The controller function `deactivateUserAccount` will handle the logic for ensuring that the user account exists, updating the user's status to deactivated in the database, and returning an appropriate response indicating the success or failure of the user account deactivation process.f
router
  .route("/admin/users/:id/deactivate")
  .post(verifyJWT, authorizedRole("admin"), deactivateUserAccount);

export default router;
