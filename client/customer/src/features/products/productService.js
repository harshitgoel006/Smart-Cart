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
  const slugsToInclude = getAllChildCategorySlugs(slug);

  return products.filter((product) =>
    slugsToInclude.includes(product.category?.slug)
  );
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