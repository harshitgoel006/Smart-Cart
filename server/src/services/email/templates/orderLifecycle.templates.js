
// For Shipped orders
export const orderShippedEmailTemplate = (order) => {
  const tracking = order.items[0]?.shipment || {};
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #2c3e50;">Order Shipped! 📦</h2>
      <p>Hi ${order.user.fullname},</p>
      <p>Your order #${order._id} has been shipped!</p>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
        <p><strong>Courier:</strong> ${tracking.courierName || 'N/A'}</p>
        <p><strong>Tracking:</strong> ${tracking.trackingNumber || 'N/A'}</p>
      </div>
      <p>Thank you for ordering!</p>
    </div>
  `;
};

// For Delivered orders
export const orderDeliveredEmailTemplate = (order) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #27ae60;">Order Delivered! ✅</h2>
      <p>Hi ${order.user.fullname},</p>
      <p>Your order #${order._id} has been delivered!</p>
      <p><a href="${process.env.FRONTEND_URL}/orders/${order._id}/review" style="background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Leave a Review</a></p>
      <p>Thank you!</p>
    </div>
  `;
};

// For Confirmed orders
export const orderConfirmedEmailTemplate = (order) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #f39c12;">Order Confirmed! 🎉</h2>
      <p>Hi ${order.user.fullname},</p>
      <p>Your order #${order._id} has been confirmed by the seller.</p>
      <p>It will ship within 1-2 days.</p>
      <p>Thank you!</p>
    </div>
  `;
};

// For Packed orders
export const orderPackedEmailTemplate = (order) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #9b59b6;">Order Packed! 📦</h2>
      <p>Hi ${order.user.fullname},</p>
      <p>Your order #${order._id} is being packed and will ship very soon.</p>
      <p>Thank you!</p>
    </div>
  `;
};
