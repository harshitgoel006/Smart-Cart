import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Store,
} from 'lucide-react'
import { CategoryShowcase } from '../../components/home/CategoryShowcase/CategoryShowcase'
import { HeroSection } from '../../components/home/HeroSection/HeroSection'
import { ProductSection } from '../../components/product/ProductCarousel/ProductCarousel'
import { getJson } from '../../services/apiClient'
import type { Banner, Category, Product } from '../../types'

const valueProps = [
  {
    label: 'Thoughtfully picked',
    description: 'Products worth keeping',
    icon: Sparkles,
  },
  {
    label: 'Secure checkout',
    description: 'Simple and protected',
    icon: ShieldCheck,
  },
  {
    label: 'Easy returns',
    description: 'Shop with confidence',
    icon: RotateCcw,
  },
  {
    label: 'Seller stories',
    description: 'Discover something new',
    icon: Store,
  },
]

export function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [topRated, setTopRated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    Promise.all([
      getJson<Banner[]>('/banners'),
      getJson<Category[]>('/categories/featured'),
      getJson<Product[]>('/products/new-arrivals?limit=8'),
      getJson<Product[]>('/products/top-rated?limit=8'),
    ])
      .then(([loadedBanners, loadedCategories, arrivals, rated]) => {
        setBanners(Array.isArray(loadedBanners) ? loadedBanners : [])
        setCategories(Array.isArray(loadedCategories) ? loadedCategories : [])
        setNewArrivals(Array.isArray(arrivals) ? arrivals : [])
        setTopRated(Array.isArray(rated) ? rated : [])
      })
      .catch((error: Error) => setApiError(error.message))
      .finally(() => setLoading(false))
  }, [])

  const visibleCategories = useMemo(
    () => categories.filter((category) => category.slug),
    [categories],
  )

  return (
    <main>
      <HeroSection banners={banners} />

      <section className="value-strip section" aria-label="SmartCart benefits">
        {valueProps.map(({ label, description, icon: Icon }) => (
          <div key={label}>
            <span className="value-icon" aria-hidden="true">
              <Icon size={18} />
            </span>
            <div>
              <strong>{label}</strong>
              <small>{description}</small>
            </div>
          </div>
        ))}
      </section>

      {apiError && (
        <div className="api-notice">
          Catalog connection is taking a moment. Refresh once the backend is awake.
        </div>
      )}

      <CategoryShowcase categories={visibleCategories} />

      <div id="new-arrivals">
        <ProductSection
          title="New arrivals"
          subtitle="Fresh pieces for the season ahead."
          products={newArrivals}
          loading={loading}
        />
      </div>

      <section className="editorial section" id="offers">
        <div className="editorial__copy">
          <span className="eyebrow">The smart edit</span>
          <h2>
            Small upgrades.
            <br />
            <em>Big difference.</em>
          </h2>
          <p>
            From everyday rituals to weekend plans, discover pieces designed to
            bring a little more ease and character to your day.
          </p>
          <Link className="primary-button" to="/products?discountPercentage=20">
            Shop the story
          </Link>
        </div>
        <div className="editorial__image">
          <img
            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85"
            alt="Curated beauty and lifestyle products"
            loading="lazy"
          />
          <span>01 / 03</span>
        </div>
      </section>

      <div id="top-rated">
        <ProductSection
          title="Loved by the community"
          subtitle="The pieces shoppers keep coming back for."
          products={topRated}
          loading={loading}
        />
      </div>
    </main>
  )
}
