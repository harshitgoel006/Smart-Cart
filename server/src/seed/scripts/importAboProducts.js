import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import mongoose from "mongoose";
import connectDB from "../../db/index.js";
import { Category } from "../../models/category.model.js";
import { Product } from "../../models/product.model.js";

const SOURCE_DIR = path.resolve(".tmp/listings/metadata");
const IMPORT_TAG = "smartcart-abo-catalog-v1";
const IMAGE_BASE = "https://m.media-amazon.com/images/I/";
const TARGET_TOTAL = 5000;
const CATEGORY_NAMES = [
  "Men",
  "Women",
  "Electronics",
  "Home & Living",
  "Beauty & Grooming",
  "Groceries",
  "Sports & Gym",
  "Gifts",
];

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const firstValue = (items, language = "en_US") => items?.find((item) => item.language_tag === language)?.value || items?.[0]?.value || "";
const imageUrl = (id) => `${IMAGE_BASE}${encodeURIComponent(id)}._AC_US256_.jpg`;
const hasWord = (value, words) => new RegExp(`(?:^|[^a-z])(?:${words.join("|")})(?:[^a-z]|$)`, "i").test(value);

const textFor = (item) => [
  firstValue(item.item_name),
  firstValue(item.brand),
  firstValue(item.product_description),
  firstValue(item.product_type),
  ...(item.node || []).map((node) => node.node_name || ""),
  ...(item.item_keywords || []).map((keyword) => keyword.value || ""),
].join(" ").toLowerCase();

const classify = (item) => {
  const title = firstValue(item.item_name).toLowerCase();
  const text = textFor(item);
  const type = (item.product_type || []).map((value) => value.value || "").join(" ").toLowerCase();
  const node = (item.node || []).map((value) => value.node_name || "").join(" ").toLowerCase();
  const sourceTaxonomy = `${type} ${node}`;

  // Exact source product types must win over marketing words in titles.
  if (/cellular_phone_case|mobile_phone|smartphone|tablet|laptop|headphone|camera|computer/.test(type)) return "Electronics";
  if (/candle|stool_seating|furniture|cabinet|chair|table|lighting|bedding/.test(type)) return "Home & Living";
  if (/grocery|food|beverage|snack|coffee|tea|spice|cereal|confection/.test(type)) return "Groceries";
  if (/beauty|cosmetic|skin|hair|fragrance|makeup|personal_care|shaving/.test(type)) return "Beauty & Grooming";
  if (/sport|fitness|exercise|running|camping|bicycle|golf|swim/.test(type)) return "Sports & Gym";
  if (hasWord(node, ["dames", "women", "ladies", "female"])) return "Women";
  if (hasWord(node, ["heren", "men", "male", "menswear"])) return "Men";

  if (hasWord(title, ["shampoo", "conditioner", "cosmetic", "makeup", "lipstick", "mascara", "perfume", "fragrance", "skincare", "skin-care", "lotion", "razor", "tweezer", "toiletry"])) return "Beauty & Grooming";
  if (hasWord(title, ["food", "snack", "cashew", "coffee", "tea", "spice", "cereal", "rice", "flour", "pasta", "sauce", "chocolate", "candy", "beverage", "juice", "water", "ice-cream", "dog-food"])) return "Groceries";
  if (hasWord(title, ["laptop", "computer", "phone", "tablet", "camera", "headphone", "bluetooth", "television", "monitor", "printer", "keyboard", "mouse", "smartwatch", "speaker", "charger", "router", "3d-printer"])) return "Electronics";
  if (hasWord(title, ["sport", "fitness", "gym", "running", "camping", "hiking", "bicycle", "cycling", "dumbbell", "football", "cricket", "basketball", "golf", "yoga", "walking-shoe"])) return "Sports & Gym";
  if (hasWord(title, ["toy", "game", "puzzle", "gift", "present", "collectible", "hobby", "craft", "plush", "teddy"])) return "Gifts";
  if (hasWord(title, ["women", "woman", "ladies", "female", "dress", "skirt", "blouse", "handbag", "heels", "lingerie", "jewell", "bra", "purse"])) return "Women";
  if (hasWord(title, ["men", "man", "male", "shirt", "trouser", "suit", "tie", "sneaker", "shoe", "coat", "jacket"])) return "Men";
  if (hasWord(title, ["furniture", "chair", "sofa", "table", "desk", "bed", "bedding", "curtain", "rug", "lamp", "lighting", "storage", "drawer", "kitchen", "bathroom", "decor", "canvas", "wall-art"])) return "Home & Living";

  if (hasWord(sourceTaxonomy, ["beauty", "cosmetic", "skin-care", "hair-care", "fragrance", "personal-care", "shaving"])) return "Beauty & Grooming";
  if (hasWord(sourceTaxonomy, ["grocery", "groceries", "food", "beverage", "snack", "coffee", "tea", "spice", "cereal", "pantry", "baking", "canned", "confection"])) return "Groceries";
  if (hasWord(sourceTaxonomy, ["electronics", "computer", "cell-phone", "smartphone", "tablet", "camera", "headphone", "audio", "television", "monitor", "printer", "keyboard", "mouse", "smartwatch", "speaker", "charger", "router"])) return "Electronics";
  if (hasWord(sourceTaxonomy, ["sports", "fitness", "gym", "exercise", "running", "camping", "hiking", "outdoor", "bicycle", "cycling", "dumbbell", "football", "cricket", "basketball", "golf", "yoga"])) return "Sports & Gym";
  if (hasWord(sourceTaxonomy, ["toy", "game", "puzzle", "gift", "present", "collectible", "hobby", "craft", "plush"])) return "Gifts";
  if (hasWord(sourceTaxonomy, ["women", "woman", "ladies", "female", "womenswear"])) return "Women";
  if (hasWord(sourceTaxonomy, ["men", "man", "male", "menswear"])) return "Men";
  return "Home & Living";
};

