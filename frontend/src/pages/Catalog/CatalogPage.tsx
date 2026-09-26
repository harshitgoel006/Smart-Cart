import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Filter, Sparkles, SlidersHorizontal, X } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { ProductList } from '../../types'
import { getJson } from '../../services/apiClient'
import { ProductCard } from '../../components/product/ProductCard/ProductCard'

const brands = ['Nike', 'Sony', 'Adidas', 'boAt', 'Titan', 'IKEA', 'Lakmé', 'Mamaearth']
const categoryChips = [
  ['men', 'Men'], ['women', 'Women'], ['electronics', 'Electronics'], ['home-living', 'Home & Living'],
  ['beauty', 'Beauty'], ['groceries', 'Groceries'], ['sports-gym', 'Sports & Gym'], ['gifts', 'Gifts'],
] as const
const sortOptions: Array<[string, string]> = [
  ['newest', 'Newest first'],
  ['priceLowToHigh', 'Price: low to high'],
  ['priceHighToLow', 'Price: high to low'],
  ['ratingHighToLow', 'Top rated'],
  ['bestSelling', 'Best selling'],
  ['discountHighToLow', 'Biggest discount'],
]

const copyBySlug: Record<string, { title: string; tagline: string }> = {
  men: { title: 'Men', tagline: 'Sharp everyday pieces, built for your pace.' },
  women: { title: 'Women', tagline: 'Thoughtful styles for every version of you.' },
  electronics: { title: 'Electronics', tagline: 'Useful tech and clever upgrades for modern living.' },
  'home-living': { title: 'Home & Living', tagline: 'Make space for comfort, calm and good design.' },
  beauty: { title: 'Beauty', tagline: 'Everyday rituals and little luxuries worth keeping.' },
  groceries: { title: 'Groceries', tagline: 'Fresh, practical essentials for everyday life.' },
  'sports-gym': { title: 'Sports & Gym', tagline: 'Gear up, move better and keep going.' },
  gifts: { title: 'Gifts', tagline: 'Find something thoughtful for every kind of moment.' },
}

type FilterState = { minPrice: string; maxPrice: string; rating: string; discount: string; brand: string; tags: string; inStock: boolean }
type CategoryNode = { _id: string; name: string; slug: string; children?: CategoryNode[] }
const emptyFilters: FilterState = { minPrice: '', maxPrice: '', rating: '', discount: '', brand: '', tags: '', inStock: false }

function CatalogSelect({ value, options, onChange, ariaLabel, fullWidth = false }: { value: string; options: ReadonlyArray<readonly [string, string]>; onChange: (value: string) => void; ariaLabel: string; fullWidth?: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find(([optionValue]) => optionValue === value)?.[1] || options[0][1]

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div className={`catalog-select ${open ? 'is-open' : ''} ${fullWidth ? 'catalog-select--full' : ''}`} ref={ref}>
      <button type="button" className="catalog-select__trigger" aria-label={ariaLabel} aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        <span>{selected}</span><ChevronDown size={15} />
      </button>
      {open && <div className="catalog-select__menu" role="listbox">{options.map(([optionValue, label]) => <button type="button" role="option" aria-selected={value === optionValue} className={value === optionValue ? 'is-selected' : ''} onClick={() => { onChange(optionValue); setOpen(false) }} key={optionValue}>{label}</button>)}</div>}
    </div>
  )
}

