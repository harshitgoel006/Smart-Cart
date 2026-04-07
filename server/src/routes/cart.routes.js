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



// This routes is used for adding items to the cart. It requires the user to be authenticated and have the "customer" role. The controller function `addItems` will handle the logic for adding items to the cart, such as validating the input, checking product availability, and updating the cart in the database.

router.route("/add")
.post(
    verifyJWT, 
    authorizedRole("customer"), 
    addItems
);



// This route is for fetching the items in the cart. It also requires the user to be authenticated and have the "customer" role. The controller function `getCartItems` will handle retrieving the cart items from the database and returning them in the response.

router.route("/")
.get(
    verifyJWT, 
    authorizedRole("customer"), 
    getCartItems
);



// This route is for updating a cart item. It requires the user to be authenticated and have the "customer" role. The controller function `updateCartItem` will handle the logic for updating the quantity or other details of a specific cart item based on the provided item ID.

router.route("/update/:itemId")
.put(
    verifyJWT, 
    authorizedRole("customer"), 
    updateCartItem
);




// This route is for removing a specific item from the cart. It requires the user to be authenticated and have the "customer" role. The controller function `removeCartItem` will handle the logic for removing the specified item from the cart in the database.

router.route("/remove/:itemId").delete(
    verifyJWT, 
    authorizedRole("customer"), 
    removeCartItem
);



// This route is for clearing all items from the cart. It requires the user to be authenticated and have the "customer" role. The controller function `clearCart` will handle the logic for removing all items from the user's cart in the database.

router.route("/clear").delete(
    verifyJWT, 
    authorizedRole("customer"), 
    clearCart
);




// This route is for applying a coupon to the cart. It requires the user to be authenticated and have the "customer" role. The controller function `applyCoupon` will handle the logic for validating the coupon code, checking its applicability to the cart, and applying any discounts to the cart totals accordingly.

router.route("/apply-coupon").post(
    verifyJWT, 
    authorizedRole("customer"), 
    applyCoupon
);



// ======================================================
// =============== ADMIN PANEL HANDLERS =================
// ======================================================




// This route is for fetching cart analytics data. It requires the user to be authenticated and have the "admin" role. The controller function `getCartAnalytics` will handle the logic for aggregating and returning various analytics related to carts, such as total carts, average cart value, popular products in carts, etc.

router.route("/cart-analytics").get(
    verifyJWT,
    authorizedRole("admin"),
    getCartAnalytics
);




// This route is for creating a new coupon. It requires the user to be authenticated and have the "admin" role. The controller function `createCoupon` will handle the logic for validating the input data, creating a new coupon in the database, and returning the created coupon information in the response.

router.route("/coupons").post(
    verifyJWT,
    authorizedRole("admin"),    
    createCoupon
);




// This route is for updating an existing coupon. It requires the user to be authenticated and have the "admin" role. The controller function `updateCoupon` will handle the logic for validating the input data, updating the specified coupon in the database based on the provided coupon ID, and returning the updated coupon information in the response.

router.route("/coupons/:couponId").put(
    verifyJWT,
    authorizedRole("admin"),    
    updateCoupon
);




// This route is for fetching a list of coupons based on query parameters. It requires the user to be authenticated and have the "admin" role. The controller function `listCoupons` will handle the logic for retrieving coupons from the database based on the provided query parameters (such as pagination, filtering, etc.) and returning the list of coupons in the response.

router.route("/coupon/list").get(
    verifyJWT,
    authorizedRole("admin"),        
    listCoupons
);




// This route is for resetting a user's cart. It requires the user to be authenticated and have the "admin" role. The controller function `resetUserCart` will handle the logic for clearing the cart of a specific user based on the provided user ID, and returning the updated (empty) cart information in the response.

router.route("/cart/reset/:userId").put(
    verifyJWT,
    authorizedRole("admin"),        
    resetUserCart
);



export default router;
