import { useEffect, useMemo, useState } from 'react'
import './App.css'

type ImageRef = { url?: string }
type Product = { _id: string; name: string; brand?: string; finalPrice?: number | string | { $numberDecimal?: string }; price?: number | string | { $numberDecimal?: string }; discountPercentage?: number; ratings?: number; reviews?: number; images?: ImageRef[]; coverImage?: ImageRef }
type Category = { _id: string; name: string; slug: string; image?: ImageRef }
type Banner = { _id: string; title?: string; tagline?: string; image?: ImageRef }

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://smart-cart-v6yn.onrender.com/api/v1'
const fallbackHero = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=85'
const categoryImages: Record<string, string> = {
  men: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=85',
  women: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=85',
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=85',
  beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=85',
  'home-living': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=85',
  groceries: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=85',
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { credentials: 'include' })
  const body = await response.json()
  if (!response.ok || body.success === false) throw new Error(body.message || 'Unable to load SmartCart data')
  return (body.data ?? body) as T
}

function getNumber(value: Product['price']) {
  if (typeof value === 'object' && value !== null) return Number(value.$numberDecimal || 0)
  return Number(value || 0)
}

function formatPrice(value: Product['price']) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(getNumber(value))
}

function ProductCard({ product }: { product: Product }) {
  const image = product.coverImage?.url || product.images?.[0]?.url
  const originalPrice = getNumber(product.price)
  const finalPrice = getNumber(product.finalPrice || product.price)
  return <article className="product-card">
    <div className="product-card__image-wrap">
      {image ? <img src={image} alt={product.name} loading="lazy" /> : <div className="image-placeholder" />}
      <button className="icon-button product-card__wish" aria-label={`Add ${product.name} to wishlist`}>♡</button>
      {(product.discountPercentage || 0) > 0 && <span className="product-card__badge">-{product.discountPercentage}%</span>}
    </div>
    <div className="product-card__content">
      <span className="eyebrow">{product.brand || 'SmartCart select'}</span>
      <h3>{product.name}</h3>
      <div className="rating-row"><span>★ {Number(product.ratings || 0).toFixed(1)}</span><span className="muted">({product.reviews || 0})</span></div>
      <div className="price-row"><strong>{formatPrice(finalPrice)}</strong>{originalPrice > finalPrice && <del>{formatPrice(originalPrice)}</del>}</div>
    </div>
  </article>
}

function ProductSection({ title, subtitle, products, loading }: { title: string; subtitle: string; products: Product[]; loading: boolean }) {
  return <section className="section product-section">
    <div className="section-heading"><div><span className="eyebrow">Curated for you</span><h2>{title}</h2><p>{subtitle}</p></div><button className="text-button">View collection <span>↗</span></button></div>
    {loading ? <div className="product-grid">{Array.from({ length: 4 }).map((_, index) => <div className="product-skeleton" key={index} />)}</div> : products.length ? <div className="product-grid">{products.slice(0, 4).map((product) => <ProductCard product={product} key={product._id} />)}</div> : <div className="section-empty">Products will appear here once the catalog is available.</div>}
  </section>
}

