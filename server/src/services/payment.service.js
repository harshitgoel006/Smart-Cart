import { Payment } from "../models/payment.model.js";
import { Order } from "../models/order.model.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

class PaymentService {
    
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
