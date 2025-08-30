import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import{User} from "../models/user.model.js";
import { Product } from "../models/product.model.js";




/*


Locked Order Features — Seller Panel
Own orders listing & access

Order confirmation & fulfillment status update (processing → packed → shipped)

Shipment detail entry & tracking access

Complete order & payment details access

Sales analytics dashboard

Customer communication & notifications

Refund/cancellation request initiation

Order cancellation right with reason

Shipment tracking & risk mitigation control

Return & replacement management


Locked Order Features — Customer Panel
Order history view (past and current orders)

Detailed order information (products, quantity, price, shipping address, payment info)

Order status tracking

Shipment tracking info available tabhi jab "Out for Delivery" ho aur customer ke city me ho

Order cancellation option (policy ke hisaab se)

Return & replacement request submission

Digital invoice and receipt download/view

Repeat order (quick reorder) option

Notifications for order status updates, shipment alerts (email, SMS, push)

Support requests submission (queries, complaints, refund requests)

OTP verification on delivery: order tabhi successfully receive hoga jab OTP verify ho jaye


*/


const listSellerOrders = asyncHandler(async (req, res) => {
  const sellerId = req.user._id; 
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.pageNumber) || 1;
  const { status, startDate, endDate } = req.query;

  let filter = {
    'items.seller': sellerId,
  };
  
  if (status) filter.orderStatus = status;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const count = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .populate('items.product', 'name price')
    .sort({ createdAt: -1 })
    .skip(pageSize * (page - 1))
    .limit(pageSize);

    if (!orders.length || !orders) {
      throw new ApiError(404, "No orders found");
    }

    return res
    .status(200)
    .json(new ApiResponse(
        orders, 
        {
            page,
            pages: Math.ceil(count / pageSize),
            totalOrders: count,
        }
    ));
});

const updateOrderFulfillmentStatus = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const { orderId } = req.params;
  const { itemId, status } = req.body;

  const allowedStatuses = ['Processing', 'Packed', 'Shipped'];
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid fulfillment status');
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  const item = order.items.find(
    (i) => i._id.toString() === itemId && i.seller.toString() === sellerId.toString()
  );

  if (!item) {
    throw new ApiError(403, 'No permission to update this item or item not found');
  }


  item.fulfillmentStatus = status; 

  return res
  .status(200)
  .json(new ApiResponse(
    true,
    { 
        message: 'Fulfillment status updated',
        order
    }
));
});

const updateShipmentDetails = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const { orderId } = req.params;
  const { itemId, trackingNumber, courierName, estimatedDelivery } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  const item = order.items.find(
    (i) => i._id.toString() === itemId && i.seller.toString() === sellerId.toString()
  );

  if (!item) {
    throw new ApiError(403, 'Permission denied or item not found');
  }

  item.shipment = item.shipment || {}; 
  item.shipment.trackingNumber = trackingNumber || item.shipment.trackingNumber;
  item.shipment.courierName = courierName || item.shipment.courierName;
  item.shipment.estimatedDelivery = estimatedDelivery ? new Date(estimatedDelivery) : item.shipment.estimatedDelivery;

  await order.save();

   return res
  .status(200)
  .json(new ApiResponse(
    true,
    { 
        message: 'Shipment details updated', 
        order 
    }
));
});






// ======================================================
// =============== ADMIN PANNEL HANDLERS ================
// ======================================================


