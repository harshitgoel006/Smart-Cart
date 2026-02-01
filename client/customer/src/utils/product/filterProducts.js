// /**
//  * FILTER PRODUCTS
//  * ----------------
//  * Pure function
//  * No UI dependency
//  * Backend-ready
//  */

// const filterProducts = (products = [], filters = {}) => {
//   const {
//     category,
//     subCategory,
//     search,
//     minPrice,
//     maxPrice,
//     rating,
//   } = filters;

//   return products.filter((product) => {
//     /* -----------------------------
//         CATEGORY FILTER
//     ----------------------------- */
//     if (category && product.category !== category) {
//       return false;
//     }

//     /* -----------------------------
//         SUB CATEGORY FILTER
//     ----------------------------- */
//     if (subCategory && product.subCategory !== subCategory) {
//       return false;
//     }

//     /* -----------------------------
//         SEARCH FILTER
//         (name + brand + tags)
//     ----------------------------- */
//     if (search) {
//       const query = search.toLowerCase();

//       const nameMatch = product.name?.toLowerCase().includes(query);
//       const brandMatch = product.brand?.toLowerCase().includes(query);
//       const tagMatch = product.tags?.some((tag) =>
//         tag.toLowerCase().includes(query)
//       );

//       if (!nameMatch && !brandMatch && !tagMatch) {
//         return false;
//       }
//     }

//     /* -----------------------------
//         PRICE FILTER
//         (finalPrice preferred)
//     ----------------------------- */
//     const price = product.finalPrice ?? product.price;

//     if (minPrice != null && price < minPrice) {
//       return false;
//     }

//     if (maxPrice != null && price > maxPrice) {
//       return false;
//     }

//     /* -----------------------------
//         RATING FILTER
//     ----------------------------- */
//     if (rating != null && product.rating < rating) {
//       return false;
//     }

//     return true;
//   });
// };

// export default filterProducts;



const filterProducts = (products, filters) => {
  const {
    category,
    subCategory,
    search,
    minPrice,
    maxPrice,
    rating,
  } = filters;

  return products.filter((product) => {

    // CATEGORY
    if (
      category &&
      product.category?.toLowerCase() !== category.toLowerCase()
    ) {
      return false;
    }

    // SUB CATEGORY
    if (
      subCategory &&
      product.subCategory?.toLowerCase() !== subCategory.toLowerCase()
    ) {
      return false;
    }

    // SEARCH
    if (
      search &&
      !product.name.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    // PRICE
    if (minPrice && product.finalPrice < minPrice) return false;
    if (maxPrice && product.finalPrice > maxPrice) return false;

    // RATING
    if (rating && product.rating < rating) return false;

    return true;
  });
};

export default filterProducts;