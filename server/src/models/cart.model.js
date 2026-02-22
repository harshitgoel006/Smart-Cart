import mongoose from "mongoose";

//////////////////////////////////////////////////////////
// CART ITEM
//////////////////////////////////////////////////////////

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },

    priceSnapshot: {
      type: mongoose.Schema.Types.Decimal128,
      required: true
    }
  },
  { _id: true }
);

//////////////////////////////////////////////////////////
// CART
//////////////////////////////////////////////////////////

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },

    items: [cartItemSchema],

    totalItems: {
      type: Number,
      default: 0
    },

    subtotal: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },

    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null
    },

    discountAmount: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },

    finalAmount: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    }
  },
  { timestamps: true }
);

//////////////////////////////////////////////////////////
// CALCULATE TOTALS (NO PRODUCT FETCH)
//////////////////////////////////////////////////////////

cartSchema.methods.calculateTotals = function () {
  let totalItems = 0;
  let subtotal = 0;

  for (const item of this.items) {
    const price = parseFloat(item.priceSnapshot.toString());
    totalItems += item.quantity;
    subtotal += item.quantity * price;
  }

  this.totalItems = totalItems;
  this.subtotal = subtotal.toFixed(2);

  const discount = parseFloat(this.discountAmount?.toString() || 0);

  this.finalAmount = Math.max(0, subtotal - discount).toFixed(2);
};

//////////////////////////////////////////////////////////
// ADD ITEM
//////////////////////////////////////////////////////////

cartSchema.methods.addItem = function (productId, quantity, priceSnapshot) {
  const existing = this.items.find(
    item => item.product.toString() === productId.toString()
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    this.items.push({
      product: productId,
      quantity,
      priceSnapshot
    });
  }

  this.calculateTotals();
};

//////////////////////////////////////////////////////////
// REMOVE ITEM
//////////////////////////////////////////////////////////

cartSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter(
    item => item.product.toString() !== productId.toString()
  );

  this.calculateTotals();
};

//////////////////////////////////////////////////////////
// CLEAR
//////////////////////////////////////////////////////////

cartSchema.methods.clearCart = function () {
  this.items = [];
  this.discountAmount = 0;
  this.coupon = null;
  this.calculateTotals();
};

export const Cart = mongoose.model("Cart", cartSchema);