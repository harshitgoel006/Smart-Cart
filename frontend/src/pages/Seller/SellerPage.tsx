import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { BarChart3, Check, ChevronRight, Package, Plus, Reply, Store, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthProvider'
import { getJson, sendForm, sendJson } from '../../services/apiClient'
import { formatPrice, productImage } from '../../utils/formatters'
import { SimpleAccountPage } from '../../components/ui/EmptyState/SimpleAccountPage'

type SellerProduct = { _id: string; name: string; brand?: string; price?: number | string; finalPrice?: number | string; stock?: number; ratings?: number; approvalStatus?: string; isActive?: boolean; isArchived?: boolean; coverImage?: { url?: string }; images?: Array<{ url?: string }>; category?: { name?: string } }
type SellerOrder = { orderId: string; itemId: string; createdAt?: string; product?: { name?: string; image?: string }; quantity?: number; total?: number; fulfillmentStatus?: string; shipment?: { courierName?: string; trackingNumber?: string } }
type SellerReview = { _id: string; rating?: number; title?: string; comment?: string; product?: { name?: string }; user?: { fullname?: string; username?: string }; sellerResponse?: { message?: string } }
type Category = { _id: string; name: string; slug: string; parent?: string | null }

const statuses = ['pending', 'processing', 'shipped', 'delivered']

export function SellerPage() {
  const { user, loading } = useAuth()
  const [tab, setTab] = useState('overview')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState('')
  const [products, setProducts] = useState<SellerProduct[]>([])
  const [orders, setOrders] = useState<SellerOrder[]>([])
  const [reviews, setReviews] = useState<SellerReview[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [productForm, setProductForm] = useState({ name: '', description: '', brand: '', price: '', stock: '', category: '', images: null as FileList | null })

  const loadProducts = async () => { const data = await getJson<{ products: SellerProduct[] }>('/products/seller/products?page=1&limit=50&sort=newest'); setProducts(data.products || []) }
  const loadOrders = async () => { const data = await getJson<{ orders: SellerOrder[] }>('/orders/seller/orders?page=1&limit=50'); setOrders(data.orders || []) }
  const loadReviews = async () => { const data = await getJson<{ reviews: SellerReview[] }>('/reviews/seller/reviews?page=1&limit=50'); setReviews(data.reviews || []) }
  const loadCategories = async () => { const data = await getJson<Category[]>('/categories/seller/list'); setCategories(Array.isArray(data) ? data : []) }

  const loadAll = async () => {
    setBusy('load'); setMessage('')
    const results = await Promise.allSettled([
      loadProducts(), loadOrders(), loadReviews(), loadCategories(),
      getJson('/orders/seller/sales-analytics'), getJson('/users/seller/profile'),
    ])
    if (results[4].status === 'fulfilled') setAnalytics(results[4].value)
    if (results[5].status === 'fulfilled') setProfile(results[5].value)
    const failed = results.filter((result) => result.status === 'rejected').length
    if (failed) setMessage('Some seller data could not be loaded. Refresh once the server is ready.')
    setBusy('')
  }

  useEffect(() => { if (user?.role === 'seller') void loadAll() }, [user])

  const submitProduct = async (event: FormEvent) => {
    event.preventDefault(); setBusy('product'); setMessage('')
    try {
      const form = new FormData()
      Object.entries(productForm).forEach(([key, value]) => { if (key !== 'images' && value) form.append(key, value as string) })
      if (productForm.images) Array.from(productForm.images).forEach((file) => form.append('images', file))
      await sendForm('/products/create', form)
      setProductForm({ name: '', description: '', brand: '', price: '', stock: '', category: '', images: null })
      setShowProductForm(false); setMessage('Product submitted for admin approval.'); await loadProducts()
    } catch (error) { setMessage((error as Error).message) } finally { setBusy('') }
  }

  const updateStock = async (product: SellerProduct) => {
    const value = window.prompt('Enter new stock quantity', String(product.stock || 0))
    if (value === null) return
    setBusy(product._id); try { await sendJson(`/products/product/${product._id}/stock`, 'PATCH', { stock: Number(value) }); await loadProducts(); setMessage('Stock updated.') } catch (error) { setMessage((error as Error).message) } finally { setBusy('') }
  }

  const updateOrder = async (order: SellerOrder, status: string) => {
    setBusy(order.itemId); setMessage('')
    try {
      const tracking = status === 'shipped' ? { courierName: order.shipment?.courierName || window.prompt('Courier name') || '', trackingNumber: order.shipment?.trackingNumber || window.prompt('Tracking number') || '' } : undefined
      await sendJson('/orders/seller/orders/update-status', 'PATCH', { orderId: order.orderId, itemId: order.itemId, status, ...(tracking ? { tracking } : {}) })
      await loadOrders(); setMessage('Order status updated.')
    } catch (error) { setMessage((error as Error).message) } finally { setBusy('') }
  }

  const replyReview = async (review: SellerReview) => {
    const reply = window.prompt('Write your reply to this review')
    if (!reply?.trim()) return
    setBusy(review._id); try { await sendJson(`/reviews/seller/reviews/${review._id}/reply`, 'POST', { message: reply.trim() }); await loadReviews(); setMessage('Reply posted.') } catch (error) { setMessage((error as Error).message) } finally { setBusy('') }
  }

  const totals = useMemo(() => ({ products: products.length, pending: products.filter((item) => item.approvalStatus === 'pending').length, orders: orders.length, revenue: analytics?.summary?.totalRevenue || 0 }), [products, orders, analytics])
  if (loading) return <main className="section empty-page"><h1>Loading seller workspace...</h1></main>
  if (!user) return <SimpleAccountPage title="Seller workspace" text="Sign in to manage your SmartCart store." link="/login" linkText="Sign in" />
  if (user.role !== 'seller') return <SimpleAccountPage title="Seller access required" text="This workspace is available only to seller accounts." link="/" linkText="Back to storefront" />

  return <main className="seller-page section">
    <div className="seller-hero"><div><span className="eyebrow"><Store size={14} /> Seller workspace</span><h1>Run your store with confidence.</h1><p>Manage products, fulfilment, customer feedback and sales from one focused space.</p></div><button className="outline-button" onClick={() => void loadAll()} disabled={busy === 'load'}><BarChart3 size={16} /> {busy === 'load' ? 'Refreshing...' : 'Refresh data'}</button></div>
    {message && <div className="api-notice">{message}</div>}
    <nav className="seller-tabs" aria-label="Seller navigation">{[['overview', 'Overview'], ['products', 'Products'], ['orders', 'Orders'], ['reviews', 'Reviews'], ['categories', 'Categories'], ['profile', 'Store profile']].map(([key, label]) => <button className={tab === key ? 'is-active' : ''} onClick={() => setTab(key)} key={key}>{label}</button>)}</nav>
    {tab === 'overview' && <><section className="seller-stats"><article><Package /><small>Products</small><strong>{totals.products}</strong></article><article><Truck /><small>Orders</small><strong>{totals.orders}</strong></article><article><Check /><small>Pending approval</small><strong>{totals.pending}</strong></article><article><BarChart3 /><small>Revenue</small><strong>{formatPrice(totals.revenue)}</strong></article></section><div className="seller-grid"><section className="seller-card"><div className="seller-card__heading"><div><span className="eyebrow">Sales intelligence</span><h2>Top products</h2></div></div>{(analytics?.topProducts || []).length ? analytics.topProducts.map((item: any) => <div className="seller-list-row" key={String(item._id)}><span>{item.productName || 'Product'}</span><b>{item.totalUnitsSold || 0} sold</b></div>) : <div className="seller-empty">Sales insights will appear after your first orders.</div>}</section><section className="seller-card"><div className="seller-card__heading"><div><span className="eyebrow">Fulfilment</span><h2>Recent orders</h2></div><button className="link-button" onClick={() => setTab('orders')}>View all <ChevronRight size={15} /></button></div>{orders.slice(0, 5).map((order) => <div className="seller-list-row" key={order.itemId}><span>{order.product?.name || 'Product'}<small>#{String(order.orderId).slice(-8).toUpperCase()}</small></span><b>{order.fulfillmentStatus || 'pending'}</b></div>)}{!orders.length && <div className="seller-empty">No orders yet.</div>}</section></div></>}
    {tab === 'products' && <section className="seller-card"><div className="seller-card__heading"><div><span className="eyebrow">Catalog</span><h2>Your products</h2></div><button className="primary-button" onClick={() => setShowProductForm((value) => !value)}><Plus size={16} /> {showProductForm ? 'Close form' : 'Add product'}</button></div>{showProductForm && <form className="seller-form" onSubmit={submitProduct}><div className="seller-form-grid"><label>Name<input required value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} /></label><label>Brand<input value={productForm.brand} onChange={(event) => setProductForm({ ...productForm, brand: event.target.value })} /></label><label>Price<input required type="number" min="1" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} /></label><label>Stock<input required type="number" min="0" value={productForm.stock} onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })} /></label><label>Category<select required value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}><option value="">Choose a leaf category</option>{categories.filter((item) => !categories.some((child) => child.parent === item._id)).map((item) => <option value={item._id} key={item._id}>{item.name}</option>)}</select></label><label>Images<input required type="file" accept="image/*" multiple onChange={(event) => setProductForm({ ...productForm, images: event.target.files })} /></label></div><label>Description<textarea required minLength={10} value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} /></label><button className="primary-button" disabled={busy === 'product'}>{busy === 'product' ? 'Submitting...' : 'Submit product'}</button></form>}<div className="seller-table">{products.map((product) => <article className="seller-product-row" key={product._id}><img src={productImage(product)} alt="" /><div><strong>{product.name}</strong><small>{product.category?.name || 'Uncategorised'} · {product.stock || 0} in stock</small></div><span className={`seller-status seller-status--${product.approvalStatus || 'pending'}`}>{product.approvalStatus || 'pending'}</span><button className="small-action" onClick={() => void updateStock(product)} disabled={busy === product._id}>Update stock</button></article>)}{!products.length && <div className="seller-empty">No products found. Add your first product above.</div>}</div></section>}
    {tab === 'orders' && <section className="seller-card"><div className="seller-card__heading"><div><span className="eyebrow">Fulfilment</span><h2>Seller orders</h2></div></div><div className="seller-table">{orders.map((order) => <article className="seller-order-row" key={order.itemId}><div><strong>{order.product?.name || 'Product'}</strong><small>Order #{String(order.orderId).slice(-8).toUpperCase()} · {order.quantity || 0} units · {formatPrice(order.total || 0)}</small></div><span className="seller-status">{order.fulfillmentStatus || 'pending'}</span><select value={order.fulfillmentStatus || 'pending'} onChange={(event) => void updateOrder(order, event.target.value)} disabled={busy === order.itemId}>{statuses.map((status) => <option value={status} key={status}>{status}</option>)}</select></article>)}{!orders.length && <div className="seller-empty">No seller orders found.</div>}</div></section>}
    {tab === 'reviews' && <section className="seller-card"><div className="seller-card__heading"><div><span className="eyebrow">Customer voice</span><h2>Reviews & replies</h2></div></div>{reviews.map((review) => <article className="seller-review-row" key={review._id}><div><strong>{'★'.repeat(review.rating || 0)} {review.title || 'Customer review'}</strong><small>{review.product?.name || 'Product'} · {review.user?.fullname || review.user?.username || 'Customer'}</small><p>{review.comment || 'No written feedback.'}</p>{review.sellerResponse?.message && <em>Your reply: {review.sellerResponse.message}</em>}</div>{!review.sellerResponse?.message && <button className="small-action" onClick={() => void replyReview(review)} disabled={busy === review._id}><Reply size={14} /> Reply</button>}</article>)}{!reviews.length && <div className="seller-empty">No reviews found.</div>}</section>}
    {tab === 'categories' && <section className="seller-card"><div className="seller-card__heading"><div><span className="eyebrow">Catalog taxonomy</span><h2>Approved categories</h2></div></div><div className="seller-category-grid">{categories.map((category) => <Link to={`/categories/${category.slug}`} key={category._id}><strong>{category.name}</strong><small>{category.parent ? 'Subcategory' : 'Top level'} <ChevronRight size={13} /></small></Link>)}</div></section>}
    {tab === 'profile' && <SellerProfile profile={profile} onSaved={async () => { setMessage('Store profile saved.'); const data = await getJson('/users/seller/profile'); setProfile(data) }} />}
  </main>
}

function SellerProfile({ profile, onSaved }: { profile: any; onSaved: () => Promise<void> }) {
  const [form, setForm] = useState<any>({ ...(profile?.basicInfo || {}), ...(profile?.sellerProfile || {}) })
  const [saving, setSaving] = useState(false)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  useEffect(() => { setForm({ ...(profile?.basicInfo || {}), ...(profile?.sellerProfile || {}) }) }, [profile])
  const save = async (event: FormEvent) => { event.preventDefault(); setSaving(true); try { const payload = new FormData(); Object.entries(form).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== '') payload.append(key, String(value)) }); if (bannerFile) payload.append('storeBanner', bannerFile); await sendForm('/users/seller/update-account', payload); setBannerFile(null); await onSaved() } catch (error) { window.alert((error as Error).message) } finally { setSaving(false) } }
  return <section className="seller-card"><div className="seller-card__heading"><div><span className="eyebrow">Store identity</span><h2>Seller profile</h2></div></div><form className="seller-form" onSubmit={save}><div className="seller-form-grid"><label>Full name<input value={form.fullname || ''} onChange={(event) => setForm({ ...form, fullname: event.target.value })} /></label><label>Username<input value={form.username || ''} onChange={(event) => setForm({ ...form, username: event.target.value })} /></label><label>Shop name<input value={form.shopName || ''} onChange={(event) => setForm({ ...form, shopName: event.target.value })} /></label><label>Business type<input value={form.businessType || ''} onChange={(event) => setForm({ ...form, businessType: event.target.value })} /></label><label>GST number<input value={form.gstNumber || ''} onChange={(event) => setForm({ ...form, gstNumber: event.target.value })} /></label><label>Phone<input value={form.phone || ''} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label><label>Store banner<input type="file" accept="image/*" onChange={(event) => setBannerFile(event.target.files?.[0] || null)} /></label></div><label>Shop address<textarea value={form.shopAddress || ''} onChange={(event) => setForm({ ...form, shopAddress: event.target.value })} /></label><button className="primary-button" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</button></form></section>
}
