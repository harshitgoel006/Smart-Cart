import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import PaymentService from "../services/payment.service.js";

// ======================================================
// =============== CUSTOMER PANNEL HANDLERS =============
// ======================================================

const initiateDummyPayment = asyncHandler(async (req, res) => {
  const payment = await PaymentService.initiatePayment(
    req.user._id,
    req.body.orderId,
  );

  return res
    .status(201)
    .json(new ApiResponse(201, payment, "Payment initiated"));
});

const completeDummyPayment = asyncHandler(async (req, res) => {
  const data = await PaymentService.completePayment(
    req.user._id,
    req.body.paymentId,
    req.body.status,
  );

  return res.status(200).json(new ApiResponse(200, data, "Payment updated"));
});

export { initiateDummyPayment, completeDummyPayment };
