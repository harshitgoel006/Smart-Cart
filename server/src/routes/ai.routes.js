import { Router } from "express";
import {
  assistCustomer,
  compareProducts,
  getCartSuggestions,
  getOrderStatus,
  getRecommendations,
  getPersonalizedRecommendations,
  getReviewSummary,
  searchWithAssistant,
} from "../controllers/ai.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";

const router = Router();

router.post("/assistant", assistCustomer);
router.post("/search", searchWithAssistant);
router.get("/recommendations", getRecommendations);
router.get(
  "/recommendations/me",
  verifyJWT,
  authorizedRole("customer"),
  getPersonalizedRecommendations,
);
router.post("/compare", compareProducts);
router.post("/cart-suggestions", getCartSuggestions);
router.get("/reviews/:productId/summary", getReviewSummary);
router.get(
  "/orders/:orderId/status",
  verifyJWT,
  authorizedRole("customer"),
  getOrderStatus,
);

export default router;
