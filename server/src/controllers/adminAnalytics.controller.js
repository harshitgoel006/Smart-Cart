import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { adminAnalyticsService } from "../services/adminAnalytics.service.js";

export const getAdminOverview = asyncHandler(async (req, res) => {
  const data = await adminAnalyticsService.overview(req.query);
  return res.status(200).json(new ApiResponse(200, data, "Admin analytics fetched"));
});
