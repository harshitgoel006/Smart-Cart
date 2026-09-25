import { useEffect, useMemo, useState } from 'react'
import { CategoryShowcase } from '../../components/home/CategoryShowcase/CategoryShowcase'
import { AiRecommendations } from '../../components/home/AiRecommendations/AiRecommendations'
import { BrandsShowcase } from '../../components/home/BrandsShowcase/BrandsShowcase'
import { EditorialFeature } from '../../components/home/EditorialFeature/EditorialFeature'
import { HeroSection } from '../../components/home/HeroSection/HeroSection'
import { OfferStrip } from '../../components/home/OfferStrip/OfferStrip'
import { Testimonials } from '../../components/home/Testimonials/Testimonials'
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

      <OfferStrip />

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
          subtitle="Popular picks, standout essentials, and everyday favourites shoppers are reaching for today."
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
          subtitle="Just in: thoughtful essentials and fresh favourites for the days ahead."
          products={newArrivals}
          loading={loading}
          linkTo="/products?sort=newest"
          linkText="View new arrivals"
          variant="featured"
        />
      </div>

      <div className="editorial-transition">
        <EditorialFeature />
      </div>

      <div id="top-rated">
        <ProductSection
          eyebrow="Top rated"
          title="Loved by the community"
          subtitle="Discover tried-and-loved essentials, rated highly by shoppers who know what works."
          products={topRated}
          loading={loading}
          linkTo="/products?sort=ratingHighToLow"
          linkText="View top rated"
          variant="featured"
        />
      </div>

      <BrandsShowcase />

      <Testimonials />
    </main>
  )
}
