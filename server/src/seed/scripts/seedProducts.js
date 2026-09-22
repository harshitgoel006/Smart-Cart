import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../../db/index.js";
import { Category } from "../../models/category.model.js";
import { Product } from "../../models/product.model.js";
import { User } from "../../models/user.model.js";

const SEED_TAG = "smartcart-seed-v1";
const DEFAULT_PRODUCT_COUNT = 5000;
const BATCH_SIZE = 250;

const IMAGE_POOLS = {
  Men: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3",
  ],
  Women: [
    "https://images.unsplash.com/photo-1483985988355-763728e1935b",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
  ],
  Kids: [
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea",
    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4",
  ],
  Beauty: [
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  ],
  Electronics: [
    "https://images.unsplash.com/photo-1498049794561-7780e7231661",
    "https://images.unsplash.com/photo-1468495244123-6c6c332eeece",
  ],
  Accessories: [
    "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561",
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49",
  ],
  Groceries: [
    "https://images.unsplash.com/photo-1542838132-92c53300491e",
    "https://images.unsplash.com/photo-1601598851547-4302969d7d2b",
  ],
  "Home & Living": [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6",
  ],
  "Sports & Gym": [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
  ],
  Gifts: [
    "https://images.unsplash.com/photo-1513883049090-d0b7439799bf",
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48",
  ],
};

const CATEGORY_CONFIG = {
  Men: {
    brands: ["Roadster", "Levis", "Allen Solly", "Jack & Jones", "U.S. Polo Assn."],
    words: ["Classic", "Everyday", "Premium", "Urban", "Essential"],
    min: 499,
    max: 4999,
  },
  Women: {
    brands: ["Libas", "W", "Biba", "Sassafras", "Aurelia"],
    words: ["Elegant", "Classic", "Printed", "Modern", "Comfort"],
    min: 399,
    max: 5999,
  },
  Kids: {
    brands: ["Mothercare", "Hopscotch", "Peppermint", "Allen Solly Junior"],
    words: ["Playful", "Soft", "Everyday", "Smart", "Happy"],
    min: 299,
    max: 2499,
  },
  Beauty: {
    brands: ["Lakme", "Maybelline", "Mamaearth", "Minimalist", "Plum"],
    words: ["Hydrating", "Radiant", "Gentle", "Daily", "Glow"],
    min: 199,
    max: 2499,
  },
  Electronics: {
    brands: ["boAt", "Noise", "JBL", "Portronics", "Philips", "Sony"],
    words: ["Smart", "Wireless", "Pro", "Compact", "Advanced"],
    min: 699,
    max: 24999,
  },
  Accessories: {
    brands: ["Fastrack", "Titan", "Lavie", "Mochi", "Van Heusen"],
    words: ["Classic", "Minimal", "Premium", "Travel", "Signature"],
    min: 299,
    max: 6999,
  },
  Groceries: {
    brands: ["Tata", "Aashirvaad", "Fortune", "Dove", "Surf Excel"],
    words: ["Fresh", "Daily", "Natural", "Family", "Essential"],
    min: 49,
    max: 1999,
  },
  "Home & Living": {
    brands: ["Home Centre", "Wakefit", "Story@Home", "IKEA", "Solimo"],
    words: ["Modern", "Cozy", "Elegant", "Classic", "Smart"],
    min: 299,
    max: 14999,
  },
  "Sports & Gym": {
    brands: ["Decathlon", "Nike", "Adidas", "Nivia", "Strauss"],
    words: ["Active", "Performance", "Training", "Pro", "Flex"],
    min: 299,
    max: 9999,
  },
  Gifts: {
    brands: ["Archies", "Ferns N Petals", "Chumbak", "The Man Company"],
    words: ["Special", "Celebration", "Premium", "Thoughtful", "Classic"],
    min: 199,
    max: 4999,
  },
};

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const numberInRange = (min, max, seed) => {
  const value = min + ((seed * 7919) % (max - min + 1));
  return Math.round(value / 10) * 10;
};

const getRootCategory = (category, categoryMap) => {
  let current = category;
  const visited = new Set();

  while (current.parent && !visited.has(String(current._id))) {
    visited.add(String(current._id));
    current = categoryMap.get(String(current.parent)) || current;
  }

  return current;
};

const getImage = (rootName, index) => {
  const pool = IMAGE_POOLS[rootName] || IMAGE_POOLS.Electronics;
  return `${pool[index % pool.length]}?auto=format&fit=crop&w=900&q=80`;
};

