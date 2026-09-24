import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Product } from '../../../types'
import { ProductCard } from '../ProductCard/ProductCard'

type ProductSectionProps = {
  title: string
  subtitle: string
  products: Product[]
  loading: boolean
  eyebrow?: string
  linkTo?: string
  linkText?: string
  variant?: 'default' | 'featured'
}

export function ProductSection({
  title,
  subtitle,
  products,
  loading,
  eyebrow = 'Curated for you',
  linkTo = '/products',
  linkText = 'View collection',
  variant = 'default',
}: ProductSectionProps) {
  return (
    <section className={`section product-section product-section--${variant}`}>
      {variant === 'featured' ? (
        <div className="category-showcase__intro">
          <div className="category-showcase__heading">
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <Link className="section-link" to={linkTo}>
            {linkText} <ArrowRight size={16} strokeWidth={1.8} />
          </Link>
        </div>
      ) : (
        <div className="section-heading">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <Link className="text-button" to={linkTo}>
            {linkText} <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}

      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="product-skeleton" key={index} />
          ))}
        </div>
      ) : products.length ? (
        <div className="product-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard product={product} key={product._id} />
          ))}
        </div>
      ) : (
        <div className="section-empty">
          Products will appear here once the catalog is available.
        </div>
      )}
    </section>
  )
}
