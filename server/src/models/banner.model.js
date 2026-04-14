import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    tagline: {
      type: String,
      trim: true,
    },

    image: {
      public_id: String,
      url: String,
    },

    redirectLink: {
      type: String, // /products?category=men
    },

    type: {
      type: String,
      enum: ["home", "category", "ai", "offer"],
      default: "home",
      index: true,
    },

    position: {
      type: String,
      enum: ["hero", "middle", "bottom"],
      default: "hero",
    },

    priority: {
      type: Number,
      default: 0,
    },

    startDate: Date,
    endDate: Date,

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

bannerSchema.index({ type: 1, isActive: 1 });

export const Banner = mongoose.model("Banner", bannerSchema);