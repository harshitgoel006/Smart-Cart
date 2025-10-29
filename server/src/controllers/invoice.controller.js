import path from "path";
import { generateInvoicePDF } from "../utils/invoiceGenerator.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Order } from "../models/order.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


// Controller to generate and upload invoice PDF

const generateAndUploadInvoiceController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.params;

  const order = await Order.findOne({ _id: orderId, user: userId }).populate("items.product");
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  const invoicePath = path.resolve(`./public/temp/invoice_${order._id}.pdf`);

  await generateInvoicePDF(order, invoicePath);

  const cloudinaryResponse = await uploadOnCloudinary(invoicePath);

  if (!cloudinaryResponse) {
    throw new ApiError(500, "Failed to upload invoice to cloud.");
  }

  order.invoiceUrl = cloudinaryResponse.url;
  await order.save();

  return res.status(200).json(new ApiResponse(200, { invoiceUrl: cloudinaryResponse.url }, "Invoice generated and uploaded successfully."));
});

export { 
    generateAndUploadInvoiceController 
};
