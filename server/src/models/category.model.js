import mongoose from "mongoose";
import slugify from "slugify";
import { ApiError } from "../utils/ApiError.js";


const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [30, "Category name cannot exceed 100 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      public_id: { type: String },
      url: { type: String },
    },

    bannerImage: {
      public_id: { type: String },
      url: { type: String },
    },

    sliderImages: [
      {
        public_id: String,
        url: String,
      },
    ],

    tagline: {
      type: String,
      default: "",
    },

    icon: {
      public_id: { type: String },
      url: { type: String },
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },

    level: {
      type: Number,
      default: 0,
    },

    path: {
      type: String,
      index: true,
    },

    productCount: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
      index: true,
    },

    proposedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    tags: [{ type: String, trim: true }],

    order: {
      type: Number,
      default: 0,
    },

    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: String, default: "" },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

categorySchema.pre("save", async function (next) {
  // 🔹 Slug Generation
  if (this.isModified("name")) {
    const baseSlug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    }).substring(0, 120);

    const existing = await mongoose.model("Category").findOne({
      slug: baseSlug,
      _id: { $ne: this._id },
    });

    this.slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;
  }

  // 🔹 Hierarchy Logic
  if (this.parent) {
    const parent = await mongoose.model("Category").findById(this.parent);

    if (!parent) {
      return next(new ApiError(404, "Parent category not found"));
    }

    if (String(parent._id) === String(this._id)) {
      return next(new ApiError(400, "Category cannot be its own parent"));
    }

    let currentParent = parent;

    while (currentParent) {
      if (String(currentParent._id) === String(this._id)) {
        return next(new ApiError(400, "Circular category hierarchy detected"));
      }

      currentParent = currentParent.parent
        ? await mongoose.model("Category").findById(currentParent.parent)
        : null;
    }

    this.level = parent.level + 1;

    this.path = parent.path ? `${parent.path}/${parent._id}` : `${parent._id}`;
  } else {
    this.level = 0;
    this.path = "";
  }

  next();
});

categorySchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

categorySchema.index({ parent: 1, order: 1 });
categorySchema.index({ status: 1, isDeleted: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ productCount: -1 });

export const Category = mongoose.model("Category", categorySchema);
