import mongoose from "mongoose";

//////////////////////////////////////////////////////////
// OPTION SCHEMA
//////////////////////////////////////////////////////////

const optionSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
      trim: true
    },

    sku: {
      type: String,
      required: true
    },

    stock: {
      type: Number,
      default: 0,
      min: 0
    },

    price: {
      type: mongoose.Schema.Types.Decimal128
    },

    sold: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { _id: false }
);

//////////////////////////////////////////////////////////
// VARIANT SCHEMA
//////////////////////////////////////////////////////////

const variantSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    options: [optionSchema]
  },
  { _id: false }
);

//////////////////////////////////////////////////////////
// PRODUCT SCHEMA
//////////////////////////////////////////////////////////

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 90
    },

    finalPrice: {
      type: mongoose.Schema.Types.Decimal128
    },

    stock: {
      type: Number,
      default: 0,
      min: 0
    },

    sold: {
      type: Number,
      default: 0,
      min: 0
    },

    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true }
      }
    ],

    brand: { type: String, required: true, index: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true
    },

    ratings: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },

    tags: [{ type: String, trim: true }],

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    variants: [variantSchema],

    featured: { type: Boolean, default: false },

    flashSale: {
      start: Date,
      end: Date,
      discount: { type: Number, min: 0, max: 90 },
      isActive: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

//////////////////////////////////////////////////////////
// SLUG GENERATION
//////////////////////////////////////////////////////////

productSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    this.slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
  }

  // calculate final price safely
  const price = parseFloat(this.price.toString());
  const discount = this.discount || 0;
  const final = price - (price * discount) / 100;
  this.finalPrice = mongoose.Types.Decimal128.fromString(final.toFixed(2));

  next();
});

//////////////////////////////////////////////////////////
// GLOBAL QUERY FILTER (SOFT DELETE)
//////////////////////////////////////////////////////////

productSchema.query.active = function () {
  return this.where({
    isDeleted: false,
    isActive: true
  });
};

productSchema.query.approved = function () {
  return this.where({
    approvalStatus: "approved"
  });
};

//////////////////////////////////////////////////////////
// TEXT SEARCH
//////////////////////////////////////////////////////////

productSchema.index({ name: "text", description: "text" });

//////////////////////////////////////////////////////////
// COMPOUND PERFORMANCE INDEX
//////////////////////////////////////////////////////////

productSchema.index({
  category: 1,
  approvalStatus: 1,
  isDeleted: 1,
  isActive: 1
});

productSchema.index({
  seller: 1,
  approvalStatus: 1,
  isDeleted: 1
});

productSchema.index({
  "flashSale.isActive": 1,
  "flashSale.start": 1,
  "flashSale.end": 1
});

productSchema.index({ finalPrice: 1 });
productSchema.index({ ratings: -1 });
productSchema.index({ createdAt: -1 });

//////////////////////////////////////////////////////////

export const Product = mongoose.model("Product", productSchema);
