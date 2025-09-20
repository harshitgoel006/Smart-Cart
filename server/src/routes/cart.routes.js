import { Router } from "express";
import{
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
    resetUserCart
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";


const router = Router();


// ======================================================
// =============== CUSTOMER PANEL HANDLERS ==============
// ======================================================


// This route is for adding items to cart
router.route("/add")
.post(
    verifyJWT, 
    authorizedRole("customer"), 
    addItems
);

// This route is for getting cart items
router.route("/")
.get(
    verifyJWT, 
    authorizedRole("customer"), 
    getCartItems
);

// This route is for updating a cart item
router.route("/update/:itemId")
.put(
    verifyJWT, 
    authorizedRole("customer"), 
    updateCartItem
);

// This route is for removing an item from cart
router.route("/remove/:itemId").delete(
    verifyJWT, 
    authorizedRole("customer"), 
    removeCartItem
);

// This route is for clearing the cart
router.route("/clear").delete(
    verifyJWT, 
    authorizedRole("customer"), 
    clearCart
);

// This route is for applying a coupon to the cart
router.route("/apply-coupon").post(
    verifyJWT, 
    authorizedRole("customer"), 
    applyCoupon
);



// ======================================================
// =============== ADMIN PANEL HANDLERS =================
// ======================================================


// This route is for getting cart analytics
router.route("/cart-analytics").get(
    verifyJWT,
    authorizedRole("admin"),
    getCartAnalytics
);

// Routes for managing coupons
router.route("/coupons").post(
    verifyJWT,
    authorizedRole("admin"),    
    createCoupon
);

// Routes for updating and listing coupons
router.route("/coupons/:couponId").put(
    verifyJWT,
    authorizedRole("admin"),    
    updateCoupon
);
router.route("/coupon/list").get(
    verifyJWT,
    authorizedRole("admin"),        
    listCoupons
);

// Route for resetting a user's cart
router.route("/cart/reset/:userId").put(
    verifyJWT,
    authorizedRole("admin"),        
    resetUserCart
);



export default router;
