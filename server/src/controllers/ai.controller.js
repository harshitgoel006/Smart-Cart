import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { aiService } from "../services/ai.service.js";

export const assistCustomer = asyncHandler(async (req, res) => {
  const result = await aiService.assist(req.body?.message);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "SmartCart assistant response generated"));
});
