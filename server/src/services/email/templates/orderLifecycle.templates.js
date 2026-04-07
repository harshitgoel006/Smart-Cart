// This file contains email templates for different stages of the order lifecycle, such as when an order is shipped, delivered, confirmed, or packed. Each template is a function that takes an order object as an argument and returns an HTML string that can be sent as an email to the user.

// The orderShippedEmailTemplate function generates an email template for when an order is shipped. It includes the courier name and tracking number if available, and informs the user that their order has been shipped.
export const orderShippedEmailTemplate = (order) => {
  const tracking = order.items[0]?.shipment || {};
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #2c3e50;">Order Shipped! 📦</h2>
      <p>Hi ${order.user.fullname},</p>
      <p>Your order #${order._id} has been shipped!</p>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
        <p><strong>Courier:</strong> ${tracking.courierName || "N/A"}</p>
        <p><strong>Tracking:</strong> ${tracking.trackingNumber || "N/A"}</p>
      </div>
      <p>Thank you for ordering!</p>
    </div>
  `;
};

// The orderDeliveredEmailTemplate function generates an email template for when an order is delivered. It includes a call-to-action button that directs the user to leave a review for their order.
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

// The orderConfirmedEmailTemplate function generates an email template for when an order is confirmed. It informs the user that their order has been confirmed by the seller and will ship within 1-2 days.
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

// The orderPackedEmailTemplate function generates an email template for when an order is packed. It informs the user that their order is being packed and will ship soon.
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
