import {asyncHandler} from '../utils/asyncHandler.js';
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { Coupon } from "../models/coupon.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import createAndSendNotification from "../utils/sendNotification.js";





export const cartService = {




  async addItems(userId, productId, quantity) 
  {
    if (!productId) {
      throw new ApiError(400, "Product ID is required");
    }

    if (!quantity || quantity < 1) {
      throw new ApiError(400, "Quantity should be at least 1");
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    await cart.addItems(productId, quantity || 1, product.price);

    return cart;
  },

  async getCartItems(userId) 
  {
    const cart = await Cart.findOne({ user: userId })
    .populate("items.product", "name price images");
    if (!cart || !cart.items || cart.items.length === 0) 
        {
            throw new ApiError(400, "Cart is empty.");
        }
        return cart;
    
  },

  async updateCartItem(userId, productId, quantity) {
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  if (!quantity || quantity < 1) {
    throw new ApiError(400, "Quantity should be at least 1");
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const index = cart.items.findIndex(
    item => item.product.toString() === productId.toString()
  );

  if (index === -1) {
    throw new ApiError(404, "Product not found in cart");
  }

  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    throw new ApiError(404, "Product not available");
  }

  if (quantity > product.stock) {
    throw new ApiError(
      400,
      `Only ${product.stock} items available in stock`
    );
  }

  cart.items[index].quantity = quantity;

  await cart.calculateTotals();
  await cart.save();

  return cart;
},


async removeCartItem(userId, itemId) {
  if (!itemId || !itemId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ApiError(400, "Valid item ID required");
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const initialCount = cart.items.length;

  cart.items = cart.items.filter(
    item => item._id.toString() !== itemId
  );

  if (cart.items.length === initialCount) {
    throw new ApiError(404, "Item not found in cart");
  }

  await cart.calculateTotals();
  await cart.save();

  return cart;
},


async clearCart(userId) {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  await cart.clearCart();

  return cart;
},

async applyCoupon(user, couponCode) {
  const userId = user._id;

  if (!couponCode) {
    throw new ApiError(400, "Coupon code is required");
  }

  const coupon = await Coupon.findOne({
    code: couponCode.toUpperCase(),
  });

  if (!coupon) {
    throw new ApiError(404, "Invalid or inactive coupon code");
  }

  const now = new Date();

  if (coupon.expiryDate && coupon.expiryDate < now) {
    throw new ApiError(400, "Coupon code has expired");
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  let discountAmount = 0;

  if (coupon.discountAmount) {
    discountAmount = coupon.discountAmount;
  } else if (coupon.discountPercent) {
    discountAmount =
      (coupon.discountPercent / 100) * cart.totalPrice;
  }

  cart.couponCode = coupon.code;
  cart.discountAmount = discountAmount;

  await cart.save();
  await cart.calculateTotals();
  await cart.save();

  try {
    await createAndSendNotification({
      recipientId: userId,
      recipientRole: "customer",
      recipientEmail: user.email,
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

  return cart;
},



async getCartAnalytics(startDate, endDate) {
    const matchStage = {};

    if (startDate || endDate) {
      matchStage.updatedAt = {};
    }

    if (startDate) {
      matchStage.updatedAt.$gte = new Date(startDate);
    }

    if (endDate) {
      matchStage.updatedAt.$lte = new Date(endDate);
    }

    const activeCarts = await Cart.countDocuments(matchStage);

    const avgCartValue = await Cart.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          avgTotal: { $avg: "$totalPrice" },
        },
      },
    ]);

    const analytics = {
      activeCarts,
      avgCartValue: avgCartValue[0]
        ? avgCartValue[0].avgTotal
        : 0,
    };

    return analytics;
  },



  async createCoupon(data) {
    if (!data.code || !data.discountType || data.discountValue == null) {
      throw new ApiError(400, "Required fields missing");
    }

    const exist = await Coupon.findOne({
      code: data.code.toUpperCase(),
    });

    if (exist) {
      throw new ApiError(400, "Coupon code already exists");
    }

    const coupon = new Coupon({
      ...data,
      code: data.code.toUpperCase(),
    });

    await coupon.save();

    return coupon;
  },


  async updateCoupon(id, data) {
  const coupon = await Coupon.findById(id);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  Object.assign(coupon, data);

  if (data.code) {
    coupon.code = data.code.toUpperCase();
  }

  await coupon.save();

  return coupon;
},

async listCoupons(page, limit) {
  const skip = (page - 1) * limit;

  const coupons = await Coupon.find({})
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalCount = await Coupon.countDocuments();

  return {
    coupons,
    totalCount,
    page,
    limit,
  };
},

async resetUserCart(userId) {
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  await cart.clearCart();

  return cart;
},







};
