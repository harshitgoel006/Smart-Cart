import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, RefreshCw, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../app/providers/AuthProvider'
import { aiApi } from '../../../services/ai.api'
import type { AiProductSuggestion, Product } from '../../../types'
import { ProductCard } from '../../product/ProductCard/ProductCard'

type RecommendationFilter = 'for-you' | 'popular' | 'value'

type AiRecommendationsProps = {
  fallbackProducts: Product[]
}

const filters: Array<{ id: RecommendationFilter; label: string }> = [
  { id: 'for-you', label: 'For you' },
  { id: 'popular', label: 'Popular now' },
  { id: 'value', label: 'Best value' },
]

function toProduct(suggestion: AiProductSuggestion): Product {
  return {
    _id: suggestion.id,
    name: suggestion.name,
    brand: suggestion.brand,
    finalPrice: suggestion.price,
    price: suggestion.originalPrice,
    discountPercentage: suggestion.discountPercentage,
    ratings: suggestion.rating,
    stock: suggestion.stock,
    images: suggestion.image ? [{ url: suggestion.image }] : [],
  }
}

export function AiRecommendations({ fallbackProducts }: AiRecommendationsProps) {
  const { user } = useAuth()
  const [suggestions, setSuggestions] = useState<AiProductSuggestion[]>([])
  const [activeFilter, setActiveFilter] = useState<RecommendationFilter>('for-you')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [message, setMessage] = useState('')

  const loadRecommendations = async (isRefresh = false) => {
    setMessage('')
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const result = user
        ? await aiApi.personalizedRecommendations(8)
        : await aiApi.recommendations([], 8)
      setSuggestions(Array.isArray(result) ? result : [])
    } catch {
      setSuggestions([])
      setMessage('Showing popular picks while we refresh your recommendations.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    void loadRecommendations()
  }, [user])

  const visibleProducts = useMemo(() => {
    const aiProducts = suggestions.map(toProduct)
    const baseProducts = aiProducts.length ? aiProducts : fallbackProducts

    if (activeFilter === 'popular') {
      return fallbackProducts.length ? fallbackProducts.slice(0, 4) : baseProducts.slice(0, 4)
    }

    if (activeFilter === 'value') {
      return [...baseProducts]
        .sort((left, right) => (right.discountPercentage || 0) - (left.discountPercentage || 0))
        .slice(0, 4)
    }

    return baseProducts.slice(0, 4)
  }, [activeFilter, fallbackProducts, suggestions])

  return (
    <section className="section product-section product-section--featured ai-recommendation-section" id="ai-recommendations">
      <div className="category-showcase__intro">
        <div className="category-showcase__heading">
          <span className="eyebrow"><Sparkles size={13} strokeWidth={2} /> Smart picks</span>
          <h2>Picked for you.</h2>
          <p>{user ? 'Recommendations shaped by your shopping journey, preferences, and the things you keep coming back to.' : 'A smarter edit of products worth discovering, chosen around the way you shop.'}</p>
        </div>
        <Link className="section-link" to="/products">
          Explore all <ArrowRight size={16} strokeWidth={1.8} />
        </Link>
      </div>

      <div className="ai-recommendation-section__toolbar">
        <div className="ai-recommendation-section__filters" role="tablist" aria-label="Recommendation filters">
          {filters.map((filter) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === filter.id}
              className={activeFilter === filter.id ? 'is-active' : ''}
              onClick={() => setActiveFilter(filter.id)}
              key={filter.id}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <button className="ai-recommendation-section__refresh" type="button" onClick={() => void loadRecommendations(true)} disabled={refreshing}>
          <RefreshCw size={14} className={refreshing ? 'is-spinning' : ''} />
          {refreshing ? 'Refreshing' : 'Refresh picks'}
        </button>
      </div>

      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 4 }).map((_, index) => <div className="product-skeleton" key={index} />)}
        </div>
      ) : visibleProducts.length ? (
        <div className="product-grid">
          {visibleProducts.map((product) => <ProductCard product={product} key={product._id} />)}
        </div>
      ) : (
        <div className="section-empty">Your recommendations will appear here as you explore SmartCart.</div>
      )}

      {message && <p className="ai-recommendation-section__message">{message}</p>}
    </section>
  )
}
