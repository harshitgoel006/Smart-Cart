import ProductCard from "./ProductCard"
const ProductGrid = ({ products = [] }) => {
  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
