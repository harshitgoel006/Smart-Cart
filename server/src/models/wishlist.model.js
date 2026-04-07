import mongoose from "mongoose";

// This schema defines the structure for wishlists in the database. Each wishlist is associated with a user and has a name, privacy setting, and flags for default and deleted status. The schema includes indexes to ensure unique wishlist names per user and to enforce that only one default wishlist can exist for each user.
const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "private",
      index: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

// Creating a compound index to ensure that each user can only have one wishlist with the same name, and to optimize queries based on user and name. The collation ensures that the uniqueness is case-insensitive.
wishlistSchema.index(
  { user: 1, name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } },
);

// Creating a compound index to ensure that only one default wishlist can exist for each user, and to optimize queries based on user and default status. The partialFilterExpression ensures that the uniqueness constraint only applies to wishlists where isDefault is true.
wishlistSchema.index(
  { user: 1, isDefault: 1 },
  { unique: true, partialFilterExpression: { isDefault: true } },
);

// This schema defines the structure for items within a wishlist. Each item is associated with a wishlist, user, and product, and includes fields for an optional note, the price at the time of adding to the wishlist, and flags for deleted status. The schema includes indexes to ensure that a product can only be added once per wishlist and to optimize queries based on user and deletion status.
const wishlistItemSchema = new mongoose.Schema(
  {
    wishlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wishlist",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    note: {
      type: String,
      maxlength: 500,
      default: "",
    },

    priceAtAdd: {
      type: mongoose.Schema.Types.Decimal128,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

wishlistItemSchema.index({ wishlist: 1, product: 1 }, { unique: true });

wishlistItemSchema.index({
  user: 1,
  isDeleted: 1,
  createdAt: -1,
});

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export const WishlistItem = mongoose.model("WishlistItem", wishlistItemSchema);
