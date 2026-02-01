/**
 * PAGINATE PRODUCTS
 * -----------------
 * Backend ready
 * Pure utility function
 */

const paginate = (items = [], currentPage = 1, perPage = 12) => {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / perPage);

  // safety
  const page = Math.min(Math.max(currentPage, 1), totalPages || 1);

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  return {
    items: items.slice(startIndex, endIndex),
    currentPage: page,
    totalPages,
    totalItems,
  };
};

export default paginate;