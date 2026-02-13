import { getAllProducts } from "../../features/products/productService";
import { filterProducts } from "../../utils/product/filterProducts";
import { sortProducts } from "../../utils/product/sortProducts";
import { paginate } from "../../utils/product/paginate";

export const getFilteredProducts = async (query = {}) => {
  const {
    page = 1,
    limit = 12,
    search = "",
    category = "",
    sort = "latest"
  } = query;

  // 🔥 get all generated products
  const allProducts = await getAllProducts();

  // 🔥 filter
  const filtered = filterProducts(allProducts, {
    search,
    category
  });

  // 🔥 sort
  const sorted = sortProducts(filtered, sort);

  // 🔥 paginate
  const paginated = paginate(sorted, Number(page), Number(limit));

  return {
    items: paginated.items,
    page: paginated.page,
    totalPages: paginated.totalPages,
    total: paginated.total
  };
};
