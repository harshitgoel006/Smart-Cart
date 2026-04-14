import { bannerService } from "../services/banner.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getBanners = asyncHandler(async (req, res) => {
  const { type, position } = req.query;

  const banners = await bannerService.getActiveBanners({
    type,
    position,
  });

  res.status(200).json(
    new ApiResponse(200, banners, "Banners fetched successfully")
  );
});

export const createBanner = asyncHandler(async (req, res) => {
  const banner = await bannerService.createBanner(req.body);

  res.status(201).json(
    new ApiResponse(201, banner, "Banner created successfully")
  );
});

export const updateBanner = asyncHandler(async (req, res) => {
  const { bannerId } = req.params;

  const banner = await bannerService.updateBanner(
    bannerId,
    req.body
  );

  res.status(200).json(
    new ApiResponse(200, banner, "Banner updated successfully")
  );
});

export const deleteBanner = asyncHandler(async (req, res) => {
  const { bannerId } = req.params;

  await bannerService.deleteBanner(bannerId);

  res.status(200).json(
    new ApiResponse(200, {}, "Banner deleted successfully")
  );
});

export const getAllBannersAdmin = asyncHandler(async (req, res) => {
  const data = await bannerService.getAllBanners(req.query);

  res.status(200).json(
    new ApiResponse(200, data, "All banners fetched")
  );
});