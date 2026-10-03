import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../../models/user.model.js";
import { Category } from "../../models/category.model.js";
import { Product } from "../../models/product.model.js";
import { Order } from "../../models/order.model.js";
import { Review } from "../../models/review.model.js";
import { ProductQnA } from "../../models/productQnA.model.js";
import { DB_NAME } from "../../constant.js";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required");

const image = (id) => ({
  public_id: `smartcart-demo/${id}`,
  url: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`,
});

const decimal = (value) => mongoose.Types.Decimal128.fromString(String(value));

await mongoose.connect(`${uri}/${DB_NAME}`);

const seller = await User.findOne({ email: "sapnagoel493@gmail.com" }).select("+password +sellerProfile");
if (!seller) throw new Error("Existing seller account sapnagoel493@gmail.com was not found");
if (seller.role !== "seller") throw new Error(`sapnagoel493@gmail.com has role ${seller.role}, not seller`);
if (!seller.isActive || seller.isDeleted) throw new Error("Existing seller account is inactive or deleted");

const customer = await User.findOneAndUpdate(
  { email: "demo.customer@smartcart.test" },
  {
    $set: {
      username: "demo_customer",
      fullname: "SmartCart Demo Customer",
      phone: "9876543211",
      role: "customer",
      isActive: true,
      isDeleted: false,
      isEmailVerified: true,
      isPhoneVerified: true,
    },
    $setOnInsert: { password: "Customer@123" },
  },
  { upsert: true, new: true, setDefaultsOnInsert: true },
);

let category = await Category.findOne({ slug: "seller-demo-collection" });
if (!category) {
  category = await Category.create({
    name: "Seller Demo Collection",
    description: "Approved category used for seller workspace verification.",
    status: "approved",
    isActive: true,
    isFeatured: true,
    tags: ["demo", "seller", "home"],
    createdBy: seller._id,
  });
}

let proposal = await Category.findOne({ slug: "demo-sellers-picks" });
if (!proposal) {
  proposal = await Category.create({
    name: "Demo Seller's Picks",
    description: "A sample pending proposal for testing seller category controls.",
    status: "pending",
    isActive: false,
    proposedBy: seller._id,
    createdBy: seller._id,
    tags: ["demo", "proposal"],
  });
}

const productData = [
  { name: "Demo Ceramic Table Lamp", price: 2499, stock: 24, featured: true, discountPercentage: 10, imageId: "photo-1507473885765-e6ed057f782c" },
  { name: "Demo Linen Lounge Cushion", price: 899, stock: 42, featured: false, discountPercentage: 0, imageId: "photo-1584100936595-c0654b55a2a2" },
  { name: "Demo Oak Desk Organizer", price: 1299, stock: 18, featured: true, discountPercentage: 5, imageId: "photo-1518455027359-f3f8164ba6b7" },
];

const products = [];
for (const data of productData) {
  let product = await Product.findOne({ name: data.name, seller: seller._id });
  if (!product) product = new Product({ name: data.name, seller: seller._id });
  product.set({
    description: `Demo product for verifying ${data.name.toLowerCase()} seller controls.`,
    brand: "SmartCart Demo",
    price: decimal(data.price),
    discountPercentage: data.discountPercentage,
    stock: data.stock,
    category: category._id,
    images: [image(data.imageId)],
    coverImage: image(data.imageId),
    approvalStatus: "approved",
    isActive: true,
    isArchived: false,
    isDeleted: false,
    featured: data.featured,
    tags: ["demo", "seller-test", "home"],
  });
  await product.save();
  products.push(product);
}

const purchasedProduct = products[0];
let order = await Order.findOne({ qrCode: "SMARTCART-DEMO-ORDER-001" });
if (!order) {
  const lineTotal = decimal(2499);
  order = await Order.create({
    user: customer._id,
    qrCode: "SMARTCART-DEMO-ORDER-001",
    items: [{
      product: purchasedProduct._id,
      seller: seller._id,
      productSnapshot: { name: purchasedProduct.name, image: purchasedProduct.coverImage.url, slug: purchasedProduct.slug },
      unitPrice: decimal(2499),
      quantity: 1,
      lineTotal,
      fulfillmentStatus: "delivered",
      shipment: { courierName: "Demo Express", trackingNumber: "DEMO123456" },
    }],
    shippingAddress: { fullName: customer.fullname, mobile: customer.phone, addressLine: "21 Demo Street", city: "Jaipur", state: "Rajasthan", pincode: "302001", country: "India" },
    paymentMethod: "COD",
    paymentStatus: "paid",
    subtotal: lineTotal,
    discount: decimal(0),
    tax: decimal(0),
    deliveryCharge: decimal(0),
    finalAmount: lineTotal,
    orderStatus: "delivered",
    statusHistory: [{ status: "delivered", changedBy: seller._id, role: "seller", comment: "Demo order seeded for seller verification" }],
  });
}

const item = order.items[0];
await Review.findOneAndUpdate(
  { product: purchasedProduct._id, user: customer._id, order: order._id },
  {
    product: purchasedProduct._id,
    user: customer._id,
    order: order._id,
    orderItemId: String(item._id),
    rating: 5,
    title: "Great demo product",
    comment: "Looks premium and arrived safely. This review is seeded for seller reply testing.",
    isVerifiedPurchase: true,
    status: "approved",
  },
  { upsert: true, new: true, setDefaultsOnInsert: true },
);

await ProductQnA.findOneAndUpdate(
  { product: purchasedProduct._id, user: customer._id, question: "Does this demo lamp support LED bulbs?" },
  { product: purchasedProduct._id, seller: seller._id, user: customer._id, question: "Does this demo lamp support LED bulbs?", status: "pending", isDeleted: false },
  { upsert: true, new: true, setDefaultsOnInsert: true },
);

console.log(JSON.stringify({
  message: "Seller demo data seeded successfully",
  sellerLogin: { email: "sapnagoel493@gmail.com", password: "unchanged" },
  customerLogin: { email: "demo.customer@smartcart.test", password: "Customer@123" },
  sellerId: seller._id,
  productIds: products.map((product) => product._id),
  orderId: order._id,
  proposalId: proposal._id,
}, null, 2));

await mongoose.disconnect();
