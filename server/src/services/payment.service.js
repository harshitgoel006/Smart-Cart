// This file defines the PaymentService class, which contains static methods for handling payment-related operations. The service includes methods for initiating a dummy payment and completing a dummy payment. The initiatePayment method validates the order ID, checks if the order exists and belongs to the user, and ensures that the order is not already paid. It also implements idempotency by checking for existing payments with a "created" or "pending" status for the same order and user. If such a payment exists, it returns that payment instead of creating a new one. If no such payment exists, it creates a new payment record and updates the order's payment status to "pending". The completePayment method updates the payment status based on the provided payment ID and status, and also updates the associated order's payment status and order status accordingly. Both methods include error handling to ensure proper validation and authorization.File: server/src/controllers/payment.controller.js

import { Payment } from "../models/payment.model.js";
import { Order } from "../models/order.model.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

// This service handles payment-related operations. It includes methods for initiating a dummy payment and completing a dummy payment. The initiatePayment method validates the order ID, checks if the order exists and belongs to the user, and ensures that the order is not already paid. It also implements idempotency by checking for existing payments with a "created" or "pending" status for the same order and user. If such a payment exists, it returns that payment instead of creating a new one. If no such payment exists, it creates a new payment record and updates the order's payment status to "pending". The completePayment method updates the payment status based on the provided payment ID and status, and also updates the associated order's payment status and order status accordingly. Both methods include error handling to ensure proper validation and authorization.
class PaymentService {
    
  // This method initiates a dummy payment for an order. It validates the order ID, checks if the order exists and belongs to the user, and ensures that the order is not already paid. It also implements idempotency by checking for existing payments with a "created" or "pending" status for the same order and user. If such a payment exists, it returns that payment instead of creating a new one. If no such payment exists, it creates a new payment record and updates the order's payment status to "pending". Finally, it returns the payment details in the response.
  static async initiatePayment(userId, orderId) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ApiError(400, "Invalid order ID");
    }

    const order = await Order.findById(orderId);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (order.user.toString() !== userId.toString()) {
      throw new ApiError(403, "Unauthorized");
    }

    if (order.paymentStatus === "paid") {
      throw new ApiError(400, "Order already paid");
    }

    const existingPayment = await Payment.findOne({
      order: orderId,
      user: userId,
      status: { $in: ["created", "pending"] },
    });

    if (existingPayment) {
      return existingPayment;
    }

    const payment = await Payment.create({
      order: order._id,
      user: userId,
      provider: "dummy",
      amountInPaise: Math.round(order.finalAmount * 100),
      currency: "INR",
      status: "created",
      method: "dummy",
    });

    order.paymentStatus = "pending";
    await order.save();

    return payment;
  }

  //   This method completes a dummy payment by updating the payment status based on the provided payment ID and status. It calls the completePayment method of the PaymentService, passing the user ID, payment ID, and new status. The updated payment details are then returned in the response.
  static async completePayment(userId, paymentId, status) {
    if (!["success", "failed"].includes(status)) {
      throw new ApiError(400, "Invalid status");
    }

    const payment = await Payment.findById(paymentId).populate("order");

    if (!payment) {
      throw new ApiError(404, "Payment not found");
    }

    if (payment.user.toString() !== userId.toString()) {
      throw new ApiError(403, "Unauthorized");
    }

    if (payment.status === "success") {
      throw new ApiError(400, "Payment already completed");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      payment.status = status;
      await payment.save({ session });

      const order = payment.order;

      if (status === "success") {
        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
      } else {
        order.paymentStatus = "failed";
      }

      await order.save({ session });

      await session.commitTransaction();

      return {
        orderId: order._id,
        paymentStatus: payment.status,
      };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
}

export default PaymentService;