function App() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [topRated, setTopRated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    Promise.all([getJson<Banner[]>('/banners'), getJson<Category[]>('/categories/featured'), getJson<Product[]>('/products/new-arrivals?limit=8'), getJson<Product[]>('/products/top-rated?limit=8')])
      .then(([bannerData, categoryData, newData, ratedData]) => { setBanners(Array.isArray(bannerData) ? bannerData : []); setCategories(Array.isArray(categoryData) ? categoryData : []); setNewArrivals(Array.isArray(newData) ? newData : []); setTopRated(Array.isArray(ratedData) ? ratedData : []) })
      .catch((error: Error) => setApiError(error.message))
      .finally(() => setLoading(false))
  }, [])

  const hero = banners[0]
  const heroImage = hero?.image?.url || fallbackHero
  const visibleCategories = useMemo(() => categories.filter((category) => category.slug), [categories])
  const fallbackCategories: Category[] = Object.keys(categoryImages).map((slug) => ({ _id: slug, slug, name: slug.replace('-', ' ') }))

  return <div className="app-shell">
    <div className="announcement">Complimentary delivery on orders over ₹999 <span>•</span> Curated shopping, made simple</div>
    <header className="site-header">
      <a className="brand" href="/" aria-label="SmartCart home"><span className="brand-mark">S</span><span>smart<span>cart</span></span></a>
      <nav className="desktop-nav" aria-label="Primary navigation"><a href="#collections">Collections</a><a href="#new-arrivals">New in</a><a href="#top-rated">Top rated</a><a href="#offers">Offers</a></nav>
      <div className="header-actions"><button className="header-search" aria-label="Search products"><span>⌕</span><span>Search products</span></button><button className="icon-button" aria-label="Account">♙</button><button className="icon-button" aria-label="Wishlist">♡</button><button className="cart-button" aria-label="Cart"><span>Bag</span><b>0</b></button></div>
    </header>
    <main>
      <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(12, 35, 28, .85), rgba(12, 35, 28, .3) 58%, rgba(12, 35, 28, .05)), url(${heroImage})` }}><div className="hero__content"><span className="eyebrow hero__eyebrow">The everyday edit</span><h1>{hero?.title || 'Find a little more of what feels like you.'}</h1><p>{hero?.tagline || 'Thoughtful essentials, considered prices, and a smarter way to shop.'}</p><div className="hero__actions"><button className="primary-button">Shop the edit <span>↗</span></button><button className="ghost-button">Explore categories</button></div></div><div className="hero__note"><span>01</span><span className="hero__line" /><span>SmartCart selection</span></div></section>
      <section className="value-strip section"><div><span className="value-icon">✦</span><div><strong>Thoughtfully picked</strong><small>Products worth keeping</small></div></div><div><span className="value-icon">⌁</span><div><strong>Secure checkout</strong><small>Simple and protected</small></div></div><div><span className="value-icon">↺</span><div><strong>Easy returns</strong><small>Shop with confidence</small></div></div><div><span className="value-icon">♧</span><div><strong>Seller stories</strong><small>Discover something new</small></div></div></section>
      {apiError && <div className="api-notice">Catalog connection is taking a moment. Refresh once the backend is awake.</div>}
      <section className="section" id="collections"><div className="section-heading"><div><span className="eyebrow">Browse by mood</span><h2>Make room for better finds.</h2></div><button className="text-button">All collections <span>↗</span></button></div><div className="category-grid">{(visibleCategories.length ? visibleCategories.slice(0, 6) : fallbackCategories).map((category, index) => <a className={`category-card category-card--${index % 3}`} href={`/categories/${category.slug}`} key={category._id}><img src={category.image?.url || categoryImages[category.slug]} alt="" loading="lazy" /><div><span>Explore</span><h3>{category.name}</h3></div><b>↗</b></a>)}</div></section>
      <div id="new-arrivals"><ProductSection title="New arrivals" subtitle="Fresh pieces for the season ahead." products={newArrivals} loading={loading} /></div>
      <section className="editorial section" id="offers"><div className="editorial__copy"><span className="eyebrow">The smart edit</span><h2>Small upgrades.<br /><em>Big difference.</em></h2><p>From everyday rituals to weekend plans, discover pieces designed to bring a little more ease and character to your day.</p><button className="primary-button">Shop the story <span>↗</span></button></div><div className="editorial__image"><img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85" alt="Curated beauty and lifestyle products" loading="lazy" /><span>01 / 03</span></div></section>
      <div id="top-rated"><ProductSection title="Loved by the community" subtitle="The pieces shoppers keep coming back for." products={topRated} loading={loading} /></div>
    </main>
    <footer className="site-footer"><div className="brand footer-brand"><span className="brand-mark">S</span><span>smart<span>cart</span></span></div><p>Curated everyday shopping, made a little smarter.</p><div className="footer-links"><a href="#collections">Collections</a><a href="#new-arrivals">New in</a><a href="#top-rated">Top rated</a><a href="mailto:hello@smartcart.local">Contact</a></div><small>© 2026 SmartCart. Made for better everyday choices.</small></footer>
  </div>
}

export default App