const createProduct = ({ root, subCategory, index, globalIndex }) => {
  const rootName = root.name;
  const config = CATEGORY_CONFIG[rootName] || CATEGORY_CONFIG.Electronics;
  const brand = config.brands[globalIndex % config.brands.length];
  const word = config.words[globalIndex % config.words.length];
  const subName = subCategory?.name || rootName;
  const name = `${brand} ${word} ${subName} ${index + 1}`;
  const price = numberInRange(config.min, config.max, globalIndex + 1);
  const discountPercentage = [0, 10, 15, 20, 25, 30][globalIndex % 6];
  const finalPrice = Number(
    (price - (price * discountPercentage) / 100).toFixed(2),
  );
  const stock = 5 + ((globalIndex * 17) % 196);
  const imageUrl = getImage(rootName, globalIndex);
  const slug = `${slugify(name)}-${globalIndex + 1}`;
  const createdAt = new Date(Date.now() - (globalIndex % 365) * 86400000);
  const seedTag = `${SEED_TAG}:${globalIndex + 1}`;

  return {
    name,
    slug,
    description: `${word} ${subName} from ${brand}, designed for everyday use with dependable quality and a comfortable finish.`,
    price,
    discountPercentage,
    finalPrice,
    stock,
    sold: globalIndex % 37,
    images: [{ public_id: seedTag, url: imageUrl }],
    coverImage: { public_id: seedTag, url: imageUrl },
    brand,
    badges: globalIndex % 9 === 0 ? ["Bestseller"] : [],
    category: root._id,
    subCategory: subCategory?._id,
    ratings: Number((3.5 + ((globalIndex * 13) % 15) / 10).toFixed(1)),
    reviews: globalIndex % 240,
    tags: [slugify(rootName), slugify(subName), "smartcart-seeded"],
    seller: null,
    isActive: true,
    isArchived: false,
    isDeleted: false,
    approvalStatus: "approved",
    featured: globalIndex % 20 === 0,
    createdAt,
    updatedAt: createdAt,
  };
};

const getOrCreateSeller = async () => {
  const email = process.env.SEED_SELLER_EMAIL || "seed.seller@smartcart.local";
  let seller = await User.findOne({ email, role: "seller" });

  if (!seller) {
    seller = await User.create({
      email,
      username: process.env.SEED_SELLER_USERNAME || "smartcart_seed_seller",
      fullname: process.env.SEED_SELLER_NAME || "SmartCart Demo Seller",
      password: process.env.SEED_SELLER_PASSWORD || "SmartCartSeed@123",
      role: "seller",
      phone: process.env.SEED_SELLER_PHONE || "9876543210",
      avatar: "https://ui-avatars.com/api/?name=SmartCart+Seller",
      isEmailVerified: true,
      sellerProfile: {
        shopName: "SmartCart Demo Store",
        isSellerApproved: true,
        isSellerProfileComplete: true,
      },
    });
  }

  return seller;
};

const seedProducts = async () => {
  const requestedCount = Number(process.env.SEED_PRODUCT_COUNT || DEFAULT_PRODUCT_COUNT);
  const reset = process.argv.includes("--reset");

  if (!Number.isInteger(requestedCount) || requestedCount < 1) {
    throw new Error("SEED_PRODUCT_COUNT must be a positive integer");
  }

  await connectDB();

  const existingSeededCount = await Product.countDocuments({
    tags: SEED_TAG,
  });

  if (existingSeededCount > 0 && !reset) {
    throw new Error(
      `Found ${existingSeededCount} seeded products. Re-run with --reset to replace them.`,
    );
  }

  if (reset) {
    const deleted = await Product.deleteMany({ tags: SEED_TAG });
    console.log(`Removed ${deleted.deletedCount} existing SmartCart seed products.`);
  }

  const categories = await Category.find({
    isActive: true,
    isDeleted: false,
    status: "approved",
  }).lean();

  if (categories.length === 0) {
    throw new Error("No approved categories found. Run the category seed first.");
  }

  const categoryMap = new Map(categories.map((category) => [String(category._id), category]));
  const roots = categories.filter((category) => category.level === 0);

  if (roots.length === 0) {
    throw new Error("No root categories found. Run the category seed first.");
  }

  const categoryGroups = roots.map((root) => ({
    root,
    children: categories.filter(
      (category) => getRootCategory(category, categoryMap)._id.toString() === root._id.toString(),
    ),
  }));

  const seller = await getOrCreateSeller();
  const documents = [];

  for (let index = 0; index < requestedCount; index += 1) {
    const group = categoryGroups[index % categoryGroups.length];
    const children = group.children.filter((category) => category.level > 0);
    const subCategory = children.length > 0 ? children[index % children.length] : group.root;
    const product = createProduct({
      root: group.root,
      subCategory,
      index: Math.floor(index / categoryGroups.length),
      globalIndex: index,
    });

    product.seller = seller._id;
    product.tags.push(SEED_TAG);
    documents.push(product);
  }

  for (let index = 0; index < documents.length; index += BATCH_SIZE) {
    const batch = documents.slice(index, index + BATCH_SIZE);
    await Product.insertMany(batch, { ordered: true });
    console.log(`Inserted ${Math.min(index + BATCH_SIZE, documents.length)}/${documents.length} products.`);
  }

  console.log(`Seeded ${documents.length} products across ${roots.length} root categories.`);
  console.log(`Seed seller email: ${seller.email}`);

  await mongoose.disconnect();
};

seedProducts()
  .catch(async (error) => {
    console.error("Product seeding failed:", error.message);
    await mongoose.disconnect();
    process.exitCode = 1;
  });