const loadListings = () => {
  if (!fs.existsSync(SOURCE_DIR)) throw new Error(`ABO metadata not found at ${SOURCE_DIR}`);
  const listings = [];
  for (const file of fs.readdirSync(SOURCE_DIR).filter((name) => name.endsWith(".json.gz"))) {
    const content = zlib.gunzipSync(fs.readFileSync(path.join(SOURCE_DIR, file))).toString("utf8");
    for (const line of content.split(/\r?\n/)) {
      if (!line.trim()) continue;
      try {
        const item = JSON.parse(line);
        if (item.item_id && item.main_image_id && firstValue(item.item_name)) listings.push(item);
      } catch {
        // Ignore malformed records from the public archive.
      }
    }
  }
  return listings;
};

const buildDocuments = (listings, categoryByName, existingIds, seller) => {
  const buckets = new Map(CATEGORY_NAMES.map((name) => [name, []]));
  const seen = new Set();
  for (const item of listings) {
    const categoryName = classify(item);
    if (!categoryByName.has(categoryName) || seen.has(item.item_id)) continue;
    seen.add(item.item_id);
    buckets.get(categoryName).push(item);
  }

  const minimumPerCategory = Math.floor(TARGET_TOTAL / CATEGORY_NAMES.length);
  console.log("Classification buckets", Object.fromEntries(CATEGORY_NAMES.map((name) => [name, buckets.get(name).length])));
  const selected = [];
  for (const categoryName of CATEGORY_NAMES) {
    const bucket = buckets.get(categoryName);
    const categoryMinimum = categoryName === "Gifts" ? 300 : minimumPerCategory;
    if (bucket.length < categoryMinimum) {
      throw new Error(`${categoryName} has only ${bucket.length} usable listings; cannot guarantee ${categoryMinimum}`);
    }
    selected.push(...bucket.slice(0, categoryMinimum));
  }

  const selectedIds = new Set(selected.map((item) => item.item_id));
  const remaining = listings.filter((item) => !selectedIds.has(item.item_id));
  for (const item of remaining) {
    if (selected.length >= TARGET_TOTAL) break;
    const categoryName = classify(item);
    if (categoryByName.has(categoryName)) selected.push(item);
  }
  if (selected.length < TARGET_TOTAL) throw new Error(`Only ${selected.length} products could be selected`);

  return selected.slice(0, TARGET_TOTAL).map((item, index) => {
    const categoryName = classify(item);
    const category = categoryByName.get(categoryName);
    const title = firstValue(item.item_name);
    const brand = firstValue(item.brand) || "SmartCart Select";
    const imageIds = [item.main_image_id, ...(item.other_image_id || [])].filter(Boolean).slice(0, 5);
    const images = imageIds.map((id, imageIndex) => ({
      public_id: `abo:${item.item_id}:${imageIndex}`,
      url: imageUrl(id),
    }));
    const price = 499 + ((index * 137) % 12000);
    const discountPercentage = index % 5 === 0 ? 10 : index % 3 === 0 ? 5 : 0;
    const finalPrice = Number((price - price * discountPercentage / 100).toFixed(2));
    const description = firstValue(item.product_description) || (item.bullet_point || []).map((point) => point.value).filter(Boolean).join(" ") || `${title} by ${brand}.`;
    return {
      _id: existingIds[index],
      name: title,
      slug: `${slugify(title).slice(0, 88)}-${String(existingIds[index]).slice(-12)}`,
      description,
      price,
      discountPercentage,
      finalPrice,
      stock: 25 + (index % 176),
      sold: 10 + ((TARGET_TOTAL - index) % 900),
      images,
      coverImage: images[0],
      brand,
      badges: index % 11 === 0 ? ["Bestseller"] : [],
      category: category._id,
      ratings: Number((3.8 + ((index * 7) % 12) / 10).toFixed(1)),
      reviews: 8 + ((index * 19) % 1400),
      tags: [IMPORT_TAG, categoryName.toLowerCase().replaceAll(" ", "-")],
      seller,
      isActive: true,
      isArchived: false,
      isDeleted: false,
      approvalStatus: "approved",
      featured: index % 13 === 0,
      createdAt: new Date(Date.now() - index * 3600000),
      updatedAt: new Date(),
    };
  });
};

