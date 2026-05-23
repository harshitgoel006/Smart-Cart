import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cartService } from "../services/cart.service.js";

// ======================================================
// =============== CUSTOMER PANNEL HANDLERS =============
// ======================================================

// This controller is responsible for adding items to the cart. It takes the productId, quantity, and selectedVariant from the request body and adds the item to the user's cart. The user's ID is obtained from the authenticated user information in the request object. After adding the item, it returns a success response with the updated cart information.

const addItems = asyncHandler(async (req, res) => {
  const cart = await cartService.addItems(
    req.user._id,
    req.body.productId,
    req.body.quantity,
    req.body.selectedVariant,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Items added to cart successfully"));
});

// This controller is responsible for fetching the items in the user's cart. It retrieves the cart items based on the user's ID, which is obtained from the authenticated user information in the request object. After fetching the cart items, it returns a success response with the cart details.

const getCartItems = asyncHandler(async (req, res) => {
  const cart = await cartService.getCartItems(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

// This controller is responsible for updating the quantity of a specific item in the user's cart. It takes the itemId from the request parameters and the new quantity from the request body. The user's ID is obtained from the authenticated user information in the request object. After updating the cart item, it returns a success response with the updated cart information.

const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.updateCartItem(
    req.user._id,
    req.params.itemId,
    req.body.quantity,
  );

  return res
    .status(200)
    .json(new ApiResponse(200,cart, "Cart item updated successfully"));
});

// This controller is responsible for removing a specific item from the user's cart. It takes the itemId from the request parameters and the user's ID from the authenticated user information in the request object. After removing the cart item, it returns a success response with the updated cart information.

const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeCartItem(
    req.user._id,
    req.params.itemId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Cart item removed successfully", cart));
});

// This controller is responsible for clearing all items from the user's cart. It takes the user's ID from the authenticated user information in the request object and removes all items from the cart. After clearing the cart, it returns a success response with the updated (empty) cart information.

const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await cartService.clearCart(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Cart cleared successfully", cart));
});

// This controller is responsible for applying a coupon code to the user's cart. It takes the couponCode from the request body and the user's ID from the authenticated user information in the request object. The controller calls the cart service to apply the coupon to the cart and returns a success response with the updated cart information, including any discounts applied.

const applyCoupon = asyncHandler(async (req, res) => {
  const cart = await cartService.applyCoupon(req.user._id, req.body.couponCode);

  return res
    .status(200)
    .json(new ApiResponse(cart, "Coupon applied successfully"));
});

// ======================================================
// ================= ADMIN PANNEL HANDLERS ==============
// ======================================================

// This controller is responsible for fetching analytics related to the cart. It takes the startDate and endDate from the request body to filter the analytics data based on a specific time range. The controller calls the cart service to retrieve the analytics data and returns a success response with the analytics information.

const getCartAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.body;
  const analytics = await cartService.getCartAnalytics(startDate, endDate);

  return res
    .status(200)
    .json(
      new ApiResponse(200, analytics, "Cart analytics fetched successfully"),
    );
});

// This controller is responsible for creating a new coupon. It takes the coupon details from the request body and calls the cart service to create the coupon. After successfully creating the coupon, it returns a success response with the newly created coupon information.

const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await cartService.createCoupon(req.body);

  return res
    .status(201)
    .json(new ApiResponse(200, coupon, "Coupon created successfully"));
});

// This controller is responsible for updating an existing coupon. It takes the coupon ID from the request parameters and the updated coupon details from the request body. The controller calls the cart service to update the coupon information and returns a success response with the updated coupon details.

const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await cartService.updateCoupon(req.params.id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, coupon, "Coupon updated successfully"));
});

// This controller is responsible for fetching a list of coupons based on the provided query parameters. It takes the query parameters from the request object and calls the cart service to retrieve the list of coupons that match the criteria. After fetching the coupons, it returns a success response with the list of coupons.

const listCoupons = asyncHandler(async (req, res) => {
  const result = await cartService.listCoupons(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Coupons fetched successfully"));
});

// This controller is responsible for resetting a user's cart. It takes the userId from the request parameters and calls the cart service to reset the cart for that user. After resetting the cart, it returns a success response with the updated (empty) cart information.

const resetUserCart = asyncHandler(async (req, res) => {
  const cart = await cartService.resetUserCart(req.params.userId);

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "User cart reset successfully"));
});

// Exporting all the controller functions to be used in the routes. This allows other parts of the application to import these controllers and use them to handle requests related to cart operations, coupon management, and analytics.

export {
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
};
