import ProductSection from "../product/ProductSection";

const CategoryNewArrivals = ({ products, limit = 8 }) => {
  const limitedProducts = products.slice(0, limit);

  return (
    <ProductSection
      title="New Arrivals"
      products={limitedProducts}
    />
  );
};

export default CategoryNewArrivals;
