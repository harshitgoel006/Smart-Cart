import mongoose from "mongoose";
import slugify from "slugify";

// This schema defines the structure of the Category documents in the MongoDB database. It includes fields for the category name, slug, description, image, parent category reference, hierarchy level, path, product count, status flags (featured, active, deleted), rejection reason, proposed by user reference, tags, order for sorting, meta information for SEO, and references to the users who created and updated the category. The schema also includes timestamps for when each category document is created and last updated. This structure allows for efficient management of categories in an e-commerce application, supporting features like nested categories and SEO optimization.

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
      type: String,
      default: "",
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

// This pre-save middleware function is responsible for generating a unique slug for the category based on its name and ensuring that the hierarchy information (level and path) is correctly set based on the parent category. It checks if the name has been modified to generate a new slug, and it also validates the parent category if one is provided. This ensures that the category data remains consistent and properly structured in the database before being saved.

categorySchema.pre("save", async function (next) {
  // 🔹 Slug Generation
  if (this.isModified("name")) {
    const baseSlug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    });

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
      return next(new Error("Invalid parent category"));
    }

    this.level = parent.level + 1;

    this.path = parent.path ? `${parent.path}/${parent._id}` : `${parent._id}`;
  } else {
    this.level = 0;
    this.path = "";
  }

  next();
});

// This pre-find middleware function is responsible for automatically filtering out any categories that have been marked as deleted (isDeleted: true) from all find queries. This ensures that deleted categories do not appear in the results of any queries, providing a soft delete mechanism that allows for the possibility of restoring deleted categories later if needed.

categorySchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

// These indexes are created to optimize query performance for common operations on the Category collection. The first index allows for efficient sorting and retrieval of categories based on their parent category and order. The second index optimizes queries that filter categories by their status and deletion state. The third index improves performance for queries that filter or sort categories by their hierarchy level. The fourth index allows for fast retrieval of categories based on their product count, especially when sorting in descending order to find the most popular categories.

categorySchema.index({ parent: 1, order: 1 });
categorySchema.index({ status: 1, isDeleted: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ productCount: -1 });

export const Category = mongoose.model("Category", categorySchema);
