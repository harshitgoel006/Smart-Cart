import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { aiService } from "../services/ai.service.js";

export const assistCustomer = asyncHandler(async (req, res) => {
  const result = await aiService.assist(req.body?.message);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "SmartCart assistant response generated"));
});

export const searchWithAssistant = asyncHandler(async (req, res) => {
  const result = await aiService.search(req.body?.message);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "AI product search completed"));
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const seedProductIds = String(req.query.seedProductIds || "")
    .split(",")
    .filter(Boolean);
  const result = await aiService.getRecommendations(req.query.limit, seedProductIds);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "AI recommendations fetched"));
});

export const getPersonalizedRecommendations = asyncHandler(async (req, res) => {
  const result = await aiService.getRecommendations(req.query.limit, [], req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Personalized AI recommendations fetched"));
});

export const compareProducts = asyncHandler(async (req, res) => {
  const result = await aiService.compareProducts(
    Array.isArray(req.body?.productIds) ? req.body.productIds : [],
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "AI product comparison completed"));
});

export const getCartSuggestions = asyncHandler(async (req, res) => {
  const result = await aiService.getCartSuggestions(
    Array.isArray(req.body?.productIds) ? req.body.productIds : [],
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "AI cart suggestions fetched"));
});

export const getReviewSummary = asyncHandler(async (req, res) => {
  const result = await aiService.getReviewSummary(req.params.productId);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "AI review summary fetched"));
});

export const getOrderStatus = asyncHandler(async (req, res) => {
  const result = await aiService.getOrderStatus(req.user._id, req.params.orderId);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "AI order status context fetched"));
});
