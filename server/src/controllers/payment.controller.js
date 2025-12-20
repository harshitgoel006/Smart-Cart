import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { Payment } from "../models/payment.model.js";
import { Order } from "../models/order.model.js";


// ======================================================
// =============== CUSTOMER PANNEL HANDLERS =============
// ======================================================



// initiate dummy payment
const initiateDummyPayment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.body;

  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.user.toString() !== userId.toString()) {
    throw new ApiError(403, "Not allowed for this order");
  }

  if (!order.totalAmount) {
    throw new ApiError(400, "Order amount is missing");
  }

  const payment = await Payment.create({
    order: order._id,
    user: userId,
    provider: "dummy",
    amount: order.totalAmount,
    currency: "INR",
    status: "created",
    method: "dummy",
  });

  order.paymentStatus = "pending";
  await order.save();

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        true,
        "Dummy payment initiated successfully",
        {
          paymentId: payment._id,
          orderId: order._id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
        }
      )
    );
});


// complete dummy payment (success / failed)
const completeDummyPayment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { paymentId, status } = req.body; // "success" | "failed"

  if (!paymentId) {
    throw new ApiError(400, "Payment ID is required");
  }

  if (!["success", "failed"].includes(status)) {
    throw new ApiError(400, "Status must be 'success' or 'failed'");
  }

  const payment = await Payment.findById(paymentId).populate("order");

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  if (payment.user.toString() !== userId.toString()) {
    throw new ApiError(403, "Not allowed for this payment");
  }

  const order = payment.order;

  payment.status = status;
  await payment.save();

  if (status === "success") {
    order.paymentStatus = "paid";
    order.status = "confirmed"; // ya "processing" as per your flow
  } else {
    order.paymentStatus = "failed";
    // order.status = "cancelled"; // agar chahiye
  }

  await order.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        true,
        `Dummy payment ${status} successfully`,
        {
          orderId: order._id,
          orderStatus: order.status,
          paymentStatus: payment.status,
        }
      )
    );
});






export {
  initiateDummyPayment,
  completeDummyPayment,
};
