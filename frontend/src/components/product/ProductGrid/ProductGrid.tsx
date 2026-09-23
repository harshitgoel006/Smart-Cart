import type { Product } from '../../../types'
import { ProductCard } from '../ProductCard/ProductCard'

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="product-grid">
      {products.map((product) => <ProductCard key={product._id} product={product} />)}
    </div>
  )
}
