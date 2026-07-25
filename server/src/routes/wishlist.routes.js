import { Router } from "express";
import {
  addProductToWishlist,
  removeProductFromWishlist,
  viewWishlist,
  moveListItemToCart,
  wishlistItemAvailablity,
  getWishlistCount,
  clearWishlist,
  wishlistPrivacy,
  createNewWishlist,
  getAllWishlist,
  setDefaultWishlist,
} from "../controllers/wishlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";

const router = Router();

// ======================================================
// =============== CUSTOMER PANEL HANDLERS ==============
// ======================================================

router
  .route("/items")
  .post(verifyJWT, authorizedRole("customer"), addProductToWishlist);

router
  .route("/items/:itemId")
  .delete(verifyJWT, authorizedRole("customer"), removeProductFromWishlist);

router.route("/").get(verifyJWT, authorizedRole("customer"), viewWishlist);

router
  .route("/items/:itemId/move-to-cart")
  .post(verifyJWT, authorizedRole("customer"), moveListItemToCart);

router
  .route("/check-availability")
  .get(verifyJWT, authorizedRole("customer"), wishlistItemAvailablity);

router
  .route("/count")
  .get(verifyJWT, authorizedRole("customer"), getWishlistCount);

router
  .route("/clear")
  .delete(verifyJWT, authorizedRole("customer"), clearWishlist);

router
  .route("/privacy")
  .put(verifyJWT, authorizedRole("customer"), wishlistPrivacy);

router
  .route("/create")
  .post(verifyJWT, authorizedRole("customer"), createNewWishlist);

router.route("/all").get(verifyJWT, authorizedRole("customer"), getAllWishlist);

router
  .route("/set-default")
  .post(verifyJWT, authorizedRole("customer"), setDefaultWishlist);

export default router;
