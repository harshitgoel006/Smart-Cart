import { Router } from "express";
import {
  initiateDummyPayment,
  completeDummyPayment,
} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";

const router = Router();

// ======================================================
// =============== CUSTOMER PANEL HANDLERS ==============
// ======================================================

router
  .route("/initiate")
  .post(verifyJWT, authorizedRole("customer"), initiateDummyPayment);

router
  .route("/complete")
  .post(verifyJWT, authorizedRole("customer"), completeDummyPayment);


export default router;
