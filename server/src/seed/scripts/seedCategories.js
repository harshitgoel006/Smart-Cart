import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

import mongoose from "mongoose";

import connectDB from "../../db/index.js";
import { Category } from "../../models/category.model.js";
// ======================================
// CATEGORY FILES
// ======================================
const CATEGORY_FILES = [
  "men.categories.json",
  "women.categories.json",
  "kids.categories.json",
  "beauty.categories.json",
  "electronics.categories.json",
  "accessories.categories.json",
  "groceries.categories.json",
  "home-living.categories.json",
  "sports-gym.categories.json",
  "gifts.categories.json",
];

// ======================================
// CATEGORY PATH
// ======================================
const CATEGORY_PATH = path.join(
  process.cwd(),
  "src",
  "seed",
  "data",
  "categories",
);

// ======================================
// LOAD ALL CATEGORIES
// ======================================
const allCategories = [];

for (const file of CATEGORY_FILES) {
  const filePath = path.join(CATEGORY_PATH, file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠ Missing File: ${file}`);

    continue;
  }

  const categories = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  allCategories.push(...categories);
}

// ======================================
// SEED CATEGORIES
// ======================================
const seedCategories = async () => {
  try {
    // CONNECT DB
    await connectDB();

    console.log("\n🚀 Connected To MongoDB\n");

    // ==================================
    // REMOVE OLD CATEGORIES
    // ==================================
    await Category.deleteMany({});

    console.log("🗑 Old Categories Removed\n");

    // ==================================
    // CATEGORY MAP
    // ==================================
    const categoryMap = {};

    // ==================================
    // SORT BY LEVEL
    // ==================================
    const sortedCategories = allCategories.sort((a, b) => a.level - b.level);

    // ==================================
    // INSERT CATEGORIES
    // ==================================
    for (const category of sortedCategories) {
      let parent = null;

      // ================================
      // FIND PARENT
      // ================================
      if (category.parentSlug) {
        const parentCategory = categoryMap[category.parentSlug];

        if (parentCategory) {
          parent = parentCategory._id;
        }
      }

      // ================================
      // CREATE CATEGORY
      // ================================
      const createdCategory = await Category.create({
        ...category,

        parent,

        createdBy: "69d9438080a42e45a31e179c",

        updatedBy: "69d9438080a42e45a31e179c",
      });

      // ================================
      // STORE IN MAP
      // ================================
      categoryMap[category.slug] = createdCategory;

      console.log(`✅ Seeded: ${category.name}`);
    }

    // ==================================
    // EXPORT CATEGORY IDS
    // ==================================
    const categoryIdMap = {};

    for (const slug in categoryMap) {
      categoryIdMap[slug] = {
        id: categoryMap[slug]._id,
        name: categoryMap[slug].name,
      };
    }

    fs.writeFileSync(
      path.join(CATEGORY_PATH, "categoryIds.json"),

      JSON.stringify(categoryIdMap, null, 2),
    );

    console.log("\n🔥 Categories Seeded Successfully\n");

    console.log("📦 Category ID Map Exported\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Category Seeding Failed:\n", error);

    process.exit(1);
  }
};

seedCategories();
