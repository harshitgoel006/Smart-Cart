// This file defines the routes for handling wishlist-related operations in the application. It uses Express.js to create a router and defines various endpoints for managing a user's wishlist, such as adding items, removing items, viewing the wishlist, moving items to the cart, checking item availability, getting the wishlist count, clearing the wishlist, setting privacy settings, creating new wishlists, fetching all wishlists, and setting a default wishlist. Each route is protected by JWT authentication and role-based authorization to ensure that only authenticated customers can access these functionalities. The corresponding controller functions will handle the business logic for each operation.

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

// This route is for adding a product to the wishlist. It requires the user to be authenticated using the verifyJWT middleware and have the "customer" role. The controller function `addProductToWishlist` will handle the logic for validating the input, checking product availability, and adding the specified product to the user's wishlist in the database.
router
  .route("/items")
  .post(verifyJWT, authorizedRole("customer"), addProductToWishlist);

// This route is for removing a product from the wishlist. It requires the user to be authenticated using the verifyJWT middleware and have the "customer" role. The controller function `removeProductFromWishlist` will handle the logic for validating the input, ensuring that the specified product exists in the user's wishlist, and removing it from the wishlist in the database.
router
  .route("/items/:itemId")
  .delete(verifyJWT, authorizedRole("customer"), removeProductFromWishlist);

// This route is for viewing the user's wishlist. It requires the user to be authenticated using the verifyJWT middleware and have the "customer" role. The controller function `viewWishlist` will handle the logic for retrieving the user's wishlist from the database, applying pagination and filtering based on query parameters such as page and limit, and returning the wishlist items in the response.
router.route("/").get(verifyJWT, authorizedRole("customer"), viewWishlist);

// This route is for moving an item from the wishlist to the cart. It requires the user to be authenticated using the verifyJWT middleware and have the "customer" role. The controller function `moveListItemToCart` will handle the logic for validating the input, ensuring that the specified item exists in the user's wishlist, checking product availability, and moving it from the wishlist to the cart in the database.
router
  .route("/items/:itemId/move-to-cart")
  .post(verifyJWT, authorizedRole("customer"), moveListItemToCart);

// This route is for checking the availability of items in the wishlist. It requires the user to be authenticated using the verifyJWT middleware and have the "customer" role. The controller function `wishlistItemAvailablity` will handle the logic for validating the input, checking the availability of each item in the user's wishlist against the current product inventory, and returning a response indicating which items are available or out of stock.
router
  .route("/check-availability")
  .get(verifyJWT, authorizedRole("customer"), wishlistItemAvailablity);

// This route is for getting the count of items in the user's wishlist. It requires the user to be authenticated using the verifyJWT middleware and have the "customer" role. The controller function `getWishlistCount` will handle the logic for retrieving the total number of items in the user's wishlist from the database and returning that count in the response.
router
  .route("/count")
  .get(verifyJWT, authorizedRole("customer"), getWishlistCount);

// This route is for clearing all items from the user's wishlist. It requires the user to be authenticated using the verifyJWT middleware and have the "customer" role. The controller function `clearWishlist` will handle the logic for removing all items from the user's wishlist in the database and returning an appropriate response indicating the success of the operation.
router
  .route("/clear")
  .delete(verifyJWT, authorizedRole("customer"), clearWishlist);

// This route is for setting the privacy settings of the user's wishlist. It requires the user to be authenticated using the verifyJWT middleware and have the "customer" role. The controller function `wishlistPrivacy` will handle the logic for validating the input, updating the privacy settings of the user's wishlist in the database, and returning an appropriate response indicating the success of the operation.
router
  .route("/privacy")
  .put(verifyJWT, authorizedRole("customer"), wishlistPrivacy);

// This route is for creating a new wishlist. It requires the user to be authenticated using the verifyJWT middleware and have the "customer" role. The controller function `createNewWishlist` will handle the logic for validating the input, creating a new wishlist in the database associated with the user, and returning the created wishlist information in the response.
router
  .route("/create")
  .post(verifyJWT, authorizedRole("customer"), createNewWishlist);

// This route is for fetching all wishlists of the user. It requires the user to be authenticated using the verifyJWT middleware and have the "customer" role. The controller function `getAllWishlist` will handle the logic for retrieving all wishlists associated with the user from the database, applying pagination and filtering based on query parameters such as page and limit, and returning the list of wishlists in the response.
router.route("/all").get(verifyJWT, authorizedRole("customer"), getAllWishlist);

// This route is for setting a default wishlist. It requires the user to be authenticated using the verifyJWT middleware and have the "customer" role. The controller function `setDefaultWishlist` will handle the logic for validating the input, ensuring that the specified wishlist exists and belongs to the user, updating the user's default wishlist setting in the database, and returning an appropriate response indicating the success of the operation.
router
  .route("/set-default")
  .post(verifyJWT, authorizedRole("customer"), setDefaultWishlist);

export default router;