const run = async () => {
  const listings = loadListings();
  console.log(`Loaded ABO listings: ${listings.length}`);
  await connectDB();
  const categories = await Category.find({ name: { $in: CATEGORY_NAMES }, level: 0, isActive: true, status: "approved" }).lean();
  const categoryByName = new Map(categories.map((category) => [category.name, category]));
  if (categoryByName.size !== CATEGORY_NAMES.length) throw new Error("One or more root categories are missing");

  const existingProducts = await Product.find({ tags: { $in: ["smartcart-seed-v1", "smartcart-real-catalog-v1", IMPORT_TAG] } }).select("_id seller").sort({ _id: 1 }).lean();
  if (existingProducts.length < TARGET_TOTAL) throw new Error(`Expected at least ${TARGET_TOTAL} catalog products, found ${existingProducts.length}`);
  const seller = existingProducts[0]?.seller;
  console.log(`Existing product IDs available: ${existingProducts.length}`);
  const documents = buildDocuments(listings, categoryByName, existingProducts.slice(0, TARGET_TOTAL).map((item) => item._id), seller);
  console.log(`Prepared corrected documents: ${documents.length}`);

  await Product.bulkWrite(
    documents.map((document) => ({
      replaceOne: {
        filter: { _id: document._id },
        replacement: document,
        upsert: false,
      },
    })),
    { ordered: false },
  );
  console.log("In-place catalog update complete");
  await Category.bulkWrite(CATEGORY_NAMES.map((name) => ({ updateOne: { filter: { _id: categoryByName.get(name)._id }, update: { $set: { productCount: documents.filter((item) => String(item.category) === String(categoryByName.get(name)._id)).length } } } })));
  console.log(`Imported ${documents.length} unique ABO products`);
  console.log(Object.fromEntries(CATEGORY_NAMES.map((name) => [name, documents.filter((item) => String(item.category) === String(categoryByName.get(name)._id)).length])));
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("ABO catalog import failed:", error.message);
  await mongoose.disconnect();
  process.exitCode = 1;
});
