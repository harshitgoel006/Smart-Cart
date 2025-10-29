import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoicePDF = (order, outputFilePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();

    const stream = fs.createWriteStream(outputFilePath);
    doc.pipe(stream);

    // Invoice Header
    doc.fontSize(20).text("SmartCart Invoice", { align: "center" });
    doc.moveDown();

    // Order Info
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Date: ${order.createdAt.toDateString()}`);
    doc.text(`Customer: ${order.shippingAddress.fullName}`);
    doc.moveDown();

    // Table Header
    doc.font("Helvetica-Bold").text("Products:", { underline: true });
    doc.moveDown();

    // Table content
    order.items.forEach((item, idx) => {
      doc.font("Helvetica").text(
        `${idx + 1}. ${item.product.name} - Qty: ${item.quantity} - Price: ₹${item.price}`
      );
    });

    doc.moveDown();

    // Total
    doc.font("Helvetica-Bold").text(`Total Amount: ₹${order.finalAmount}`);
    doc.end();

    stream.on("finish", () => {
      resolve(outputFilePath);
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
};
