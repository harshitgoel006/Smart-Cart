import { SiteSettings } from "../models/siteSettings.model.js";

const defaults = {
  singleton: "main",
  homepage: {
    sections: [
      { key: "offers", label: "Offers", enabled: true, order: 1 },
      { key: "categories", label: "Categories", enabled: true, order: 2 },
      { key: "trending", label: "Trending products", enabled: true, order: 3 },
      { key: "ai-recommendations", label: "AI recommendations", enabled: true, order: 4 },
      { key: "new-arrivals", label: "New arrivals", enabled: true, order: 5 },
      { key: "editorial", label: "Editorial feature", enabled: true, order: 6 },
      { key: "top-rated", label: "Top rated", enabled: true, order: 7 },
      { key: "brands", label: "Brands", enabled: true, order: 8 },
      { key: "testimonials", label: "Testimonials", enabled: true, order: 9 },
    ],
  },
};

export const siteSettingsService = {
  async getPublic() {
    let settings = await SiteSettings.findOne({ singleton: "main" }).lean();
    if (!settings) settings = await SiteSettings.create(defaults).then((doc) => doc.toObject());
    return settings;
  },

  async update(payload, adminId) {
    const allowed = ["brand", "announcement", "theme", "features", "homepage", "seo", "maintenanceMode"];
    const updates = {};
    for (const key of allowed) if (payload[key] !== undefined) updates[key] = payload[key];
    return SiteSettings.findOneAndUpdate(
      { singleton: "main" },
      { $set: { ...updates, updatedBy: adminId }, $setOnInsert: { singleton: "main" } },
      { new: true, upsert: true, runValidators: true },
    ).lean();
  },
};
