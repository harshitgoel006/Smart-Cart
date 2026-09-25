import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const brands = [
  { name: 'Nike', note: 'Move freely' },
  { name: 'Sony', note: 'Made for sound' },
  { name: 'Lakmé', note: 'Beauty, everyday' },
  { name: 'IKEA', note: 'The home edit' },
  { name: 'boAt', note: 'In your element' },
  { name: 'Titan', note: 'Timeless details' },
  { name: 'Adidas', note: 'Impossible is nothing' },
  { name: 'Mamaearth', note: 'Goodness inside' },
]

export function BrandsShowcase() {
  return (
    <section className="brands-showcase section" aria-labelledby="brands-heading">
      <div className="brands-showcase__header">
        <div>
          <span className="eyebrow">Brands worth knowing</span>
          <h2 id="brands-heading">Good things, from names you trust.</h2>
          <p>Explore familiar favourites and discover your next everyday essential.</p>
        </div>
        <Link className="section-link" to="/products">
          Explore brands <ArrowRight size={16} strokeWidth={1.8} />
        </Link>
      </div>

      <div className="brands-showcase__rail">
        {brands.map((brand) => (
          <Link className="brand-tile" to={`/products?brand=${encodeURIComponent(brand.name)}`} key={brand.name}>
            <strong>{brand.name}</strong>
            <span>{brand.note}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
