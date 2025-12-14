import {asyncHandler} from '../utils/asyncHandler.js';
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { Coupon } from "../models/coupon.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import createAndSendNotification from "../utils/sendNotification.js";




// ======================================================
// =============== CUSTOMER PANNEL HANDLERS =============
// ======================================================




// add items to cart
const addItems = asyncHandler(async(req, res) =>{
    const userId = req.user._id;
    const {productId, quantity} = req.body;

    if(!productId){
        throw new ApiError(400, "Product ID is required");
    }

    if(!quantity || quantity<1){
        throw new ApiError(400, "Quantity should be at least 1");
    }

    const product = await Product.findById(productId);

    if(!product){
        throw new ApiError(404, "Product not found");
    }
    let cart = await Cart.findOne({user:userId});

    if(!cart){
        cart = new Cart({user:userId, items:[]});
    }
    await cart.addItems(productId, quantity || 1, product.price);

    return res
    .status(200)
    .json(
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

    const userId = req.user._id;

    const cart = await Cart.findOne({user:userId})
    .populate("items.prroduct" , "name price images ");

    if(!cart || cart.items.length === 0){
        throw new ApiError(404, "Cart is empty");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            true,
            "Cart fetched successfully",
            cart
        )
    );
});

// update cart item quantity
const updateCartItem = asyncHandler(async(req, res) =>{
    const userId = req.user._id;
    const {productId, quantity} = req.body;

    if(!productId){
        throw new ApiError(400, "Product ID is required");
    }

    if(!quantity || quantity<1){
        throw new ApiError(400, "Quantity should be at least 1");
    }

    const cart = await Cart.findOne({user:userId});

    if(!cart){
        throw new ApiError(404, "Cart not found");
    }

    const index = cart.items.findIndex(item=> item.product.toString() === productId.toString());

    if(index === -1){
        throw new ApiError(404, "Product not found in cart");
    }

    cart.items[index].quantity = quantity;

    await cart.calculateTotals();
    await cart.save();

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
    const userId = req.user._id;

    const {productId} = req.params;

    if(!productId){
        throw new ApiError(400, "Product ID is required");
    }

    const cart  = await Cart.findOne({user:userId});

    if(!cart){
        throw new ApiError(404, "Cart not found");
    }

    await cart.removeItem(productId);

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

    const cart = await Cart.findOne({user:userId});

    if(!cart){
        throw new ApiError(404, "Cart not found");
    }

    await cart.clearCart();

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
  const userId = req.user._id;
  const { couponCode } = req.body;

  if (!couponCode) {
    throw new ApiError(400, "Coupon code is required");
  }

  const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
  if (!coupon) {
    throw new ApiError(404, "Invalid or inactive coupon code");
  }

  const now = new Date();
  if (coupon.expiryDate && coupon.expiryDate < now) {
    throw new ApiError(400, "Coupon code has expired");
  }


  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  let discountAmount = 0;

  if (coupon.discountAmount) {
    discountAmount = coupon.discountAmount;
  } else if (coupon.discountPercent) {
    discountAmount = (coupon.discountPercent / 100) * cart.totalPrice;
  }

  cart.couponCode = coupon.code;
  cart.discountAmount = discountAmount;
  cart.totalPrice = Math.max(0, cart.totalPrice - discountAmount);

  await cart.save();

  try {
    await createAndSendNotification({
      recipientId: userId,
      recipientRole: "customer",
      recipientEmail: req.user.email,
      type: "COUPON_APPLIED",
      title: "Coupon applied successfully",
      message: `Coupon ${coupon.code} applied on your cart.`,
      relatedEntity: {
        entityType: "cart",
        entityId: cart._id,
      },
      channels: ["in-app", "email"],
      meta: {
        couponCode: coupon.code,
        discount: discountAmount,
      },
    });
  } catch (e) {
    console.error("COUPON_APPLIED notification failed", e);
  }

  return res
    .status(200)
    .json(
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

    const matchStage = {};

    if(startDate || endDate){
        matchStage.updatedAt = {};
    }

    if(startDate){
        matchStage.updatedAt.$gte = new Date(startDate);
    }
    if(endDate){
        matchStage.updatedAt.$lte = new Date(endDate);
    }

    const activeCarts = await Cart.countDocuments(matchStage);

    const avgCartValue = await Cart.aggregate([

        {
            $match: matchStage

        },
        {
            $group:{
                _id:null,
                avgTotal : {
                    $avg: "$totalPrice"
                }
            }
        },
    ]);

    const analytics = {
        activeCarts,
        avgCartValue: avgCartValue[0] ? avgCartValue[0].avgTotal : 0
    };
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
  const data = req.body;
  if (!data.code || !data.discountType || data.discountValue == null) {
    throw new ApiError(400, "Required fields missing");
  }

  const exist = await Coupon.findOne({ code: data.code.toUpperCase() });
  if (exist) {
    throw new ApiError(400, "Coupon code already exists");
  }

  const coupon = new Coupon({
    ...data,
    code: data.code.toUpperCase(),
  });

  await coupon.save();

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
  const { id } = req.params;
  const data = req.body;

  const coupon = await Coupon.findById(id);
  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  Object.assign(coupon, data);

  if (data.code) coupon.code = data.code.toUpperCase();

  await coupon.save();

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

  const coupons = await Coupon.find({})
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalCount = await Coupon.countDocuments();

  return res
  .status(200)
  .json(
    new ApiResponse(
        200,
        true, 
        "Coupons list", 
        {
            coupons,
            totalCount,
            page,
            limit,
        }
    )
  );
});

// reset user cart
const resetUserCart = asyncHandler(async(req, res) =>{

    const {userId} = req.params;

    if(!userId){
        throw new ApiError(400, "User ID is required");
    }

    const cart =await Cart.findOne({user:userId});

    if(!cart){
        throw new ApiError(404, "Cart not found");
    }

    await cart.clearCart();

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
