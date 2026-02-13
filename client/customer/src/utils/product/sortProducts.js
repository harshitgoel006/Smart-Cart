/**
 * SORT PRODUCTS
 * -------------
 * Pure function
 * Backend ready
 * No UI dependency
 */

export const sortProducts = (products = [], sortBy = "latest") => {
  const sorted = [...products];

  switch (sortBy) {
    case "price-low":
      return sorted.sort(
        (a, b) =>
          (a.finalPrice ?? a.price) - (b.finalPrice ?? b.price)
      );

    case "price-high":
      return sorted.sort(
        (a, b) =>
          (b.finalPrice ?? b.price) - (a.finalPrice ?? a.price)
      );

    case "rating":
  return sorted.sort(
    (a, b) => (b.ratings || 0) - (a.ratings || 0)
  );


    case "popular":
      return sorted.sort(
        (a, b) => (b.sold || 0) - (a.sold || 0)
      );

    case "latest":
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
  }
};
