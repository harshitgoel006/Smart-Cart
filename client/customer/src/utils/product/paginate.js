export const paginate = (items = [], currentPage = 1, perPage = 12) => {
  const total = items.length;
  const totalPages = Math.ceil(total / perPage);

  const page = Math.min(Math.max(currentPage, 1), totalPages || 1);

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  return {
    items: items.slice(startIndex, endIndex),
    page,
    totalPages,
    total,
  };
};
