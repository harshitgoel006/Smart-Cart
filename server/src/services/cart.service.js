import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { Coupon } from "../models/coupon.model.js";
import {ApiError} from "../utils/ApiError.js";



export const cartService = {


  // ======================================================
  // =============== CUSTOMER PANNEL HANDLERS =============
  // ======================================================


 
  async addItems(userId, productId, quantity, selectedVariant = null,session = null) {

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  if (!quantity || quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  const product = await Product.findOne({
    _id: productId,
    isDeleted: false,
    isActive: true,
    approvalStatus: "approved",
    isArchived: false
  });

  if (!product) {
    throw new ApiError(404, "Product not available");
  }

  let stock = product.stock;
  let effectivePrice = parseFloat(product.finalPrice.toString());

  if (selectedVariant?.label && selectedVariant?.value) {

    const variant = product.variants.find(
      v => v.label === selectedVariant.label
    );

    if (!variant) {
      throw new ApiError(400, "Invalid variant");
    }

    const option = variant.options.find(
      o => o.value === selectedVariant.value
    );

    if (!option) {
      throw new ApiError(400, "Invalid variant option");
    }

    stock = option.stock;

    if (option.price) {
      effectivePrice = parseFloat(option.price.toString());
    }
  }

  if (quantity > stock) {
    throw new ApiError(400, `Only ${stock} items available`);
  }

  const now = new Date();

  let flashDiscount = 0;

  if (
    product.flashSale?.isActive &&
    product.flashSale.start <= now &&
    product.flashSale.end >= now
  ) {
    flashDiscount = product.flashSale.discount;
    effectivePrice =
      effectivePrice -
      (effectivePrice * flashDiscount) / 100;
  }

  let cart = await Cart.findOne({ user: userId }).session(session);

  if(!cart){
    const [newCart] = await Cart.create(
      [{user: userId, items: []}],
      {session}
    );
    cart = newCart;
  }

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  if (cart.isLocked) {
    throw new ApiError(400, "Cart is locked for checkout");
  }

  const existing = cart.items.find(
    item =>
      item.product.toString() === productId &&
      item.selectedVariant?.value === selectedVariant?.value
  );

  if (existing) {

    if (existing.quantity + quantity > stock) {
      throw new ApiError(400, "Stock exceeded");
    }

    existing.quantity += quantity;

  } else {

    cart.items.push({
      product: product._id,
      seller: product.seller,
      selectedVariant,
      quantity,
      unitPriceSnapshot:
        mongoose.Types.Decimal128.fromString(
          effectivePrice.toFixed(2)
        ),
      discountSnapshot: product.discount || 0,
      flashSaleSnapshot: flashDiscount,
      lineTotalSnapshot:
        mongoose.Types.Decimal128.fromString(
          (effectivePrice * quantity).toFixed(2)
        )
    });
  }

  cart.calculateTotals();

  await cart.save();

  return cart;
  },

  async getCartItems(userId) {

  let cart = await Cart.findOne({ user: userId })
    .populate({
      path: "items.product",
      select: "name slug images isActive isDeleted approvalStatus stock variants"
    });


  if (!cart) {
    return {
      items: [],
      totalItems: 0,
      subtotal: 0,
      discountAmount: 0,
      finalAmount: 0
    };
  }

  if (cart.expiresAt && cart.expiresAt < new Date()) {

    cart.items = [];
    cart.discountAmount =
      mongoose.Types.Decimal128.fromString("0.00");
    cart.coupon = null;

    cart.calculateTotals();
    await cart.save();
  }

  const validItems = [];

  for (const item of cart.items) {

    const product = item.product;

    if (
      product &&
      !product.isDeleted &&
      product.isActive &&
      product.approvalStatus === "approved"
    ) {
      validItems.push(item);
    }
  }

  if (validItems.length !== cart.items.length) {
    cart.items = validItems;
    cart.calculateTotals();
    await cart.save();
  }

  return {
    _id: cart._id,
    items: cart.items,
    totalItems: cart.totalItems,
    subtotal: parseFloat(cart.subtotal.toString()),
    discountAmount: parseFloat(
      cart.discountAmount.toString()
    ),
    finalAmount: parseFloat(
      cart.finalAmount.toString()
    ),
    isLocked: cart.isLocked
  };
  },

  async updateCartItem(userId, itemId, quantity) {

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, "Invalid cart item ID");
  }

  if (!quantity || quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  if (cart.isLocked) {
    throw new ApiError(400, "Cart is locked for checkout");
  }

  const item = cart.items.id(itemId);

  if (!item) {
    throw new ApiError(404, "Item not found in cart");
  }

  const product = await Product.findOne({
    _id: item.product,
    isDeleted: false,
    isActive: true,
    approvalStatus: "approved",
    isArchived: false
  });

  if (!product) {
    throw new ApiError(400, "Product no longer available");
  }

  let stock = product.stock;

  if (item.selectedVariant?.label && item.selectedVariant?.value) {

    const variant = product.variants.find(
      v => v.label === item.selectedVariant.label
    );

    if (!variant) {
      throw new ApiError(400, "Variant no longer exists");
    }

    const option = variant.options.find(
      o => o.value === item.selectedVariant.value
    );

    if (!option) {
      throw new ApiError(400, "Variant option no longer exists");
    }

    stock = option.stock;
  }

  if (quantity > stock) {
    throw new ApiError(
      400,
      `Only ${stock} items available`
    );
  }

  item.quantity = quantity;

  const unit = parseFloat(
    item.unitPriceSnapshot.toString()
  );

  const lineTotal = unit * quantity;

  item.lineTotalSnapshot =
    mongoose.Types.Decimal128.fromString(
      lineTotal.toFixed(2)
    );


  cart.calculateTotals();

  await cart.save();

  return {
    items: cart.items,
    totalItems: cart.totalItems,
    subtotal: parseFloat(cart.subtotal.toString()),
    finalAmount: parseFloat(cart.finalAmount.toString())
  };
  },

  async removeCartItem(userId, itemId) {

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, "Invalid cart item ID");
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  if (cart.isLocked) {
    throw new ApiError(400, "Cart is locked for checkout");
  }

  const item = cart.items.id(itemId);

  if (!item) {
    throw new ApiError(404, "Item not found in cart");
  }

  item.deleteOne();

  if (cart.items.length === 0) {
    cart.discountAmount =
      mongoose.Types.Decimal128.fromString("0.00");
    cart.coupon = null;
  }

  cart.calculateTotals();

  await cart.save();

  return {
    items: cart.items,
    totalItems: cart.totalItems,
    subtotal: parseFloat(cart.subtotal.toString()),
    discountAmount: parseFloat(
      cart.discountAmount.toString()
    ),
    finalAmount: parseFloat(cart.finalAmount.toString())
  };
  },
  
  async clearCart(userId) {

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return {
      items: [],
      totalItems: 0,
      subtotal: 0,
      discountAmount: 0,
      finalAmount: 0
    };
  }

  if (cart.isLocked) {
    throw new ApiError(400, "Cart is locked for checkout");
  }

  cart.items = [];
  cart.coupon = null;
  cart.discountAmount = mongoose.Types.Decimal128.fromString("0.00");

  cart.calculateTotals();
  await cart.save();

  return {
    items: [],
    totalItems: 0,
    subtotal: 0,
    discountAmount: 0,
    finalAmount: 0
  };
  },

  async applyCoupon(userId, couponCode) {

  if (!couponCode) {
    throw new ApiError(400, "Coupon code required");
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  if (cart.isLocked) {
    throw new ApiError(400, "Cart is locked for checkout");
  }

  const coupon = await Coupon.findOne({
    code: couponCode.toUpperCase(),
    isActive: true
  });

  if (!coupon) {
    throw new ApiError(404, "Invalid or inactive coupon");
  }

  const now = new Date();

  if (coupon.expiryDate && coupon.expiryDate < now) {
    throw new ApiError(400, "Coupon expired");
  }

  const subtotal = parseFloat(cart.subtotal.toString());

  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    throw new ApiError(
      400,
      `Minimum order value is ₹${coupon.minOrderValue}`
    );
  }

  if (coupon.usageLimitPerUser) {

    const usageCount = await Order.countDocuments({
      user: userId,
      coupon: coupon._id
    });

    if (usageCount >= coupon.usageLimitPerUser) {
      throw new ApiError(400, "Coupon usage limit exceeded");
    }
  }

  let discountAmount = 0;

  if (coupon.discountType === "flat") {
    discountAmount = coupon.discountValue;
  }

  if (coupon.discountType === "percent") {
    discountAmount =
      (coupon.discountValue / 100) * subtotal;

    if (coupon.maxDiscount) {
      discountAmount = Math.min(
        discountAmount,
        coupon.maxDiscount
      );
    }
  }

  discountAmount = Math.min(discountAmount, subtotal);
  cart.coupon = coupon._id;

  cart.discountAmount =
    mongoose.Types.Decimal128.fromString(
      discountAmount.toFixed(2)
    );

  cart.calculateTotals();

  await cart.save();

  return {
    items: cart.items,
    subtotal,
    discountAmount,
    finalAmount: parseFloat(
      cart.finalAmount.toString()
    )
  };
  },



  
  // ======================================================
  // ================= ADMIN PANNEL HANDLERS ==============
  // ======================================================



  
  async getCartAnalytics(startDate, endDate){
    const match = {};

    if(startDate || endDate){
      match.updatedAt = {};

      if(startDate){
        match.updatedAt.$gte = new Date(startDate);
      }
      if(endDate){
        match.updatedAt.$lte = new Date(endDate);
      }
    }

    match.$or = [
      {expiresAt: null},
      {expiresAt: {$gt: new Date()}}
    ];

    const analytics = await Cart.aggregate([
      {$match: match},
      {
        $addFields:{
          finalAmountNumber:{
            $toDouble: "$finalAmount"
          }
        }
      },
      {
        $group : {
          _id: null,
          totalCarts:{$sum:1},
          activeCarts:{
            $sum:{
              $cond:[
                {
                  $gt:["$totalItems",0]
                },
                1,
                0
              ]
            }
          },
          lockedCarts:{
            $sum: {
              $cond:[
                {
                  $eq: ["$isLocked", true]
                },
                1,
                0
              ]
            }
          },
          avgCartValue:{
            $avg:"$finalAmountNumber"
          },
          totalCartValue:{
            $sum:"$finalAmountNumber"
          }
        }
      }
    ]);

    if(!analytics.length){
      return{
        totalCarts:0,
        activeCarts:0,
        lockedCarts:0,
        avgCartValue:0,
        totalCartValue:0
      };
    }

    return {
      totalCarts: analytics[0].totalCarts,
      activeCarts: analytics[0].activeCarts,
      lockedCarts: analytics[0].lockedCarts,
      avgCartValue: analytics[0].avgCartValue || 0,
      totalCartValue: analytics[0].totalCartValue || 0
    }

  },

  async createCoupon(data) {

  const {
    code,
    discountType,
    discountValue,
    expiryDate,
    minOrderValue = 0,
    maxDiscount = null,
    usageLimit = null,
    usageLimitPerUser = null
  } = data;

  if (!code || !discountType || discountValue == null) {
    throw new ApiError(400, "Required fields missing");
  }

  const normalizedCode = code.toUpperCase().trim();

  const allowedTypes = ["flat", "percent"];

  if (!allowedTypes.includes(discountType)) {
    throw new ApiError(400, "Invalid discount type");
  }

  if (discountValue <= 0) {
    throw new ApiError(400, "Discount value must be positive");
  }

  if (discountType === "percent" && discountValue > 100) {
    throw new ApiError(400, "Percent cannot exceed 100");
  }

  if (minOrderValue < 0) {
    throw new ApiError(400, "Invalid minimum order value");
  }

  if (usageLimit && usageLimit < 0) {
    throw new ApiError(400, "Invalid usage limit");
  }

  if (usageLimitPerUser && usageLimitPerUser < 0) {
    throw new ApiError(400, "Invalid per-user usage limit");
  }

  if (expiryDate && new Date(expiryDate) < new Date()) {
    throw new ApiError(400, "Expiry date must be in future");
  }

  const exist = await Coupon.findOne({
    code: normalizedCode
  });

  if (exist) {
    throw new ApiError(400, "Coupon code already exists");
  }

  const coupon = await Coupon.create({
    code: normalizedCode,
    discountType,
    discountValue,
    expiryDate,
    minOrderValue,
    maxDiscount,
    usageLimit,
    usageLimitPerUser,
    isActive: true
  });

  return coupon;
  },

  async updateCoupon(couponId, data) {

  if (!mongoose.Types.ObjectId.isValid(couponId)) {
    throw new ApiError(400, "Invalid coupon ID");
  }

  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  const allowedFields = [
    "code",
    "discountType",
    "discountValue",
    "expiryDate",
    "minOrderValue",
    "maxDiscount",
    "usageLimit",
    "usageLimitPerUser",
    "isActive"
  ];

  for (const key of Object.keys(data)) {
    if (!allowedFields.includes(key)) {
      delete data[key];
    }
  }

  if (data.code) {

    const normalized = data.code.toUpperCase().trim();

    const existing = await Coupon.findOne({
      code: normalized,
      _id: { $ne: couponId }
    });

    if (existing) {
      throw new ApiError(400, "Coupon code already exists");
    }

    coupon.code = normalized;
  }

  if (data.discountType) {

    const allowedTypes = ["flat", "percent"];

    if (!allowedTypes.includes(data.discountType)) {
      throw new ApiError(400, "Invalid discount type");
    }

    coupon.discountType = data.discountType;
  }

  if (data.discountValue != null) {

    if (data.discountValue <= 0) {
      throw new ApiError(400, "Discount must be positive");
    }

    if (
      coupon.discountType === "percent" &&
      data.discountValue > 100
    ) {
      throw new ApiError(400, "Percent cannot exceed 100");
    }

    coupon.discountValue = data.discountValue;
  }

  if (data.minOrderValue != null) {

    if (data.minOrderValue < 0) {
      throw new ApiError(400, "Invalid min order value");
    }

    coupon.minOrderValue = data.minOrderValue;
  }

  if (data.maxDiscount != null) {

    if (data.maxDiscount < 0) {
      throw new ApiError(400, "Invalid max discount");
    }

    coupon.maxDiscount = data.maxDiscount;
  }

  if (data.usageLimit != null && data.usageLimit < 0) {
    throw new ApiError(400, "Invalid usage limit");
  }

  if (data.usageLimitPerUser != null &&
      data.usageLimitPerUser < 0) {
    throw new ApiError(400, "Invalid per-user usage limit");
  }

  if (data.expiryDate) {

    if (new Date(data.expiryDate) < new Date()) {
      throw new ApiError(400, "Expiry must be future date");
    }

    coupon.expiryDate = data.expiryDate;
  }

  if (typeof data.isActive === "boolean") {
    coupon.isActive = data.isActive;
  }

  await coupon.save();

  return coupon;
  },

  async listCoupons(query) {

  let {
    page = 1,
    limit = 20,
    search,
    status
  } = query;

  page = Math.max(1, Number(page));
  limit = Math.min(50, Number(limit)); 

  const skip = (page - 1) * limit;

  const filter = {};

  if (search) {
    filter.code = {
      $regex: search.toUpperCase(),
      $options: "i"
    };
  }

  const now = new Date();

  if (status === "active") {
    filter.isActive = true;
    filter.$or = [
      { expiryDate: null },
      { expiryDate: { $gt: now } }
    ];
  }

  if (status === "expired") {
    filter.expiryDate = { $lt: now };
  }

  if (status === "exhausted") {
    filter.$expr = {
      $gte: ["$usageCount", "$totalUsageLimit"]
    };
  }

  const [coupons, total] = await Promise.all([
    Coupon.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Coupon.countDocuments(filter)
  ]);

  const formatted = coupons.map(c => ({
    ...c,
    isExpired:
      c.expiryDate && c.expiryDate < now,
    isExhausted:
      c.usageCount >= c.totalUsageLimit
  }));

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    coupons: formatted
  };
  },

  async resetUserCart(userId) {

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return {
      items: [],
      totalItems: 0,
      subtotal: 0,
      discountAmount: 0,
      finalAmount: 0
    };
  }

  cart.items = [];

  cart.coupon = null;

  cart.discountAmount =
    mongoose.Types.Decimal128.fromString("0.00");

  cart.isLocked = false;

  cart.expiresAt = null;

  cart.calculateTotals();

  await cart.save();

  return {
    items: [],
    totalItems: 0,
    subtotal: 0,
    discountAmount: 0,
    finalAmount: 0
  };
  },

};
