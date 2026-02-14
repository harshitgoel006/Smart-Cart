import { allProducts as products } from "../../assets";
import { getAllChildCategorySlugs } from "../categories/categoryService";

/* ===============================
   GET ALL PRODUCTS
================================ */

export const getAllProducts = async () => {
  return products;
};

/* ===============================
   FILTER BY CATEGORY
================================ */

export const getProductsByCategorySlug = async (slug) => {
  if (!slug) return [];

  const slugsToInclude = getAllChildCategorySlugs(slug);
   console.log("Slug:", slug);
console.log("Slugs Included:", slugsToInclude);

  return products.filter((product) => {
    if (!product?.category?.slug) return false;

    return slugsToInclude.includes(product.category.slug);
  });
};


/* ===============================
   TRENDING PRODUCTS
================================ */

export const getTrendingProductsByCategory = async (slug) => {
  const filtered = await getProductsByCategorySlug(slug);

  return filtered
    .map((product) => ({
      ...product,
      score:
        (product.ratings || 0) * 2 +
        (product.sold || 0) +
        (product.featured ? 20 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
};

/* ===============================
   NEW ARRIVALS
================================ */

export const getNewArrivalsByCategory = async (slug) => {
  const filtered = await getProductsByCategorySlug(slug);

  return [...filtered].sort(
    (a, b) =>
      new Date(b.createdAt || 0) -
      new Date(a.createdAt || 0)
  );
};

/* ===============================
   HOME TRENDING PRODUCTS
================================ */

export const getHomeTrendingProducts = async () => {
  return products
    .map((product) => ({
      ...product,
      score:
        (product.ratings || 0) * 2 +
        (product.sold || 0) +
        (product.featured ? 20 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
};



/* ===============================
   PROMO PRODUCTS
================================ */

export const getPromoProductsByCategory = async (
  slug,
  limit = 3
) => {
  const filtered = await getProductsByCategorySlug(slug);

  return filtered
    .filter(
      (product) =>
        product.discount > 0 &&
        product.isActive &&
        !product.isDeleted
    )
    .sort((a, b) => b.discount - a.discount)
    .slice(0, limit);
};

/* ===============================
   TOP BRANDS
================================ */

export const getTopBrandsByCategory = async (slug, limit = 4) => {
  const filtered = await getProductsByCategorySlug(slug);

  const brandMap = {};

  filtered.forEach((product) => {
    if (!brandMap[product.brand]) {
      brandMap[product.brand] = {
        name: product.brand,
        slug: product.brand.toLowerCase().replace(/\s+/g, "-"),
      };
    }
  });

  return Object.values(brandMap).slice(0, limit);
};
