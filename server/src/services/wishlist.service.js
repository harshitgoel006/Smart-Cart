import { Wishlist } from "../models/wishlist.model.js";
import { WishlistItem } from '../models/wishlist.model.js';
import { Product } from "../models/product.model.js";
import {ApiError} from "../utils/ApiError.js";
import mongoose from "mongoose";
import { cartService } from "./cart.service.js";


export const WishlistService = {

  async addProduct(userId, productId, variantId, note) {

  if (!mongoose.Types.ObjectId.isValid(productId))
    throw new ApiError(400, "Invalid product ID");

  const product = await Product.findOne({
    _id: productId,
    isActive: true,
    isDeleted: false,
    approvalStatus: "approved",
    isArchived: false
  });

  if (!product)
    throw new ApiError(404, "Product not found");

  let selectedPrice = product.price;

  if (variantId) {

    const variant = product.variants?.find(
      v => v._id.toString() === variantId.toString()
    );

    if (!variant)
      throw new ApiError(404, "Variant not found");

    selectedPrice = variant.price;
  }

  let wishlist = await Wishlist.findOne({
    user: userId,
    isDefault: true,
    isDeleted: false
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      name: "My Wishlist",
      isDefault: true
    });
  }

  try {

    await WishlistItem.create({
      wishlist: wishlist._id,
      user: userId,
      product: productId,
      variant: variantId || null,
      note: note || "",
      priceAtAdd: selectedPrice
    });

  } catch (err) {

    if (err.code === 11000) {

      const existing = await WishlistItem.findOne({
        wishlist: wishlist._id,
        product: productId,
        variant: variantId || null
      });

      if (existing && existing.isDeleted) {

        existing.isDeleted = false;
        existing.note = note || "";
        existing.priceAtAdd = selectedPrice;

        await existing.save();
      } else {
        throw new ApiError(400, "Product already in wishlist");
      }

    } else {
      throw err;
    }
  }

  return { success: true };
  },

 async removeItem(userId, productId, variantId) {

  if (!mongoose.Types.ObjectId.isValid(productId))
    throw new ApiError(400, "Invalid product ID");

  const wishlist = await Wishlist.findOne({
    user: userId,
    isDefault: true,
    isDeleted: false
  });

  if (!wishlist)
    throw new ApiError(404, "Wishlist not found");

  const item = await WishlistItem.findOne({
    wishlist: wishlist._id,
    product: productId,
    variant: variantId || null,
    isDeleted: false
  });

  if (!item)
    throw new ApiError(404, "Product not found in wishlist");

  item.isDeleted = true;
  await item.save();

  return { success: true };
  },

 async viewWishlist(userId, page = 1, limit = 20) {

  const wishlist = await Wishlist.findOne({
    user: userId,
    isDefault: true,
    isDeleted: false
  });

  if (!wishlist)
    throw new ApiError(404, "Wishlist not found");

  const skip = (page - 1) * limit;

  const pipeline = [

    {
      $match: {
        wishlist: wishlist._id,
        isDeleted: false
      }
    },

    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productData"
      }
    },

    { $unwind: "$productData" },
    {
        $match:{
            "productData.isDeleted": false,
            "productData.isActive": true,
            "productData.approvalStatus": "approved",
            "productData.isActive": false
        }
    },

    {
      $project: {
        _id: 1,
        note: 1,
        priceAtAdd: 1,
        createdAt: 1,
        product: {
          _id: "$productData._id",
          name: "$productData.name",
          slug: "$productData.slug",
          image: { $arrayElemAt: ["$productData.images.url", 0] },
          price: "$productData.price",
          stock: "$productData.stock",
          isActive: "$productData.isActive"
        }
      }
    },

    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit }
  ];

  const items = await WishlistItem.aggregate(pipeline);

  const enriched = items.map(item => {

    const currentPrice = item.product.price;
    const addedPrice = item.priceAtAdd
      ? Number(item.priceAtAdd.toString())
      : null;

    return {
      ...item,
      isAvailable:
        item.product.isActive &&
        item.product.stock > 0,
      priceDropped:
        addedPrice && currentPrice < addedPrice,
      priceIncreased:
        addedPrice && currentPrice > addedPrice,
      currentPrice
    };
  });

  const total = await WishlistItem.countDocuments({
    wishlist: wishlist._id,
    isDeleted: false
  });

  return {
    wishlistId: wishlist._id,
    items: enriched,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
  },

  async moveToCart(userId, productId, selectedVariant) {

    if (!mongoose.Types.ObjectId.isValid(productId))
    throw new ApiError(400, "Invalid product ID");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const wishlist = await Wishlist.findOne({
      user: userId,
      isDefault: true,
      isDeleted: false
    }).session(session);

    if (!wishlist)
      throw new ApiError(404, "Wishlist not found");

    const item = await WishlistItem.findOne({
      wishlist: wishlist._id,
      product: productId,
      variant: selectedVariant ? selectedVariant._id : null,      isDeleted: false
    }).session(session);

    if (!item)
      throw new ApiError(404, "Item not found");

    // Soft delete item
    item.isDeleted = true;
    await item.save({ session });

    // Add to cart (with session)
    await cartService.addItems(
      userId,
      productId,
      1,
      selectedVariant,
      session
    );

    await session.commitTransaction();
    session.endSession();

    return { success: true };

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
  },

  async checkAvailability(userId) {

  const wishlist = await Wishlist.findOne({
    user: userId,
    isDefault: true,
    isDeleted: false
  });

  if (!wishlist)
    throw new ApiError(404, "Wishlist not found");

  const items = await WishlistItem.aggregate([

    {
      $match: {
        wishlist: wishlist._id,
        isDeleted: false
      }
    },

    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productData"
      }
    },

    { $unwind: "$productData" },

    {
      $project: {
        productId: "$productData._id",
        name: "$productData.name",
        stock: "$productData.stock",
        isActive: "$productData.isActive",
        isDeleted: "$productData.isDeleted",
        approvalStatus: "$productData.approvalStatus",
        isArchived: "$productData.isArchived"
      }
    }
  ]);

  const enriched = items.map(item => ({
    ...item,
    isAvailable:
      item.isActive &&
      !item.isDeleted &&
      item.approvalStatus === "approved" &&
      !item.isArchived &&
      item.stock > 0
  }));

  return enriched;
  },

  async getCount(userId) {

  return await WishlistItem.countDocuments({
    user: userId,
    isDeleted: false
  });
  },

  async clearWishlist(userId) {

  const wishlist = await Wishlist.findOne({
    user: userId,
    isDefault: true,
    isDeleted: false
  }).select("_id");

  if (!wishlist)
    throw new ApiError(404, "Wishlist not found");

  await WishlistItem.updateMany(
    {
      wishlist: wishlist._id,
      isDeleted: false
    },
    {
      $set: { isDeleted: true }
    }
  );

  return { success: true };
  },

  async updatePrivacy(userId, wishlistId, privacy) {

  if (!["public", "private"].includes(privacy))
    throw new ApiError(400, "Invalid privacy setting");

  if (!mongoose.Types.ObjectId.isValid(wishlistId))
    throw new ApiError(400, "Invalid wishlist ID");

  const wishlist = await Wishlist.findOne({
    _id: wishlistId,
    user: userId,
    isDeleted: false
  });

  if (!wishlist)
    throw new ApiError(404, "Wishlist not found");

  if (wishlist.privacy === privacy)
    return { message: "Privacy already set" };

  wishlist.privacy = privacy;
  await wishlist.save();

  return { success: true };
  },

  async createWishlist(userId, name, privacy = "private") {

  if (!name || !name.trim())
    throw new ApiError(400, "Wishlist name is required");

  name = name.trim();

  if (name.length > 100)
    throw new ApiError(400, "Wishlist name too long");

  if (!["public", "private"].includes(privacy))
    throw new ApiError(400, "Invalid privacy setting");

  const count = await Wishlist.countDocuments({
    user: userId,
    isDeleted: false
  });

  const MAX_WISHLISTS = 20;

  if (count >= MAX_WISHLISTS)
    throw new ApiError(400, "Wishlist limit reached");

  const hasDefault = await Wishlist.exists({
    user: userId,
    isDefault: true,
    isDeleted: false
  });

  try {

    const wishlist = await Wishlist.create({
      user: userId,
      name,
      privacy,
      isDefault: !hasDefault 
    });

    return wishlist;

  } catch (err) {

    if (err.code === 11000)
      throw new ApiError(400, "Wishlist name already exists");

    throw err;
  }
  },

  async getAllWishlists(userId) {

  const wishlists = await Wishlist.find({
    user: userId,
    isDeleted: false
  })
    .select("_id name privacy isDefault createdAt")
    .sort({ createdAt: -1 })
    .lean();

  if (!wishlists.length)
    return [];

  const wishlistIds = wishlists.map(w => w._id);

  const counts = await WishlistItem.aggregate([
    {
      $match: {
        wishlist: { $in: wishlistIds },
        isDeleted: false
      }
    },
    {
      $group: {
        _id: "$wishlist",
        total: { $sum: 1 }
      }
    }
  ]);

  const countMap = new Map();
  counts.forEach(c => countMap.set(String(c._id), c.total));

  const previews = await WishlistItem.aggregate([
    {
      $match: {
        wishlist: { $in: wishlistIds },
        isDeleted: false
      }
    },
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: "$wishlist",
        firstProduct: { $first: "$product" }
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "firstProduct",
        foreignField: "_id",
        as: "productData"
      }
    },
    { $unwind: "$productData" },
    {
      $project: {
        _id: 1,
        image: { $arrayElemAt: ["$productData.images.url", 0] }
      }
    }
  ]);

  const previewMap = new Map();
  previews.forEach(p => previewMap.set(String(p._id), p.image));

  return wishlists.map(w => ({
    ...w,
    itemCount: countMap.get(String(w._id)) || 0,
    previewImage: previewMap.get(String(w._id)) || null
  }));
  },

  async setDefault(userId, wishlistId) {

  if (!mongoose.Types.ObjectId.isValid(wishlistId))
    throw new ApiError(400, "Invalid wishlist ID");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const wishlist = await Wishlist.findOne({
      _id: wishlistId,
      user: userId,
      isDeleted: false
    }).session(session);

    if (!wishlist)
      throw new ApiError(404, "Wishlist not found");

    if (wishlist.isDefault) {
      await session.abortTransaction();
      session.endSession();
      return { message: "Already default" };
    }

    await Wishlist.updateMany(
      {
        user: userId,
        isDefault: true
      },
      {
        $set: { isDefault: false }
      },
      { session }
    );

    wishlist.isDefault = true;
    await wishlist.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { success: true };

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
  },

}
