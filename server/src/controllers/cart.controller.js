import {asyncHandler} from '../utils/asyncHandler.js';
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { Coupon } from "../models/coupon.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
// import { cartService } from '../services/cart.service.js';




// ======================================================
// =============== CUSTOMER PANNEL HANDLERS =============
// ======================================================




// add items to cart
const addItems = asyncHandler(async (req, res) => {
  const cart = await cartService.addItems(
    req.user._id,
    req.body.productId,
    req.body.quantity
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      true,
      "Items added to cart successfully",
      cart
    )
  );
});

// get cart items
const getCartItems = asyncHandler(async(req, res) =>{

    const cart = await cartService.getCartItems(req.user._id);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            true,
            cart,
            "Cart fetched successfully",
            
        )
    );
});

// update cart item quantity
const updateCartItem = asyncHandler(async(req, res) =>{
    const cart = await cartService.updateCartItem(
        req.user._id,
        req.body.productId,
        req.body.quantity
    );

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            true,
            "Cart item updated successfully",
            cart
        )
    );

});

// remove cart item
const removeCartItem = asyncHandler(async(req, res) =>{
    const cart = await cartService.removeCartItem(
        req.user._id,
        req.params.itemId
    )

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            true,
            "Cart item removed successfully",
            cart
        )
    );

});

// clear cart
const clearCart = asyncHandler(async(req, res) =>{
    const userId = req.user._id;
    const cart = await cartService.clearCart(userId);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            true, 
            "Cart cleared successfully",
            cart
        )
    );
});

// apply coupon
const applyCoupon = asyncHandler(async (req, res) => {
  const cart = await cartService.applyCoupon(
    req.user,
    req.body.couponCode
  );

  return res.status(200).json(
    new ApiResponse(
      true,
      "Coupon applied successfully",
      cart
    )
  );
});




// ======================================================
// ================= ADMIN PANNEL HANDLERS ==============
// ======================================================




// get cart analytics
const getCartAnalytics = asyncHandler(async(req, res) =>{

    const {startDate, endDate} = req.body;
    const analytics = await cartService.getCartAnalytics(
        startDate,
        endDate
    )

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,        
            true,
            "Cart analytics fetched successfully",
            analytics
        )
    );

});

// coupon management
const createCoupon = asyncHandler(async (req, res) => {

  const coupon = await cartService.createCoupon(req.body);
  

  return res
  .status(201)
  .json(
    new ApiResponse(
        200,
        true, 
        "Coupon created successfully", 
        coupon
    )
);
});

// update coupon
 const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await cartService.updateCoupon(
    req.params.id,
    req.body
  );

  return res
  .status(200)
  .json(
    new ApiResponse(
        200,
        true, 
        "Coupon updated successfully", 
        coupon
    )
  );
});

// list coupons
 const listCoupons = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;

 const result = await cartService.listCoupons(page,limit);

  return res
  .status(200)
  .json(
    new ApiResponse(
        200,
        true, 
        "Coupons list", 
        result
    )
  );
});

// reset user cart
const resetUserCart = asyncHandler(async(req, res) =>{

   const cart = await cartService.resetUserCart(req.params.userId);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            true,
            "User cart reset successfully",
            cart
        )
    );
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
    resetUserCart

};
