import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    description: {
      type: String,
      default: ""
    },

    image: {
      type: String,
      default: ""
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true
    },

    level: {
      type: Number,
      default: 0
    },

    path: {
      type: String,
      index: true
    },

    productCount: {
      type: Number,
      default: 0
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
      index: true
    },

    proposedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    tags: [{ type: String, trim: true }],

    order: {
      type: Number,
      default: 0
    },

    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: String, default: "" },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

//////////////////////////////////////////////////////////
// SLUG + TREE PATH GENERATION
//////////////////////////////////////////////////////////

categorySchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    this.slug = `${baseSlug}-${Date.now()}`;
  }

  if (this.parent) {
    const parent = await mongoose
      .model("Category")
      .findById(this.parent);

    if (parent) {
      this.level = parent.level + 1;
      this.path = parent.path
        ? `${parent.path}/${parent._id}`
        : `${parent._id}`;
    }
  } else {
    this.level = 0;
    this.path = "";
  }

  next();
});

//////////////////////////////////////////////////////////
// AUTO FILTER SOFT DELETE
//////////////////////////////////////////////////////////

categorySchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false, isActive: true });
  next();
});

//////////////////////////////////////////////////////////
// INDEX OPTIMIZATION
//////////////////////////////////////////////////////////

categorySchema.index({ parent: 1, order: 1 });
categorySchema.index({ status: 1, isDeleted: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ productCount: -1 });

export const Category = mongoose.model("Category", categorySchema);