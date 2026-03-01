import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "private",
      index: true
    },

    isDefault: {
      type: Boolean,
      default: false,
      index: true
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

wishlistSchema.index(
  { user: 1, name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

wishlistSchema.index(
  { user: 1, isDefault: 1 },
  { unique: true, partialFilterExpression: { isDefault: true } }
);

const wishlistItemSchema = new mongoose.Schema(
  {
    wishlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wishlist",
      required: true,
      index: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },

    note: {
      type: String,
      maxlength: 500,
      default: ""
    },

    priceAtAdd: {
      type: mongoose.Schema.Types.Decimal128,
      default: null
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

wishlistItemSchema.index(
  { wishlist: 1, product: 1 },
  { unique: true }
);

wishlistItemSchema.index({
  user: 1,
  isDeleted: 1,
  createdAt: -1
});

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export const WishlistItem = mongoose.model("WishlistItem", wishlistItemSchema);