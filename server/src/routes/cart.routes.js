import { Router } from "express";
import {
  addItems,
  getCartItems,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCoupon,
  getCartAnalytics,
  createCoupon,
  updateCoupon,
  listCoupons,
  resetUserCart,
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";

const router = Router();

// ======================================================
// =============== CUSTOMER PANEL HANDLERS ==============
// ======================================================


router.route("/add").post(verifyJWT, authorizedRole("customer"), addItems);


router.route("/").get(verifyJWT, authorizedRole("customer"), getCartItems);


router
  .route("/update/:itemId")
  .put(verifyJWT, authorizedRole("customer"), updateCartItem);


router
  .route("/remove/:itemId")
  .delete(verifyJWT, authorizedRole("customer"), removeCartItem);


router.route("/clear").delete(verifyJWT, authorizedRole("customer"), clearCart);


router
  .route("/apply-coupon")
  .post(verifyJWT, authorizedRole("customer"), applyCoupon);

// ======================================================
// =============== ADMIN PANEL HANDLERS =================
// ======================================================


router
  .route("/cart-analytics")
  .get(verifyJWT, authorizedRole("admin"), getCartAnalytics);


router.route("/coupons").post(verifyJWT, authorizedRole("admin"), createCoupon);


router
  .route("/coupons/:couponId")
  .put(verifyJWT, authorizedRole("admin"), updateCoupon);


router
  .route("/coupon/list")
  .get(verifyJWT, authorizedRole("admin"), listCoupons);


router
  .route("/cart/reset/:userId")
  .put(verifyJWT, authorizedRole("admin"), resetUserCart);

export default router;