export function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const { slug } = useParams()
  const navigate = useNavigate()
  const query = params.get('q') || params.get('query') || ''
  const [result, setResult] = useState<ProductList>({ products: [], total: 0, page: 1, totalPages: 0 })
  const [categoryName, setCategoryName] = useState('')
  const [subcategories, setSubcategories] = useState<CategoryNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>(emptyFilters)

  useEffect(() => {
    setFilters({
      minPrice: params.get('minPrice') || '', maxPrice: params.get('maxPrice') || '',
      rating: params.get('rating') || '', discount: params.get('discountPercentage') || '',
      brand: params.get('brand') || '', tags: params.get('tags') || '', inStock: params.get('inStock') === 'true',
    })
  }, [params])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    const load = async () => {
      try {
        const nextParams = new URLSearchParams(params)
        let categoryId = ''
        if (slug) {
          const category = await getJson<CategoryNode>(`/categories/slug/${slug}`)
          categoryId = category._id
          if (!cancelled) {
            setCategoryName(category.name)
            setSubcategories(category.children || [])
          }
        } else if (!cancelled) {
          setCategoryName('')
          setSubcategories([])
        }

        const queryParams = new URLSearchParams({
          page: params.get('page') || '1', limit: '24', sort: params.get('sort') || 'newest',
        })
        if (query) queryParams.set('search', query)
        if (categoryId) queryParams.set('category', categoryId)
        ;['brand', 'minPrice', 'maxPrice', 'rating', 'discountPercentage', 'tags'].forEach((key) => {
          const value = nextParams.get(key)
          if (value) queryParams.set(key, value)
        })
        if (params.get('inStock') === 'true') queryParams.set('inStock', 'true')

        const data = await getJson<ProductList>(`/products?${queryParams}`)
        if (!cancelled) setResult(data)
      } catch (reason) {
        if (!cancelled) setError(reason instanceof Error ? reason.message : 'Unable to load products.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [params, query, slug])

  const title = query ? `Results for “${query}”` : categoryName || (slug && copyBySlug[slug]?.title) || 'All products'
  const tagline = query ? `A considered edit of products matching your search.` : slug && copyBySlug[slug]?.tagline || 'Discover everyday favourites, useful upgrades and pieces worth keeping.'
  const activeFilterCount = useMemo(() => Object.entries(filters).filter(([key, value]) => key !== 'inStock' ? Boolean(value) : value).length, [filters])

  const updateParam = (key: string, value?: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    next.set('page', '1')
    setParams(next)
  }

  const applyFilters = () => {
    const next = new URLSearchParams(params)
    Object.entries(filters).forEach(([key, value]) => {
      const apiKey = key === 'discount' ? 'discountPercentage' : key
      if (value) next.set(apiKey, String(value))
      else next.delete(apiKey)
    })
    next.set('page', '1')
    setParams(next)
    setFiltersOpen(false)
  }

  const clearFilters = () => {
    const next = new URLSearchParams(params)
    ;['brand', 'minPrice', 'maxPrice', 'rating', 'discountPercentage', 'tags', 'inStock'].forEach((key) => next.delete(key))
    next.set('page', '1')
    setFilters(emptyFilters)
    setParams(next)
  }

  const setPage = (page: number) => {
    const next = new URLSearchParams(params)
    next.set('page', String(page))
    setParams(next)
  }

  return (
    <main className="catalog-page section">
      <div className="catalog-heading">
        <div><span className="eyebrow">SmartCart catalog</span><h1>{title}</h1><p>{tagline}</p></div>
        <button type="button" className="catalog-ai-link" onClick={() => navigate(`/ai-shopping${query ? `?prompt=${encodeURIComponent(query)}` : ''}`)}><Sparkles size={16} /> Ask AI to narrow it down</button>
      </div>

      <nav className="catalog-category-nav" aria-label={slug ? 'Explore subcategories' : 'Shop by category'}>
        <span>{slug ? `Shop ${categoryName}` : 'Explore categories'}</span>
        <div className="catalog-category-chips">
          {slug ? subcategories.map((subcategory) => (
            <button type="button" className="catalog-category-chip" onClick={() => navigate(`/categories/${subcategory.slug}`)} key={subcategory._id}>{subcategory.name}</button>
          )) : categoryChips.map(([categorySlug, label]) => (
            <button type="button" className={slug === categorySlug ? 'is-active' : ''} onClick={() => navigate(`/categories/${categorySlug}`)} key={categorySlug}>{label}</button>
          ))}
          {slug && !subcategories.length && <span className="catalog-category-empty">All products in this category</span>}
        </div>
      </nav>

      <div className="catalog-toolbar">
        <div className="catalog-chips" aria-label="Quick filters">
          <button className={params.get('sort') === 'bestSelling' ? 'is-active' : ''} type="button" onClick={() => updateParam('sort', 'bestSelling')}>Trending now</button>
          <button className={params.get('discountPercentage') === '20' ? 'is-active' : ''} type="button" onClick={() => updateParam('discountPercentage', '20')}>20% off & more</button>
          <button className={params.get('rating') === '4' ? 'is-active' : ''} type="button" onClick={() => updateParam('rating', '4')}>4★ rated</button>
          <button className={params.get('inStock') === 'true' ? 'is-active' : ''} type="button" onClick={() => updateParam('inStock', 'true')}>In stock</button>
        </div>
        <div className="catalog-toolbar__actions"><button type="button" className="catalog-filter-button" onClick={() => setFiltersOpen(true)}><SlidersHorizontal size={16} /> Filters {activeFilterCount ? <b>{activeFilterCount}</b> : null}</button><CatalogSelect ariaLabel="Sort products" value={params.get('sort') || 'newest'} options={sortOptions} onChange={(value) => updateParam('sort', value)} /></div>
      </div>

      {activeFilterCount > 0 && <div className="catalog-active-filters"><span><Filter size={14} /> Active filters</span><button type="button" onClick={clearFilters}>Clear all <X size={14} /></button></div>}
      {error && <div className="api-notice">{error}</div>}
      {loading ? <div className="product-grid catalog-grid">{Array.from({ length: 8 }).map((_, index) => <div className="product-skeleton" key={index} />)}</div> : <><div className="product-grid catalog-grid">{result.products.map((product) => <ProductCard product={product} key={product._id} />)}</div>{!result.products.length && <div className="section-empty">No products found. Try another filter or ask SmartCart AI for help.</div>}<div className="pagination">{Array.from({ length: Math.min(result.totalPages, 7) }).map((_, index) => <button className={result.page === index + 1 ? 'active' : ''} onClick={() => setPage(index + 1)} key={index}>{index + 1}</button>)}</div></>}

      {filtersOpen && <div className="catalog-filter-backdrop" onClick={() => setFiltersOpen(false)}><aside className="catalog-filter-panel" onClick={(event) => event.stopPropagation()}><div className="catalog-filter-panel__head"><div><span className="eyebrow">Refine your edit</span><h2>Find the right fit.</h2></div><button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X size={19} /></button></div><div className="catalog-filter-panel__body"><label>Brand<input value={filters.brand} onChange={(event) => setFilters({ ...filters, brand: event.target.value })} placeholder="Nike, Sony..." /></label><div className="catalog-brand-options">{brands.map((brand) => <button type="button" className={filters.brand.split(',').includes(brand) ? 'is-active' : ''} onClick={() => setFilters({ ...filters, brand })} key={brand}>{brand}</button>)}</div><div className="catalog-filter-row"><label>Min price<input inputMode="numeric" value={filters.minPrice} onChange={(event) => setFilters({ ...filters, minPrice: event.target.value })} placeholder="₹0" /></label><label>Max price<input inputMode="numeric" value={filters.maxPrice} onChange={(event) => setFilters({ ...filters, maxPrice: event.target.value })} placeholder="₹50,000" /></label></div><label>Minimum rating<CatalogSelect fullWidth ariaLabel="Minimum rating" value={filters.rating} options={[['', 'Any rating'], ['4', '4★ and above'], ['3', '3★ and above']]} onChange={(value) => setFilters({ ...filters, rating: value })} /></label><label>Minimum discount<CatalogSelect fullWidth ariaLabel="Minimum discount" value={filters.discount} options={[['', 'Any discount'], ['10', '10% and above'], ['20', '20% and above'], ['30', '30% and above']]} onChange={(value) => setFilters({ ...filters, discount: value })} /></label><label>Tags<input value={filters.tags} onChange={(event) => setFilters({ ...filters, tags: event.target.value })} placeholder="running, cotton, wireless" /></label><label className="catalog-check"><input type="checkbox" checked={filters.inStock} onChange={(event) => setFilters({ ...filters, inStock: event.target.checked })} /> Only show in-stock products</label></div><div className="catalog-filter-panel__footer"><button type="button" onClick={clearFilters}>Reset</button><button type="button" className="primary-button" onClick={applyFilters}>Show products</button></div></aside></div>}
    </main>
  )
}
