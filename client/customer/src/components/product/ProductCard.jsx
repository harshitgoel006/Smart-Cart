import { FiStar, FiShoppingCart } from "react-icons/fi"
import { Link } from "react-router-dom"

const ProductCard = ({ product }) => {
  const discountPercentage = product.discount

  return (
    <div className="group bg-white rounded-2xl border p-3 hover:shadow-xl transition">
      
      <Link to={`/product/${product.slug}`}>
      <div className="w-full h-64 overflow-hidden rounded-xl">
  <img
  src={product.images?.[0]?.url}
  alt={product.name}
  className="w-full h-full object-cover"
/>

</div>

      </Link>

      <div className="mt-4">
        <Link
          to={`/product/${product.slug}`}
          className="font-semibold text-gray-900 hover:text-purple-600"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-1 mt-2">
          <FiStar className="text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-medium">
            {product.ratings}
          </span>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold">
            ₹{product.finalPrice.toLocaleString()}
          </span>

          {product.discount > 0 && (
            <>
              <span className="line-through text-gray-400 text-sm">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-pink-600 text-sm font-bold">
                {discountPercentage}% OFF
              </span>
            </>
          )}
        </div>

        <button className="mt-4 w-full bg-gray-900 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-600 transition">
          <FiShoppingCart />
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard
