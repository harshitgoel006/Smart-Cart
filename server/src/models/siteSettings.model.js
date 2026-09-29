import mongoose from "mongoose";

const heroSlideSchema = new mongoose.Schema({
  eyebrow: String,
  title: String,
  description: String,
  imageUrl: String,
  ctaLabel: String,
  ctaLink: String,
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: true });

const homepageSectionSchema = new mongoose.Schema({
  key: { type: String, required: true },
  label: String,
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: false });

const siteSettingsSchema = new mongoose.Schema({
  singleton: { type: String, default: "main", unique: true },
  brand: {
    logoUrl: String,
    faviconUrl: String,
    email: { type: String, default: "support@smartcart.com" },
    phone: String,
    address: String,
  },
  announcement: {
    enabled: { type: Boolean, default: true },
    text: { type: String, default: "Free shipping on orders above ₹999" },
    code: String,
  },
  theme: {
    primaryColor: { type: String, default: "#7b421f" },
    backgroundColor: { type: String, default: "#fbf7f1" },
    accentColor: { type: String, default: "#b9622f" },
    headingFont: { type: String, default: "Playfair Display" },
    bodyFont: { type: String, default: "Inter" },
  },
  features: {
    aiRecommendations: { type: Boolean, default: true },
    askAi: { type: Boolean, default: true },
    wishlist: { type: Boolean, default: true },
    reviews: { type: Boolean, default: true },
    coupons: { type: Boolean, default: true },
  },
  homepage: {
    heroSlides: { type: [heroSlideSchema], default: [] },
    sections: { type: [homepageSectionSchema], default: [
      { key: "offers", label: "Offers", enabled: true, order: 1 },
      { key: "categories", label: "Categories", enabled: true, order: 2 },
      { key: "trending", label: "Trending products", enabled: true, order: 3 },
      { key: "ai-recommendations", label: "AI recommendations", enabled: true, order: 4 },
      { key: "new-arrivals", label: "New arrivals", enabled: true, order: 5 },
      { key: "editorial", label: "Editorial feature", enabled: true, order: 6 },
      { key: "top-rated", label: "Top rated", enabled: true, order: 7 },
      { key: "brands", label: "Brands", enabled: true, order: 8 },
      { key: "testimonials", label: "Testimonials", enabled: true, order: 9 },
    ] },
    featuredCategoryIds: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    featuredProductIds: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  },
  seo: {
    title: { type: String, default: "SmartCart · Shop smart. Live better." },
    description: String,
    ogImage: String,
  },
  maintenanceMode: { type: Boolean, default: false },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);
