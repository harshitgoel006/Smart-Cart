import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    note: {
      type: String,
      maxlength: 500,
      default: ""
    },

    addedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

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
      default: "My Wishlist"
    },

    items: [wishlistItemSchema],

    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "private"
    },

    isDefault: {
      type: Boolean,
      default: true
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

//////////////////////////////////////////////////////////
// UNIQUE USER + NAME
//////////////////////////////////////////////////////////

wishlistSchema.index({ user: 1, name: 1 }, { unique: true });

//////////////////////////////////////////////////////////
// PREVENT DUPLICATE PRODUCTS
//////////////////////////////////////////////////////////

wishlistSchema.methods.addProduct = function (productId, note = "") {
  const exists = this.items.some(
    item => item.product.toString() === productId.toString()
  );

  if (!exists) {
    this.items.push({ product: productId, note });
  }
};

wishlistSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);