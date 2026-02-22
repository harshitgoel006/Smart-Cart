export const invoiceEmailTemplate = (orderData) => {
  const itemsHTML = orderData.items
    .map(
      (item, idx) => `
    <tr style="border-bottom: 1px solid #ddd;">
      <td style="padding: 12px; text-align: center;">${idx + 1}</td>
      <td style="padding: 12px;">${item.product?.name || "Product"}</td>
      <td style="padding: 12px; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; text-align: right;">₹${item.price?.toFixed(2)}</td>
      <td style="padding: 12px; text-align: right;">₹${(item.quantity * item.price)?.toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .invoice-box { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2ecc71; padding-bottom: 20px; }
        .header h1 { color: #2ecc71; margin: 0; font-size: 28px; }
        .order-info { background: #f0f0f0; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .order-info p { margin: 8px 0; font-size: 14px; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .items-table th { background: #f0f0f0; padding: 12px; text-align: left; border-bottom: 2px solid #333; font-weight: bold; }
        .items-table td { padding: 12px; }
        .summary { text-align: right; margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 5px; }
        .summary-row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 14px; }
        .total-row { font-size: 18px; font-weight: bold; color: #2ecc71; border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="invoice-box">
          <div class="header">
            <h1>📋 SmartCart Invoice</h1>
          </div>

          <div class="order-info">
            <p><strong>Order ID:</strong> ${orderData._id}</p>
            <p><strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
            <p><strong>Status:</strong> ${orderData.orderStatus || "Pending"}</p>
          </div>

          <h3 style="margin-top: 25px;">Order Items</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Product Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>₹${(orderData.subtotal || 0)?.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Shipping Charges:</span>
              <span>₹${(orderData.shippingCost || 0)?.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Discount:</span>
              <span>-₹${(orderData.discountAmount || 0)?.toFixed(2)}</span>
            </div>
            <div class="summary-row total-row">
              <span>Final Amount:</span>
              <span>₹${(orderData.finalAmount || 0)?.toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for shopping with SmartCart! 🙏</p>
            <p>If you have any questions, please contact our support team.</p>
            <p style="margin-top: 15px; color: #999;">© 2025 SmartCart. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};