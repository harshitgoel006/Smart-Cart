import PDFDocument from "pdfkit";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

export function createSmartCartInvoice(order, invoice) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ size: "A4", margin: 42 });
    const brown = "#7b421f";
    const ink = "#2b211c";
    const muted = "#76685f";
    const cream = "#f7ede0";
    const line = "#e5d7c8";
    const officialEmail = process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM_EMAIL || "smartcart025@gmail.com";
    const box = (x, y, width, height, fill = cream) => doc.roundedRect(x, y, width, height, 8).fillAndStroke(fill, line);
    const field = (label, value, x, y) => {
      doc.font("Helvetica-Bold").fontSize(8).fillColor(ink).text(label, x, y);
      doc.font("Helvetica").fontSize(8).fillColor(muted).text(value || "-", x + 76, y);
    };
    // Same bag mark used by the navbar brand badge.
    const drawBagLogo = (x, y, scale = 1) => {
      doc.save();
      doc.fillColor(brown).roundedRect(x, y, 46 * scale, 46 * scale, 10 * scale).fill();
      doc.strokeColor("#fffaf4").lineWidth(3.5 * scale).lineJoin("round").lineCap("round");
      doc.moveTo(x + 18 * scale, y + 25 * scale).lineTo(x + 46 * scale, y + 25 * scale).lineTo(x + 43.6 * scale, y + 49 * scale).lineTo(x + 20.4 * scale, y + 49 * scale).closePath().stroke();
      doc.moveTo(x + 25 * scale, y + 25 * scale).lineTo(x + 25 * scale, y + 20.8 * scale).quadraticCurveTo(x + 25 * scale, y + 14 * scale, x + 32 * scale, y + 14 * scale).quadraticCurveTo(x + 39 * scale, y + 14 * scale, x + 39 * scale, y + 20.8 * scale).lineTo(x + 39 * scale, y + 25 * scale).stroke();
      doc.moveTo(x + 24 * scale, y + 32 * scale).lineTo(x + 40 * scale, y + 32 * scale).stroke();
      doc.restore();
    };
    const address = order.shippingAddress || {};
    const customerName = order.user?.fullname || address.fullName || "SmartCart customer";
    const shortId = String(order._id).slice(-8).toUpperCase();
    const addressLines = [
      customerName,
      address.addressLine || address.street,
      `${address.city || ""}, ${address.state || ""} - ${address.pincode || ""}`,
      address.country || "India",
      address.mobile ? `Phone: ${address.mobile}` : "",
      `Email: ${officialEmail}`,
    ].filter(Boolean);

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.rect(0, 0, doc.page.width, 116).fill(cream);
    drawBagLogo(44, 35, 0.72);
    doc.fillColor(ink).font("Helvetica-Bold").fontSize(26).text("SmartCart", 108, 36);
    doc.fillColor(brown).font("Helvetica").fontSize(8).text("SHOP SMART. LIVE BETTER.", 110, 68, { characterSpacing: 1.8 });
    doc.fillColor(muted).font("Helvetica").fontSize(9).text("smartcart.com", 420, 39, { align: "right", width: 132 });
    doc.text(officialEmail, 420, 55, { align: "right", width: 132 });
    doc.text("Dehradun, Uttarakhand, India", 420, 71, { align: "right", width: 132 });

    doc.fillColor(ink).font("Helvetica-Bold").fontSize(27).text("INVOICE", 42, 145);
    doc.fillColor(muted).font("Helvetica").fontSize(10).text("Thank you for shopping with SmartCart.", 44, 180);
    field("Invoice No.", invoice.number, 330, 146);
    field("Order ID", `#${shortId}`, 330, 162);
    field("Order Date", invoice.date, 330, 178);
    field("Payment", `${order.paymentMethod || "COD"} | ${order.paymentStatus || "pending"}`, 330, 194);

    const addressY = 228;
    box(42, addressY, 246, 132);
    box(306, addressY, 247, 132);
    doc.fillColor(brown).font("Helvetica-Bold").fontSize(11).text("BILLING ADDRESS", 56, addressY + 18);
    doc.text("SHIPPING ADDRESS", 320, addressY + 18);
    doc.fillColor(ink).font("Helvetica-Bold").fontSize(10).text(addressLines[0], 56, addressY + 43);
    doc.font("Helvetica").fillColor(muted).text(addressLines.slice(1).join("\n"), 56, addressY + 59, { width: 220, lineGap: 2 });
    doc.fillColor(ink).font("Helvetica-Bold").text(addressLines[0], 320, addressY + 43);
    doc.font("Helvetica").fillColor(muted).text(addressLines.slice(1, 5).join("\n"), 320, addressY + 59, { width: 220, lineGap: 2 });

    let tableY = 388;
    const columns = [42, 72, 320, 426, 484];
    doc.roundedRect(42, tableY, 511, 30, 6).fill(brown);
    doc.fillColor("#fff").font("Helvetica-Bold").fontSize(9);
    doc.text("#", columns[0], tableY + 10);
    doc.text("PRODUCT", columns[1], tableY + 10);
    doc.text("PRICE", columns[2], tableY + 10, { width: 86, align: "right" });
    doc.text("QTY", columns[3], tableY + 10, { width: 42, align: "right" });
    doc.text("TOTAL", columns[4], tableY + 10, { width: 69, align: "right" });
    tableY += 30;
    invoice.items.forEach((item, index) => {
      doc.rect(42, tableY, 511, 36).fill(index % 2 ? "#fffaf5" : "#ffffff").stroke(line);
      doc.fillColor(ink).font("Helvetica").fontSize(9).text(String(index + 1), columns[0], tableY + 13);
      doc.font("Helvetica-Bold").text(item.product?.name || "Product", columns[1], tableY + 8, { width: 235, ellipsis: true });
      doc.font("Helvetica").text(money(item.price), columns[2], tableY + 13, { width: 86, align: "right" });
      doc.text(String(item.quantity), columns[3], tableY + 13, { width: 42, align: "right" });
      doc.font("Helvetica-Bold").text(money(item.lineTotal), columns[4], tableY + 13, { width: 69, align: "right" });
      tableY += 36;
    });

    const summaryY = tableY + 22;
    box(42, summaryY, 245, 126);
    box(306, summaryY, 247, 126, "#fffaf5");
    doc.fillColor(brown).font("Helvetica-Bold").fontSize(11).text("PAYMENT DETAILS", 56, summaryY + 20);
    field("Method", order.paymentMethod || "COD", 56, summaryY + 48);
    field("Status", order.paymentStatus || "pending", 56, summaryY + 66);
    field("Transaction", order.transactionId || "-", 56, summaryY + 84);
    doc.fillColor(brown).font("Helvetica-Bold").fontSize(11).text("ORDER TOTAL", 320, summaryY + 20);
    field("Subtotal", money(invoice.subtotal), 320, summaryY + 48);
    field("Delivery", money(invoice.shippingCost), 320, summaryY + 66);
    field("Discount", `- ${money(invoice.discountAmount)}`, 320, summaryY + 84);
    doc.moveTo(320, summaryY + 101).lineTo(537, summaryY + 101).stroke(line);
    doc.fillColor(brown).font("Helvetica-Bold").fontSize(14).text("Total", 320, summaryY + 108);
    doc.text(money(invoice.finalAmount), 420, summaryY + 108, { width: 117, align: "right" });

    const footerY = summaryY + 157;
    box(42, footerY, 511, 58);
    doc.fillColor(brown).font("Helvetica-Bold").fontSize(10).text("A note from SmartCart", 56, footerY + 15);
    doc.fillColor(muted).font("Helvetica").fontSize(9).text("This is a computer-generated invoice and does not require a signature.", 56, footerY + 32);
    doc.fillColor(brown).font("Helvetica-Bold").fontSize(12).text("Thank you for shopping with", 42, footerY + 88, { align: "center", width: 511 });
    drawBagLogo(246, footerY + 110, 0.34);
    doc.fillColor(ink).font("Helvetica-Bold").fontSize(17).text("SmartCart", 275, footerY + 108);
    doc.fillColor(muted).font("Helvetica").fontSize(8).text(`Secure payments  |  Reliable delivery  |  Easy 7-day returns  |  ${officialEmail}`, 42, footerY + 139, { align: "center", width: 511 });
    doc.end();
  });
}
