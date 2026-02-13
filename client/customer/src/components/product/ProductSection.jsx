import { Link } from "react-router-dom"
import ProductGrid from "./ProductGrid"

const ProductSection = ({ title, subtitle, products }) => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-black">{title}</h2>
            {subtitle && (
              <p className="text-gray-500 mt-2">{subtitle}</p>
            )}
          </div>

          <Link to="/products" className="text-purple-600 font-semibold">
            View All
          </Link>
        </div>

        <ProductGrid products={products} />
      </div>
    </section>
  )
}

export default ProductSection
