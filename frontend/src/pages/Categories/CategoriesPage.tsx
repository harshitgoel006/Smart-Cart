import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, ChevronRight, Search, Sparkles } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getJson } from '../../services/apiClient'
import { CATEGORY_IMAGES } from '../../constants'
import { ProductCard } from '../../components/product/ProductCard/ProductCard'
import type { Category, Product, ProductList } from '../../types'

function flatten(categories: Category[]): Category[] {
  return categories.flatMap((category) => [category, ...flatten(category.children || [])])
}

function categoryImage(category: Category) {
  const fallbackBySlug: Record<string, string> = {
    topwear: CATEGORY_IMAGES.men,
    bottomwear: CATEGORY_IMAGES.sports,
    footwear: CATEGORY_IMAGES.women,
    'ethnic-wear': CATEGORY_IMAGES.gifts,
    'formal-wear': CATEGORY_IMAGES['home-living'],
    accessories: CATEGORY_IMAGES.electronics,
    mobiles: CATEGORY_IMAGES.electronics,
    audio: CATEGORY_IMAGES.electronics,
    kitchen: CATEGORY_IMAGES['home-living'],
    decor: CATEGORY_IMAGES.gifts,
    skincare: CATEGORY_IMAGES.beauty,
    groceries: CATEGORY_IMAGES.groceries,
  }

  return category.image?.url || category.bannerImage?.url || CATEGORY_IMAGES[category.slug] || fallbackBySlug[category.slug] || CATEGORY_IMAGES.electronics
}

export function CategoriesPage() {
  const { slug } = useParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getJson<Category[]>('/categories')
      .then(setCategories)
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false))
  }, [])

  const allCategories = useMemo(() => flatten(categories), [categories])
  const parents = categories.filter((category) => !category.parent)
  const selected = allCategories.find((category) => category.slug === slug) || parents[0]
  const children = selected?.children || []
  const visibleParents = parents.filter((category) => category.name.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    if (!selected?._id) return

    setProductsLoading(true)
    getJson<ProductList>(`/products?category=${selected._id}&limit=4&sort=bestSelling`)
      .then((data) => setFeaturedProducts(data.products || []))
      .catch(() => setFeaturedProducts([]))
      .finally(() => setProductsLoading(false))
  }, [selected?._id])

  if (loading) return <main className="categories-page section"><div className="categories-loading">Loading categories...</div></main>

  return (
    <main className="categories-page section">
      <section className="categories-hero">
        <div className="categories-hero__copy">
          <span className="eyebrow"><Sparkles size={14} /> SmartCart directory</span>
          <h1>Find your next everyday favourite.</h1>
          <p>Explore curated categories, discover useful essentials and browse at your own pace.</p>
          <Link className="primary-button" to="/products">Browse all products <ArrowUpRight size={16} /></Link>
        </div>
        <div className="categories-hero__visual">
          <img src={CATEGORY_IMAGES['home-living']} alt="Warmly curated SmartCart essentials" />
          <span className="categories-hero__visual-shade" />
          <div className="categories-hero__visual-copy"><span>Thoughtfully curated</span><strong>Everyday<br />essentials</strong><small>Made to fit your way of living</small></div>
        </div>
      </section>

      {error ? <div className="api-notice">{error}</div> : null}

      <section className="categories-explorer" aria-label="Category explorer">
        <aside className="categories-sidebar">
          <div className="categories-sidebar__head">
            <span className="eyebrow">Explore</span>
            <h2>Categories</h2>
          </div>
          <label className="categories-search">
            <Search size={15} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a category" aria-label="Find a category" />
          </label>
          <nav>
            {visibleParents.map((category) => (
              <Link className={selected?._id === category._id ? 'is-active' : ''} to={`/categories/${category.slug}`} key={category._id}>
                <span>{category.name}</span><ChevronRight size={15} />
              </Link>
            ))}
          </nav>
        </aside>

        <div className="categories-content">
          {selected ? (
            <>
              <div className="categories-content__heading">
                <div>
                  <span className="eyebrow">{selected.parent ? 'Explore collection' : 'Shop by department'}</span>
                  <h2>{selected.name}</h2>
                  <p>{selected.description || selected.tagline || `A considered edit of ${selected.name.toLowerCase()} for everyday living, gifting and the moments in between.`}</p>
                </div>
                <Link className="categories-content__browse" to={`/products?category=${selected._id}`}>Browse the edit <ArrowUpRight size={15} /></Link>
              </div>

              {children.length ? (
                <>
                  <div className="categories-section-intro">
                    <div>
                      <span className="eyebrow">Ways to shop</span>
                      <h3>Find your kind of everyday</h3>
                    </div>
                    <p>Start with a mood, a need or a style direction. We’ll take you to the right collection.</p>
                  </div>
                  <div className="subcategory-grid">
                    {children.map((child) => (
                      <Link className="subcategory-card" to={`/categories/${child.slug}`} key={child._id}>
                        <img src={categoryImage(child)} alt="" loading="lazy" />
                        <span className="subcategory-card__shade" />
                        <span className="subcategory-card__copy">
                          <small>{child.tagline || child.description || 'Explore the collection'}</small>
                          <strong>{child.name}</strong>
                          <ArrowUpRight size={17} />
                        </span>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div className="categories-leaf-state">
                  <span className="eyebrow">Ready to browse</span>
                  <h3>Explore {selected.name}</h3>
                  <p>See all available products in this category with filters, sorting and AI shopping help.</p>
                  <Link className="primary-button" to={`/products?category=${selected._id}`}>View products <ArrowUpRight size={16} /></Link>
                </div>
              )}

              <section className="categories-edit" aria-label={`${selected.name} product edit`}>
                <div className="categories-section-intro categories-section-intro--edit">
                  <div>
                    <span className="eyebrow"><Sparkles size={14} /> Curated for you</span>
                    <h3>Shop the {selected.name.toLowerCase()} edit</h3>
                  </div>
                  <Link className="categories-content__browse" to={`/products?category=${selected._id}`}>See everything <ArrowUpRight size={15} /></Link>
                </div>
                {productsLoading ? (
                  <div className="categories-products-loading">Finding a few good picks...</div>
                ) : featuredProducts.length ? (
                  <div className="product-grid categories-product-grid">
                    {featuredProducts.map((product) => <ProductCard product={product} key={product._id} />)}
                  </div>
                ) : (
                  <div className="categories-edit__empty">This edit is being refreshed. Browse the full department to see what’s available.</div>
                )}
              </section>
            </>
          ) : <div className="categories-leaf-state"><h3>No categories found.</h3></div>}
        </div>
      </section>
    </main>
  )
}
