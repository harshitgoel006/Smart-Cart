// This module implements the WishlistService, which provides functionalities for managing user wishlists in an e-commerce application. It allows users to add products to their wishlist, remove items, view their wishlist with pagination, move items to the cart, check product availability, get the count of wishlist items, clear the wishlist, update privacy settings, create multiple wishlists, and set a default wishlist. The service interacts with the Wishlist and WishlistItem models, as well as the Product model to ensure that only valid and available products can be added to the wishlist. It also handles various edge cases and errors gracefully using custom ApiError exceptions.

import { Wishlist } from "../models/wishlist.model.js";
import { WishlistItem } from "../models/wishlist.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { cartService } from "./cart.service.js";

// The WishlistService object encapsulates all the methods related to managing user wishlists. Each method is designed to perform specific operations such as adding products, removing items, viewing the wishlist, moving items to the cart, checking availability, and more. The service ensures that all operations are performed with proper validation and error handling to maintain data integrity and provide a seamless user experience.
export const WishlistService = {
  // This method allows a user to add a product to their wishlist. It first validates the product ID and checks if the product exists and is available. If a variant ID is provided, it also checks for the variant's existence and price. The method then either creates a new wishlist for the user if one doesn't exist or adds the product to the existing default wishlist. If the product is already in the wishlist but marked as deleted, it reactivates it with updated details. The method returns a success response upon completion.
  async addProduct(userId, productId, variantId, note) {
    if (!mongoose.Types.ObjectId.isValid(productId))
      throw new ApiError(400, "Invalid product ID");

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
      isDeleted: false,
      approvalStatus: "approved",
      isArchived: false,
    });

    if (!product) throw new ApiError(404, "Product not found");

    let selectedPrice = product.price;

    if (variantId) {
      const variant = product.variants?.find(
        (v) => v._id.toString() === variantId.toString(),
      );

      if (!variant) throw new ApiError(404, "Variant not found");

      selectedPrice = variant.price;
    }

    let wishlist = await Wishlist.findOne({
      user: userId,
      isDefault: true,
      isDeleted: false,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        name: "My Wishlist",
        isDefault: true,
      });
    }

    try {
      await WishlistItem.create({
        wishlist: wishlist._id,
        user: userId,
        product: productId,
        variant: variantId || null,
        note: note || "",
        priceAtAdd: selectedPrice,
      });
    } catch (err) {
      if (err.code === 11000) {
        const existing = await WishlistItem.findOne({
          wishlist: wishlist._id,
          product: productId,
          variant: variantId || null,
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

  // This method removes an item from the user's wishlist. It validates the product ID, checks for the existence of the user's default wishlist, and then looks for the specific item in the wishlist. If the item is found, it marks it as deleted instead of removing it from the database, allowing for potential recovery in the future. The method returns a success response upon completion.
  async removeItem(userId, productId, variantId) {
    if (!mongoose.Types.ObjectId.isValid(productId))
      throw new ApiError(400, "Invalid product ID");

    const wishlist = await Wishlist.findOne({
      user: userId,
      isDefault: true,
      isDeleted: false,
    });

    if (!wishlist) throw new ApiError(404, "Wishlist not found");

    const item = await WishlistItem.findOne({
      wishlist: wishlist._id,
      product: productId,
      variant: variantId || null,
      isDeleted: false,
    });

    if (!item) throw new ApiError(404, "Product not found in wishlist");

    item.isDeleted = true;
    await item.save();

    return { success: true };
  },

  // This method retrieves the user's wishlist with pagination. It first checks for the existence of the user's default wishlist and then uses an aggregation pipeline to fetch the wishlist items along with their associated product data. The method enriches the items with additional information such as availability and price changes, and returns the paginated list of items along with metadata about the total count and total pages.
  async viewWishlist(userId, page = 1, limit = 20) {
    const wishlist = await Wishlist.findOne({
      user: userId,
      isDefault: true,
      isDeleted: false,
    });

    if (!wishlist) throw new ApiError(404, "Wishlist not found");

    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $match: {
          wishlist: wishlist._id,
          isDeleted: false,
        },
      },

      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData",
        },
      },

      { $unwind: "$productData" },
      {
        $match: {
          "productData.isDeleted": false,
          "productData.isActive": true,
          "productData.approvalStatus": "approved",
          "productData.isActive": false,
        },
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
            isActive: "$productData.isActive",
          },
        },
      },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const items = await WishlistItem.aggregate(pipeline);

    const enriched = items.map((item) => {
      const currentPrice = item.product.price;
      const addedPrice = item.priceAtAdd
        ? Number(item.priceAtAdd.toString())
        : null;

      return {
        ...item,
        isAvailable: item.product.isActive && item.product.stock > 0,
        priceDropped: addedPrice && currentPrice < addedPrice,
        priceIncreased: addedPrice && currentPrice > addedPrice,
        currentPrice,
      };
    });

    const total = await WishlistItem.countDocuments({
      wishlist: wishlist._id,
      isDeleted: false,
    });

    return {
      wishlistId: wishlist._id,
      items: enriched,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  // This method moves an item from the user's wishlist to the cart. It validates the product ID, checks for the existence of the user's default wishlist and the specific item in the wishlist. If the item is found, it marks it as deleted in the wishlist and then adds it to the cart using the cartService. The entire operation is performed within a MongoDB transaction to ensure data consistency. The method returns a success response upon completion.
  async moveToCart(userId, productId, selectedVariant) {
    if (!mongoose.Types.ObjectId.isValid(productId))
      throw new ApiError(400, "Invalid product ID");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const wishlist = await Wishlist.findOne({
        user: userId,
        isDefault: true,
        isDeleted: false,
      }).session(session);

      if (!wishlist) throw new ApiError(404, "Wishlist not found");

      const item = await WishlistItem.findOne({
        wishlist: wishlist._id,
        product: productId,
        variant: selectedVariant ? selectedVariant._id : null,
        isDeleted: false,
      }).session(session);

      if (!item) throw new ApiError(404, "Item not found");

      // Soft delete item
      item.isDeleted = true;
      await item.save({ session });

      // Add to cart (with session)
      await cartService.addItems(
        userId,
        productId,
        1,
        selectedVariant,
        session,
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

  // This method checks the availability of products in the user's wishlist. It retrieves the user's default wishlist and performs an aggregation to fetch the wishlist items along with their associated product data. The method then enriches each item with an 'isAvailable' flag based on the product's active status, stock, approval status, and archival status. Finally, it returns the list of items with their availability status.
  async checkAvailability(userId) {
    const wishlist = await Wishlist.findOne({
      user: userId,
      isDefault: true,
      isDeleted: false,
    });

    if (!wishlist) throw new ApiError(404, "Wishlist not found");

    const items = await WishlistItem.aggregate([
      {
        $match: {
          wishlist: wishlist._id,
          isDeleted: false,
        },
      },

      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData",
        },
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
          isArchived: "$productData.isArchived",
        },
      },
    ]);

    const enriched = items.map((item) => ({
      ...item,
      isAvailable:
        item.isActive &&
        !item.isDeleted &&
        item.approvalStatus === "approved" &&
        !item.isArchived &&
        item.stock > 0,
    }));

    return enriched;
  },

  // This method retrieves the count of items in the user's wishlist. It counts the number of wishlist items that belong to the user's default wishlist and are not marked as deleted. The method returns the total count of active wishlist items for the user.
  async getCount(userId) {
    return await WishlistItem.countDocuments({
      user: userId,
      isDeleted: false,
    });
  },

  // This method clears all items from the user's wishlist. It first retrieves the user's default wishlist and then updates all items in that wishlist to mark them as deleted. This allows for potential recovery of items in the future if needed. The method returns a success response upon completion.
  async clearWishlist(userId) {
    const wishlist = await Wishlist.findOne({
      user: userId,
      isDefault: true,
      isDeleted: false,
    }).select("_id");

    if (!wishlist) throw new ApiError(404, "Wishlist not found");

    await WishlistItem.updateMany(
      {
        wishlist: wishlist._id,
        isDeleted: false,
      },
      {
        $set: { isDeleted: true },
      },
    );

    return { success: true };
  },

  // This method updates the privacy setting of a user's wishlist. It validates the provided privacy value and checks for the existence of the specified wishlist. If the wishlist is found and the new privacy setting is different from the current one, it updates the wishlist's privacy field and saves the changes. The method returns a success response if the update is successful or a message if the privacy setting is already set to the desired value.
  async updatePrivacy(userId, wishlistId, privacy) {
    if (!["public", "private"].includes(privacy))
      throw new ApiError(400, "Invalid privacy setting");

    if (!mongoose.Types.ObjectId.isValid(wishlistId))
      throw new ApiError(400, "Invalid wishlist ID");

    const wishlist = await Wishlist.findOne({
      _id: wishlistId,
      user: userId,
      isDeleted: false,
    });

    if (!wishlist) throw new ApiError(404, "Wishlist not found");

    if (wishlist.privacy === privacy) return { message: "Privacy already set" };

    wishlist.privacy = privacy;
    await wishlist.save();

    return { success: true };
  },

  // This method creates a new wishlist for the user with the specified name and privacy setting. It validates the input parameters, checks if the user has reached the maximum number of allowed wishlists, and ensures that the wishlist name is unique for the user. If the user does not have a default wishlist, the newly created wishlist is set as the default. The method returns the created wishlist document upon successful creation.
  async createWishlist(userId, name, privacy = "private") {
    if (!name || !name.trim())
      throw new ApiError(400, "Wishlist name is required");

    name = name.trim();

    if (name.length > 100) throw new ApiError(400, "Wishlist name too long");

    if (!["public", "private"].includes(privacy))
      throw new ApiError(400, "Invalid privacy setting");

    const count = await Wishlist.countDocuments({
      user: userId,
      isDeleted: false,
    });

    const MAX_WISHLISTS = 20;

    if (count >= MAX_WISHLISTS)
      throw new ApiError(400, "Wishlist limit reached");

    const hasDefault = await Wishlist.exists({
      user: userId,
      isDefault: true,
      isDeleted: false,
    });

    try {
      const wishlist = await Wishlist.create({
        user: userId,
        name,
        privacy,
        isDefault: !hasDefault,
      });

      return wishlist;
    } catch (err) {
      if (err.code === 11000)
        throw new ApiError(400, "Wishlist name already exists");

      throw err;
    }
  },

  // This method retrieves all wishlists for a user along with the count of items in each wishlist and a preview image of the first product in the wishlist. It first fetches all wishlists for the user and then uses aggregation pipelines to get the item counts and preview images for each wishlist. The method returns an array of wishlists enriched with the item count and preview image data.
  async getAllWishlists(userId) {
    const wishlists = await Wishlist.find({
      user: userId,
      isDeleted: false,
    })
      .select("_id name privacy isDefault createdAt")
      .sort({ createdAt: -1 })
      .lean();

    if (!wishlists.length) return [];

    const wishlistIds = wishlists.map((w) => w._id);

    const counts = await WishlistItem.aggregate([
      {
        $match: {
          wishlist: { $in: wishlistIds },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$wishlist",
          total: { $sum: 1 },
        },
      },
    ]);

    const countMap = new Map();
    counts.forEach((c) => countMap.set(String(c._id), c.total));

    const previews = await WishlistItem.aggregate([
      {
        $match: {
          wishlist: { $in: wishlistIds },
          isDeleted: false,
        },
      },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: "$wishlist",
          firstProduct: { $first: "$product" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "firstProduct",
          foreignField: "_id",
          as: "productData",
        },
      },
      { $unwind: "$productData" },
      {
        $project: {
          _id: 1,
          image: { $arrayElemAt: ["$productData.images.url", 0] },
        },
      },
    ]);

    const previewMap = new Map();
    previews.forEach((p) => previewMap.set(String(p._id), p.image));

    return wishlists.map((w) => ({
      ...w,
      itemCount: countMap.get(String(w._id)) || 0,
      previewImage: previewMap.get(String(w._id)) || null,
    }));
  },

  // This method sets a specific wishlist as the default for the user. It validates the provided wishlist ID, checks for the existence of the specified wishlist, and then updates the 'isDefault' field for all of the user's wishlists accordingly. The method uses a MongoDB transaction to ensure that the operation is atomic and consistent. If the specified wishlist is already set as default, it returns a message indicating that no changes were made. Otherwise, it sets the specified wishlist as default and returns a success response.
  async setDefault(userId, wishlistId) {
    if (!mongoose.Types.ObjectId.isValid(wishlistId))
      throw new ApiError(400, "Invalid wishlist ID");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const wishlist = await Wishlist.findOne({
        _id: wishlistId,
        user: userId,
        isDeleted: false,
      }).session(session);

      if (!wishlist) throw new ApiError(404, "Wishlist not found");

      if (wishlist.isDefault) {
        await session.abortTransaction();
        session.endSession();
        return { message: "Already default" };
      }

      await Wishlist.updateMany(
        {
          user: userId,
          isDefault: true,
        },
        {
          $set: { isDefault: false },
        },
        { session },
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
};
