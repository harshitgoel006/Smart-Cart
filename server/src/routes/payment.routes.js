// This file defines the routes for payment-related operations in the application. It includes routes for initiating and completing dummy payments, which are protected by JWT authentication and role-based authorization to ensure that only customers can access these routes. The routes call the corresponding controller functions to handle the business logic of payment processing. Additionally, there is a placeholder for potential admin panel handlers related to payments, which can be implemented in the future if needed.

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

// This route is for initiating a dummy payment for an order. It validates the order ID, checks if the order exists and belongs to the user, and ensures that the order is not already paid. It also implements idempotency by checking for existing payments with a "created" or "pending" status for the same order and user. If such a payment exists, it returns that payment instead of creating a new one. If no such payment exists, it creates a new payment record and updates the order's payment status to "pending". Finally, it returns the payment details in the response.
router
  .route("/initiate")
  .post(verifyJWT, authorizedRole("customer"), initiateDummyPayment);

// This route is for completing a dummy payment by updating the payment status based on the provided payment ID and status. It calls the completePayment method of the PaymentService, passing the user ID, payment ID, and new status. The updated payment details are then returned in the response.
router
  .route("/complete")
  .post(verifyJWT, authorizedRole("customer"), completeDummyPayment);

// ======================================================
// =============== ADMIN PANEL HANDLERS (OPTIONAL) ======
// ======================================================
// For dummy payments  there is no  specific admin routes right now;
// in future if payment list and analytics are needed then we can add here

export default router;
