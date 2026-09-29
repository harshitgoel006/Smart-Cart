import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { siteSettingsService } from "../services/siteSettings.service.js";

export const getPublicSiteSettings = asyncHandler(async (_req, res) => {
  const settings = await siteSettingsService.getPublic();
  return res.status(200).json(new ApiResponse(200, settings, "Site settings fetched"));
});

export const getAdminSiteSettings = asyncHandler(async (_req, res) => {
  const settings = await siteSettingsService.getPublic();
  return res.status(200).json(new ApiResponse(200, settings, "Admin site settings fetched"));
});

export const updateAdminSiteSettings = asyncHandler(async (req, res) => {
  const settings = await siteSettingsService.update(req.body, req.user._id);
  return res.status(200).json(new ApiResponse(200, settings, "Site settings updated"));
});
