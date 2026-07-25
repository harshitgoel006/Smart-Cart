import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cartService } from "../services/cart.service.js";

// ======================================================
// =============== CUSTOMER PANNEL HANDLERS =============
// ======================================================


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

const getCartItems = asyncHandler(async (req, res) => {
  const cart = await cartService.getCartItems(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

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

const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeCartItem(
    req.user._id,
    req.params.itemId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Cart item removed successfully", cart));
});

const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await cartService.clearCart(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Cart cleared successfully", cart));
});

const applyCoupon = asyncHandler(async (req, res) => {
  const cart = await cartService.applyCoupon(req.user._id, req.body.couponCode);

  return res
    .status(200)
    .json(new ApiResponse(cart, "Coupon applied successfully"));
});

// ======================================================
// ================= ADMIN PANNEL HANDLERS ==============
// ======================================================


const getCartAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.body;
  const analytics = await cartService.getCartAnalytics(startDate, endDate);

  return res
    .status(200)
    .json(
      new ApiResponse(200, analytics, "Cart analytics fetched successfully"),
    );
});

const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await cartService.createCoupon(req.body);

  return res
    .status(201)
    .json(new ApiResponse(200, coupon, "Coupon created successfully"));
});

const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await cartService.updateCoupon(req.params.id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, coupon, "Coupon updated successfully"));
});

const listCoupons = asyncHandler(async (req, res) => {
  const result = await cartService.listCoupons(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Coupons fetched successfully"));
});

const resetUserCart = asyncHandler(async (req, res) => {
  const cart = await cartService.resetUserCart(req.params.userId);

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "User cart reset successfully"));
});


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
