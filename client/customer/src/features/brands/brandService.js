import { brands } from "../../data/brands";

/* ===============================
   GET ALL BRANDS
================================ */

export const getAllBrands = async () => {
  return brands;
};

/* ===============================
   FEATURED BRANDS
================================ */

export const getFeaturedBrands = async () => {
  const featured = brands.filter((brand) => brand.isFeatured);
  const others = brands.filter((brand) => !brand.isFeatured);

  return [...featured, ...others];
};
