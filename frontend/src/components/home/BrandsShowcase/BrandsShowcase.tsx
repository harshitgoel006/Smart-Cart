import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const brands = [
  { name: 'Nike', logo: 'https://cdn.simpleicons.org/nike/2d2118', note: 'Move freely' },
  { name: 'Sony', logo: 'https://cdn.simpleicons.org/sony/2d2118', note: 'Made for sound' },
  { name: 'Lakmé', logo: 'https://cdn.simpleicons.org/lakme/2d2118', note: 'Beauty, everyday' },
  { name: 'IKEA', logo: 'https://cdn.simpleicons.org/ikea/2d2118', note: 'The home edit' },
  { name: 'boAt', logo: 'https://cdn.simpleicons.org/boat/2d2118', note: 'In your element' },
  { name: 'Titan', logo: 'https://cdn.simpleicons.org/titan/2d2118', note: 'Timeless details' },
  { name: 'Adidas', logo: 'https://cdn.simpleicons.org/adidas/2d2118', note: 'Impossible is nothing' },
  { name: 'Mamaearth', logo: 'https://cdn.simpleicons.org/mamaearth/2d2118', note: 'Goodness inside' },
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
          <Link className="brand-tile" to={`/products?brand=${encodeURIComponent(brand.name)}`} key={brand.name} aria-label={`Shop ${brand.name}`}>
            <span className="brand-tile__logo-wrap">
              <img
                className="brand-tile__logo"
                src={brand.logo}
                alt={`${brand.name} logo`}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                  const fallback = event.currentTarget.nextElementSibling
                  if (fallback instanceof HTMLElement) fallback.style.display = 'block'
                }}
              />
              <strong className="brand-tile__fallback">{brand.name}</strong>
            </span>
            <span>{brand.note}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
