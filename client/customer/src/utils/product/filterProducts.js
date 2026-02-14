import { getAllChildCategorySlugs } from "../../features/categories/categoryService";

export const filterProducts = (products, filters = {}) => {
  const { search = "", category = "" } = filters;

  let filtered = [...products];

  // 🔍 SEARCH FILTER
  if (search) {
    filtered = filtered.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // 🗂 CATEGORY FILTER (🔥 FIXED LOGIC)
  if (category) {
    const slugsToInclude = getAllChildCategorySlugs(category);

    filtered = filtered.filter((product) =>
      slugsToInclude.includes(product.category?.slug)
    );
  }

  return filtered;
};
