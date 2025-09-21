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



// This route is for adding a product to wishlist
router.route("/items").post(
    verifyJWT,
    authorizedRole("customer"),
    addProductToWishlist
);

// This route is for removing a product from wishlist
router.route("/items/:itemId").delete(
    verifyJWT,
    authorizedRole("customer"),
    removeProductFromWishlist
);

// This route is for viewing the wishlist
router.route("/").get(
    verifyJWT,
    authorizedRole("customer"),
    viewWishlist
);

// This route is for moving a wishlist item to cart
router.route("/items/:itemId/move-to-cart").post(
    verifyJWT,
    authorizedRole("customer"),
    moveListItemToCart
);

// This route is for checking wishlist item availability
router.route("/check-availability").get(
    verifyJWT,
    authorizedRole("customer"),
    wishlistItemAvailablity
);

// This route is for getting wishlist count
router.route("/count").get(
    verifyJWT,
    authorizedRole("customer"),
    getWishlistCount
);

// This route is for clearing the wishlist
router.route("/clear").delete(
    verifyJWT,
    authorizedRole("customer"),
    clearWishlist
);

// This route is for changing wishlist privacy
router.route("/privacy").put(
    verifyJWT,
    authorizedRole("customer"),
    wishlistPrivacy
);

// This route is for creating a new wishlist
router.route("/create").post(
    verifyJWT,
    authorizedRole("customer"),
    createNewWishlist
);

// This route is for getting all wishlists of a user
router.route("/all").get(
    verifyJWT,
    authorizedRole("customer"),
    getAllWishlist
);

// This route is for setting a default wishlist
router.route("/set-default").post(
    verifyJWT,
    authorizedRole("customer"),
    setDefaultWishlist
);




export default router;