import { Banner } from "../models/banner.model.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

export const bannerService = {

  async getActiveBanners({ type = "home", position = "hero" }) {
    const today = new Date();

    const banners = await Banner.find({
      isActive: true,
      type,
      position,
      $or: [
        { startDate: { $exists: false } },
        {
          startDate: { $lte: today },
          endDate: { $gte: today },
        },
      ],
    })
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    return banners;
  },

  async createBanner(data) {
    const {
      title,
      tagline,
      image,
      redirectLink,
      type,
      position,
      priority,
      startDate,
      endDate,
    } = data;

    if (!image?.url) {
      throw new ApiError(400, "Banner image is required");
    }

    const banner = await Banner.create({
      title,
      tagline,
      image,
      redirectLink,
      type,
      position,
      priority,
      startDate,
      endDate,
      isActive: true,
    });

    return banner;
  },

  async updateBanner(bannerId, data) {
    if (!mongoose.Types.ObjectId.isValid(bannerId)) {
      throw new ApiError(400, "Invalid banner ID");
    }

    const banner = await Banner.findById(bannerId);

    if (!banner) {
      throw new ApiError(404, "Banner not found");
    }

    Object.assign(banner, data);

    await banner.save();

    return banner;
  },

  async deleteBanner(bannerId) {
    if (!mongoose.Types.ObjectId.isValid(bannerId)) {
      throw new ApiError(400, "Invalid banner ID");
    }

    const banner = await Banner.findById(bannerId);

    if (!banner) {
      throw new ApiError(404, "Banner not found");
    }

    banner.isActive = false;
    await banner.save();

    return true;
  },

  async getAllBanners({ page = 1, limit = 20 }) {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const banners = await Banner.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Banner.countDocuments();

    return {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      banners,
    };
  },
};