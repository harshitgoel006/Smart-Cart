import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import PaymentService from "../services/payment.service.js";

// ======================================================
// =============== CUSTOMER PANNEL HANDLERS =============
// ======================================================

// This controller initiates a dummy payment for an order. It validates the order ID, checks if the order exists and belongs to the user, and ensures that the order is not already paid. It also implements idempotency by checking for existing payments with a "created" or "pending" status for the same order and user. If such a payment exists, it returns that payment instead of creating a new one. If no such payment exists, it creates a new payment record and updates the order's payment status to "pending". Finally, it returns the payment details in the response.
const initiateDummyPayment = asyncHandler(async (req, res) => {
  const payment = await PaymentService.initiatePayment(
    req.user._id,
    req.body.orderId,
  );

  return res
    .status(201)
    .json(new ApiResponse(201, payment, "Payment initiated"));
});

// This controller completes a dummy payment by updating the payment status based on the provided payment ID and status. It calls the completePayment method of the PaymentService, passing the user ID, payment ID, and new status. The updated payment details are then returned in the response.
const completeDummyPayment = asyncHandler(async (req, res) => {
  const data = await PaymentService.completePayment(
    req.user._id,
    req.body.paymentId,
    req.body.status,
  );

  return res.status(200).json(new ApiResponse(200, data, "Payment updated"));
});

// Exporting the controller functions for initiating and completing dummy payments, which can be used in the routes to handle payment-related requests from the client.
export { initiateDummyPayment, completeDummyPayment };
