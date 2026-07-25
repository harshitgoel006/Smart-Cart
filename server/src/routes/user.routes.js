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

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser,
);

router.route("/send-otp").post(sendOtp);

router.route("/verify-otp").post(verifyOtp);

router.route("/login").post(loginUser);

router.route("/send-reset-otp").post(sendResetOtp);

router.route("/verify-reset-otp").post(verifyResetOtp);

router.route("/reset-password").post(resetPassword);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/refresh-token").post(refreshAccessToken);

router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router.route("/update-address").patch(verifyJWT, updateAddress);

// ======================================================
// =============== CUSTOMER ACCOUNT HANDLERS ============
// ======================================================

router.route("/get-user").get(verifyJWT, getCurrentUser);

router.route("/update-account").patch(verifyJWT, updateAccountDetails);

// ======================================================
// =============== SELLER ACCOUNT HANDLERS ==============
// ======================================================

router
  .route("/seller/profile")
  .get(verifyJWT, authorizedRole("seller"), getSellerProfile);

router
  .route("/seller/update-account")
  .post(
    verifyJWT,
    authorizedRole("seller"),
    upload.single("storeBanner"),
    updateSellerProfile,
  );

router
  .route("/seller/product-breakdown")
  .get(verifyJWT, authorizedRole("seller"), getProductWiseBreakdown);

router
  .route("/seller/top-products")
  .get(verifyJWT, authorizedRole("seller"), getTopSellingItems);

router
  .route("/seller/daily-sales")
  .get(verifyJWT, authorizedRole("seller"), getDailySalesData);

// ======================================================
// =============== ADMIN ACCOUNT HANDLERS ===============
// ======================================================

router
  .route("/admin/sellers/:id/approve")
  .post(verifyJWT, authorizedRole("admin"), approveSeller);

router
  .route("/admin/sellers/:id/suspend")
  .post(verifyJWT, authorizedRole("admin"), suspendSeller);

router
  .route("/admin/sellers/:id/unsuspend")
  .post(verifyJWT, authorizedRole("admin"), unsuspendSeller);

router
  .route("/admin/users")
  .get(verifyJWT, authorizedRole("admin"), getAllUsers);

router
  .route("/admin/sellers")
  .get(verifyJWT, authorizedRole("admin"), getAllSellers);

router
  .route("/admin/customers")
  .get(verifyJWT, authorizedRole("admin"), getAllCustomers);

router
  .route("/admin/users/:id/reactivate")
  .post(verifyJWT, authorizedRole("admin"), reactivateUserAccount);

router
  .route("/admin/users/:id/deactivate")
  .post(verifyJWT, authorizedRole("admin"), deactivateUserAccount);

export default router;
