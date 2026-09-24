import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CategoryShowcase } from '../../components/home/CategoryShowcase/CategoryShowcase'
import { AiRecommendations } from '../../components/home/AiRecommendations/AiRecommendations'
import { HeroSection } from '../../components/home/HeroSection/HeroSection'
import { ProductSection } from '../../components/product/ProductCarousel/ProductCarousel'
import { getJson } from '../../services/apiClient'
import type { Banner, Category, Product } from '../../types'

export function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [trending, setTrending] = useState<Product[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [topRated, setTopRated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    Promise.all([
      getJson<Banner[]>('/banners'),
      getJson<Category[]>('/categories'),
      getJson<Product[]>('/products/trending?limit=8'),
      getJson<Product[]>('/products/new-arrivals?limit=8'),
      getJson<Product[]>('/products/top-rated?limit=8'),
    ])
      .then(([loadedBanners, loadedCategories, trendingProducts, arrivals, rated]) => {
        setBanners(Array.isArray(loadedBanners) ? loadedBanners : [])
        setCategories(Array.isArray(loadedCategories) ? loadedCategories : [])
        setTrending(Array.isArray(trendingProducts) ? trendingProducts : [])
        setNewArrivals(Array.isArray(arrivals) ? arrivals : [])
        setTopRated(Array.isArray(rated) ? rated : [])
      })
      .catch((error: Error) => setApiError(error.message))
      .finally(() => setLoading(false))
  }, [])

  const visibleCategories = useMemo(() => {
    const priority = new Map([
      ['men', 1],
      ['women', 2],
      ['electronics', 3],
      ['home-and-living', 4],
      ['beauty-and-grooming', 5],
      ['groceries', 6],
      ['sports-and-gym', 7],
      ['gifts', 8],
    ])

    return categories
      .filter((category) => category.slug && !category.parent && (category.productCount == null || category.productCount > 0))
      .sort((left, right) => {
        const countDifference = (right.productCount || 0) - (left.productCount || 0)
        return countDifference || (priority.get(left.slug) || 99) - (priority.get(right.slug) || 99)
      })
      .slice(0, 8)
  }, [categories])

  return (
    <main>
      <HeroSection banners={banners} />

      {apiError && (
        <div className="api-notice">
          Catalog connection is taking a moment. Refresh once the backend is awake.
        </div>
      )}

      <CategoryShowcase categories={visibleCategories} />

      <div id="trending-products">
        <ProductSection
          eyebrow="Trending now"
          title="What’s moving fast."
          subtitle="Popular picks shoppers are reaching for today."
          products={trending}
          loading={loading}
          linkTo="/products?sort=bestSelling"
          linkText="Shop trending"
          variant="featured"
        />
      </div>

      <AiRecommendations fallbackProducts={trending} />

      <div id="new-arrivals">
        <ProductSection
          eyebrow="Freshly picked"
          title="New arrivals"
          subtitle="Fresh pieces for the season ahead."
          products={newArrivals}
          loading={loading}
          linkTo="/products?sort=newest"
          linkText="View new arrivals"
          variant="featured"
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
          eyebrow="Top rated"
          title="Loved by the community"
          subtitle="The pieces shoppers keep coming back for."
          products={topRated}
          loading={loading}
        />
      </div>
    </main>
  )
}
