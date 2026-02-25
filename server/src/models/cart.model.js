import mongoose from "mongoose";


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

cartSchema.index({ user: 1, "items.product": 1 });

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