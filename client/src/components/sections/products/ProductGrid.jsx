import ProductCard from "../../common/ProductCard";
import { productListingData } from "../../../content/products/productListingData";

const ProductGrid = () => {
  return (
    <section>
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {productListingData.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;