const orderListing = asyncHandler(async(req, res) =>{
    const {status, customer, seller, paymentStatus, startDate, endDate} = req.query;
    const pageSize =  Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1; 

    let filter ={};

    if(status) filter.status = status;
    if(customer) filter.customer = customer;
    if(seller) filter["items.seller"] = seller;
    if(paymentStatus) filter.paymentStatus = paymentStatus;
    if(startDate || endDate){
        filter.createdAt = {};
        if(startDate) filter.createdAt.$gte = new Date(startDate);
        if(endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const count = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
    .populate("user","name email")
    .populate("items.product","name price")
    .populate("items.seller","name email")
    .sort({createdAt: -1})
    .skip(pageSize * (page - 1))
    .limit(pageSize);

    return res 
    .status(200)
    .json(new ApiResponse(
        true, 
        "Orders fetched successfully", 
        {
            orders, 
            page, 
            pages: Math.ceil(count / pageSize), 
            totalOrders: count
        }
    ));

});

const getOrderDetails = asyncHandler(async(req, res)=>{
    const {orderId} = req.params;

    const order = await Order.findById(orderId)
    .populate("user","name email")
    .populate("items.product","name price")
    .populate("items.seller","name email");

    if(!order){
        throw new ApiError(404, "Order not found");
    }

    return res.
    status(200)
    .json(new ApiResponse(
        true,
        "Order details fetched successfully",
        order
    ))

});

const updateOrderStatus = asyncHandler(async(req, res) =>{
    const {orderId} = req.params;
    const {status} = req.body;

    const allowedStatus = ["Pending", "Confirmed", "Processing", "Packed", "Shipped", "Delivered", "Cancelled"];

    if(!allowedStatus.includes(status)){
        throw new ApiError(400, "Invalid order status");
    }

    const order = await Order.findById(orderId);

    if(!order){
        throw new ApiError(404, "Order not found");
    }

    order.orderStatus = status;
    if(status === "Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save();

    return res.
    status(200)
    .json(new ApiResponse(
        true,
        message = `Order status updated to ${status} successfully`,
        order
    ))

});

const manageRefundCancellationRequest = asyncHandler(async(req, res) =>{

    const {orderId} = req.params;
    const {action} = req.body; // 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
    throw new ApiError(400, 'Invalid action value');
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.refundRequestStatus !== 'Pending') {
    throw new ApiError(400, 'No pending refund/cancellation request');
  }
  order.refundRequestStatus = action === 'approve' ? 'Approved' : 'Rejected';
  await order.save();

  return res 
  .status(200)
  .json(new ApiResponse(
    true,
    `Refund/Cancellation request ${order.refundRequestStatus}`,
    order
  ))

});

const getInvoice = asyncHandler(async(req, res)=>{

    const order = await Order.findById(req.params.id)
    .populate("user","name email")
    .populate("items.product","name price")

    if(!order){
        throw new ApiError(404, "Order not found");
    }

    const invoiceData = {
        orderId: order._id,
        customerName: order.user.name,
        customerEmail: order.user.email,
        items: order.items.map(item => ({
            productName: item.product.name,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
        })),
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        orderedAt: order.createdAt,
    };

    return res 
    .status(200)
    .json(new ApiResponse(
        true,
        "Invoice fetched successfully",
        invoiceData
    ));
});

const getSalesAnalytics = asyncHandler(async(req, res) =>{
    const {startDate, endDate, seller} = req.query;

    let match = {};

    if(startDate || endDate){
        match.createdAt = {};
        if (startDate) match.createdAt.$gte = new Date(startDate);
        if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    if(seller){
        match['items.seller'] = seller;
    }

    const stats = await Order.aggregate([
        {
            $match:match
        },
        {
            $unwind: "$items"
        },
        seller? {
            $match:{
                'items.seller': seller
            }
        }:{
            $match:{}
        },
        {
            $group:{
                _id:null,
                totalSales: {$sum: "$totalAmount"},
                totalOrders: {$sum: 1},
            }
        }
    ]);
    return res 
    .status(200)
    .json(new ApiResponse(
        true,
        "Sales analytics fetched successfully",
        stats[0] || { totalSales: 0, totalOrders: 0 }
    ))

});






export {


    orderListing,
    getOrderDetails,
    updateOrderStatus,
    manageRefundCancellationRequest,
    getInvoice,
    getSalesAnalytics,

};
