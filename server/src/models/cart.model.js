import mongoose from "mongoose";


// This schema defines the structure of a cart item within the shopping cart. Each cart item references a product and its seller, along with details about the selected variant, quantity, unit price at the time of adding to the cart, any discounts or flash sales applied, and the total price for that line item. This schema is embedded within the main cart schema to represent the items in a user's cart.

const cartItemSchema = new mongoose.Schema(
{
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true
  },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  selectedVariant: {
    label: String,
    value: String
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  },

  unitPriceSnapshot: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },

  discountSnapshot: {
    type: Number,
    default: 0
  },

  flashSaleSnapshot: {
    type: Number,
    default: 0
  },

  lineTotalSnapshot: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  }
},
{ _id: true }
);


// This schema defines the structure of the shopping cart. Each cart is associated with a user and contains an array of cart items. The cart also keeps track of the total number of items, the subtotal price, any applied coupon, discount amount, final amount after discounts, and whether the cart is locked (e.g., during checkout). The schema includes methods to calculate totals based on the items in the cart.

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
      default: mongoose.Types.Decimal128.fromString("0.00")
    },

    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null
    },

    discountAmount: {
      type: mongoose.Schema.Types.Decimal128,
      default: mongoose.Types.Decimal128.fromString("0.00")
    },

    finalAmount: {
      type: mongoose.Schema.Types.Decimal128,
      default: mongoose.Types.Decimal128.fromString("0.00")
    },
    isLocked:{
      type: Boolean,
      default: false
    },
    expiresAt:{
      type:Date,
      default:null,
      index:true
    }

  },
  { timestamps: true }
);


// This index is created to optimize queries that filter by user and the products in the cart items. It allows for faster retrieval of a user's cart and efficient searching for specific products within carts, which can be beneficial for operations like adding items, updating quantities, or applying discounts based on the products in the cart.

cartSchema.index({ user: 1, "items.product": 1 });


// This method calculates the total number of items, subtotal, discount amount, and final amount for the cart based on the items it contains. It iterates through each cart item, calculates the line total for that item (unit price multiplied by quantity), and updates the total items and subtotal accordingly. It then applies any discounts to calculate the final amount. This method is typically called whenever there are changes to the cart items to ensure that the totals are accurate and up-to-date.

cartSchema.methods.calculateTotals = function () {

  let totalItems = 0;
  let subtotal = 0;

  for (const item of this.items) {

    const unit = parseFloat(
      item.unitPriceSnapshot.toString()
    );

    const lineTotal = unit * item.quantity;

    item.lineTotalSnapshot =
      mongoose.Types.Decimal128.fromString(
        lineTotal.toFixed(2)
      );

    totalItems += item.quantity;
    subtotal += lineTotal;
  }

  this.totalItems = totalItems;

  this.subtotal =
    mongoose.Types.Decimal128.fromString(
      subtotal.toFixed(2)
    );

  const discount = parseFloat(
    this.discountAmount?.toString() || "0"
  );

  const final = Math.max(0, subtotal - discount);

  this.finalAmount =
    mongoose.Types.Decimal128.fromString(
      final.toFixed(2)
    );
};



export const Cart = mongoose.model("Cart", cartSchema);