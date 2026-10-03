import { useEffect, useState } from 'react'
import { ArrowLeft, Boxes, CalendarClock, MessageSquare, Pencil, RefreshCw, Tag, Trash2, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthProvider'
import { getJson, sendForm, sendJson } from '../../services/apiClient'
import { SimpleAccountPage } from '../../components/ui/EmptyState/SimpleAccountPage'

type Product = { _id: string; name: string; price?: number | string; description?: string; isActive?: boolean; isArchived?: boolean; featured?: boolean; variants?: unknown[]; flashSale?: { isActive?: boolean; discountPercentage?: number } }
type Order = { orderId: string; itemId: string; fulfillmentStatus?: string; returnStatus?: string; refundStatus?: string; product?: { name?: string }; shipment?: { courierName?: string; trackingNumber?: string } }
type Category = { _id: string; name: string; parent?: string | null; status?: string }

export function SellerToolsPage() {
  const { user, loading } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [feedback, setFeedback] = useState<any>(null)
  const [qna, setQna] = useState<any[]>([])
  const [reviewSummary, setReviewSummary] = useState<any>(null)
  const [detailData, setDetailData] = useState<{ title: string; data: any } | null>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState('')

  const refresh = async () => {
    setBusy('refresh')
    const results = await Promise.allSettled([
      getJson<{ products: Product[] }>('/products/seller/products?page=1&limit=50&sort=newest'),
      getJson<{ orders: Order[] }>('/orders/seller/orders?page=1&limit=50'),
      getJson<Category[]>('/categories/seller/list'),
    ])
    if (results[0].status === 'fulfilled') setProducts(results[0].value.products || [])
    if (results[1].status === 'fulfilled') setOrders(results[1].value.orders || [])
    if (results[2].status === 'fulfilled') setCategories(results[2].value || [])
    if (results.some((result) => result.status === 'rejected')) setMessage('Some seller controls could not be loaded.')
    setBusy('')
  }

  useEffect(() => { if (user?.role === 'seller') void refresh() }, [user])

  const productAction = async (productId: string, action: string, payload?: unknown) => {
    setBusy(productId); setMessage('')
    const method = action === 'delete-flash-sale' ? 'DELETE' : action === 'variants' ? 'PATCH' : 'POST'
    try { await sendJson(`/products/product/${productId}/${action}`, method, payload); await refresh(); setMessage('Product control updated.') } catch (error) { setMessage((error as Error).message) } finally { setBusy('') }
  }

  const editProduct = async (product: Product) => {
    const name = window.prompt('Product name', product.name)
    const price = window.prompt('Price', String(product.price || ''))
    const description = window.prompt('Description', product.description || '')
    if (!name?.trim() || price === null || description === null) return
    const form = new FormData(); form.append('name', name.trim()); form.append('price', price); form.append('description', description)
    setBusy(product._id)
    try { await sendForm(`/products/seller/product/${product._id}`, form, 'PUT'); await refresh(); setMessage('Product updated and sent for approval.') } catch (error) { setMessage((error as Error).message) } finally { setBusy('') }
  }

  const deleteProduct = async (product: Product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return
    try { await sendJson(`/products/seller/product/${product._id}`, 'DELETE'); await refresh(); setMessage('Product deleted.') } catch (error) { setMessage((error as Error).message) }
  }

  const editVariants = async (product: Product) => {
    const raw = window.prompt('Variants JSON', JSON.stringify(product.variants || []))
    if (!raw) return
    try { await productAction(product._id, 'variants', { variants: JSON.parse(raw) }) } catch { setMessage('Variants must be valid JSON.') }
  }

  const flashSale = async (product: Product) => {
    if (product.flashSale?.isActive) { await productAction(product._id, 'delete-flash-sale'); return }
    const start = window.prompt('Start date/time (future ISO format)', new Date(Date.now() + 3600000).toISOString().slice(0, 16))
    const end = window.prompt('End date/time (future ISO format)', new Date(Date.now() + 86400000).toISOString().slice(0, 16))
    const discountPercentage = window.prompt('Discount percentage (1-90)', '10')
    if (start && end && discountPercentage) await productAction(product._id, 'flash-sale', { start, end, discountPercentage: Number(discountPercentage) })
  }

  const loadFeedback = async (productId: string) => {
    setSelectedProduct(productId); setBusy(`feedback-${productId}`)
    try {
      const [reviewData, qnaData, summary] = await Promise.all([
        getJson(`/products/product/${productId}/feedback?page=1&limit=20`),
        getJson<{ qna: any[] }>(`/products/product/${productId}/qna?limit=20`),
        getJson(`/reviews/seller/reviews/summary?productId=${productId}`),
      ])
      setFeedback(reviewData); setQna(qnaData.qna || []); setReviewSummary(summary)
    } catch (error) { setMessage((error as Error).message) } finally { setBusy('') }
  }

  const answerQuestion = async (item: any) => {
    const answer = window.prompt('Write answer', item.answer || '')
    if (!answer?.trim() || !selectedProduct) return
    try { await sendJson(`/products/product/${selectedProduct}/qna/${item._id}/respond`, 'POST', { answer: answer.trim() }); await loadFeedback(selectedProduct) } catch (error) { setMessage((error as Error).message) }
  }

  const tracking = async (order: Order) => {
    const courierName = window.prompt('Courier name', order.shipment?.courierName || '')
    const trackingNumber = window.prompt('Tracking number', order.shipment?.trackingNumber || '')
    if (!courierName || !trackingNumber) return
    try { await sendJson('/orders/seller/orders/update-tracking', 'PATCH', { orderId: order.orderId, itemId: order.itemId, tracking: { courierName, trackingNumber } }); setMessage('Tracking details saved.') } catch (error) { setMessage((error as Error).message) }
  }

  const orderDetails = async (order: Order) => {
    try {
      const data = await getJson(`/orders/seller/orders/${order.orderId}`)
      setDetailData({ title: `Order #${String(order.orderId).slice(-8).toUpperCase()}`, data })
    } catch (error) { setMessage((error as Error).message) }
  }

  const categoryPerformance = async (category: Category) => {
    try {
      const data = await getJson(`/categories/seller/performance/${category._id}`)
      setDetailData({ title: `${category.name} performance`, data })
    } catch (error) { setMessage((error as Error).message) }
  }

  const trackingEvent = async (order: Order) => {
    const event = window.prompt('Tracking event, e.g. Out for delivery')
    if (!event) return
    try { await sendJson('/orders/seller/orders/tracking-event', 'POST', { orderId: order.orderId, itemId: order.itemId, event, location: window.prompt('Location') || '', remarks: window.prompt('Remarks') || '' }); setMessage('Tracking event added.'); await refresh() } catch (error) { setMessage((error as Error).message) }
  }

  const decide = async (order: Order, type: 'return' | 'refund') => {
    const decision = window.prompt('Enter approved or rejected')
    if (!['approved', 'rejected'].includes(decision || '')) return
    try { await sendJson(`/orders/seller/orders/${type}-request`, 'POST', { orderId: order.orderId, itemId: order.itemId, decision, reason: window.prompt('Reason') || '' }); setMessage(`${type} decision saved.`); await refresh() } catch (error) { setMessage((error as Error).message) }
  }

  const proposeCategory = async () => {
    const name = window.prompt('New category name')
    if (!name?.trim()) return
    try { await sendJson('/categories/seller/propose', 'POST', { name: name.trim(), parent: window.prompt('Parent category ID (optional)') || null, description: window.prompt('Description') || '' }); setMessage('Category proposal sent for admin approval.'); await refresh() } catch (error) { setMessage((error as Error).message) }
  }

  const manageCategory = async (category: Category) => {
    const action = window.prompt('Enter action: edit, status, or delete', 'edit')
    try {
      if (action === 'delete' && window.confirm(`Delete ${category.name}?`)) await sendJson(`/categories/seller/delete/${category._id}`, 'DELETE')
      if (action === 'status') { const status = window.prompt('Status: pending, approved, rejected', category.status || 'pending'); if (status) await sendJson(`/categories/seller/update-status/${category._id}`, 'PATCH', { status }) }
      if (action === 'edit') { const name = window.prompt('Category name', category.name); if (name?.trim()) await sendJson(`/categories/seller/update-status/${category._id}`, 'PATCH', { name: name.trim() }) }
      await refresh(); setMessage('Category updated.')
    } catch (error) { setMessage((error as Error).message) }
  }

  if (loading) return <main className="section empty-page"><h1>Loading seller controls...</h1></main>
  if (!user) return <SimpleAccountPage title="Seller workspace" text="Sign in to continue." link="/login" linkText="Sign in" />
  if (user.role !== 'seller') return <SimpleAccountPage title="Seller access required" text="This page is only for sellers." link="/" linkText="Back" />

  return <main className="seller-page section"><SellerCatalogBrowser />
    <div className="seller-hero"><div><Link className="back-link" to="/seller"><ArrowLeft size={15} /> Seller workspace</Link><span className="eyebrow"><Boxes size={14} /> Advanced controls</span><h1>Operate every part of your store.</h1><p>Manage catalogue quality, delivery events, customer questions and category proposals.</p></div><button className="outline-button" onClick={() => void refresh()} disabled={busy === 'refresh'}><RefreshCw size={15} /> {busy === 'refresh' ? 'Refreshing...' : 'Refresh'}</button></div>
    {message && <div className="api-notice">{message}</div>}
    {detailData && <div className="seller-detail-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetailData(null) }}><section className="seller-detail-modal" role="dialog" aria-modal="true"><div className="seller-card__heading"><div><span className="eyebrow">Seller details</span><h2>{detailData.title}</h2></div><button className="icon-action" onClick={() => setDetailData(null)} aria-label="Close">×</button></div><div className="seller-detail-grid">{Object.entries(detailData.data || {}).map(([key, value]) => <div key={key}><small>{key.replace(/([A-Z])/g, ' $1')}</small><strong>{typeof value === 'object' ? JSON.stringify(value) : String(value ?? '-')}</strong></div>)}</div></section></div>}
    <div className="seller-tools-grid">
      <section className="seller-card"><div className="seller-card__heading"><div><span className="eyebrow">Product operations</span><h2>Catalogue controls</h2></div></div>
        {products.map((product) => <div className="seller-tool-row" key={product._id}><div><strong>{product.name}</strong><small>{product.isArchived ? 'Archived' : product.isActive === false ? 'Inactive' : 'Active'}{product.flashSale?.isActive ? ` · ${product.flashSale.discountPercentage}% flash sale` : ''}</small></div><div className="seller-tool-actions"><button className="small-action" onClick={() => void productAction(product._id, 'toggle-active', { isActive: product.isActive === false })}>Toggle active</button><button className="small-action" onClick={() => void productAction(product._id, 'toggle-feature', { featured: !product.featured })}>Feature</button><button className="small-action" onClick={() => void editProduct(product)}><Pencil size={14} /> Edit</button><button className="small-action" onClick={() => void editVariants(product)}>Variants</button><button className="small-action" onClick={() => void flashSale(product)}><CalendarClock size={14} /> {product.flashSale?.isActive ? 'Remove sale' : 'Flash sale'}</button><button className="small-action seller-danger-action" onClick={() => void deleteProduct(product)}><Trash2 size={14} /> Delete</button><button className="small-action" onClick={() => void productAction(product._id, product.isArchived ? 'restore' : 'archive')}>{product.isArchived ? 'Restore' : 'Archive'}</button><button className="small-action" onClick={() => void loadFeedback(product._id)}>Feedback</button></div></div>)}
        {!products.length && <div className="seller-empty">No products available.</div>}
      </section>
      <section className="seller-card"><div className="seller-card__heading"><div><span className="eyebrow">Customer care</span><h2>Feedback & questions</h2></div></div>{selectedProduct ? <><p className="seller-helper">{reviewSummary ? `${reviewSummary.averageRating || reviewSummary.summary?.averageRating || 0} average rating · ${reviewSummary.totalReviews || reviewSummary.summary?.totalReviews || 0} reviews` : 'Approved feedback'}</p>{(feedback?.reviews || []).map((review: any) => <div className="seller-tool-row" key={review._id}><div><strong>{review.title || 'Review'}</strong><small>{review.comment || 'No comment'}</small></div></div>)}{qna.map((item) => <div className="seller-tool-row" key={item._id}><div><strong>Q. {item.question}</strong><small>{item.answer || 'Awaiting your answer'}</small></div><button className="small-action" onClick={() => void answerQuestion(item)}><MessageSquare size={14} /> Answer</button></div>)}</> : <div className="seller-empty">Choose Feedback on a product to inspect reviews and answer questions.</div>}</section>
      <section className="seller-card"><div className="seller-card__heading"><div><span className="eyebrow">Delivery operations</span><h2>Tracking & requests</h2></div></div>{orders.map((order) => <div className="seller-tool-row" key={order.itemId}><div><strong>{order.product?.name || 'Order item'}</strong><small>#{String(order.orderId).slice(-8).toUpperCase()} · {order.fulfillmentStatus || 'pending'}</small></div><div className="seller-tool-actions"><button className="small-action" onClick={() => void orderDetails(order)}>Details</button><button className="small-action" onClick={() => void tracking(order)}><Truck size={14} /> Tracking</button><button className="small-action" onClick={() => void trackingEvent(order)}>Add event</button>{order.returnStatus === 'requested' && <button className="small-action" onClick={() => void decide(order, 'return')}>Return decision</button>}{order.refundStatus === 'pending' && <button className="small-action" onClick={() => void decide(order, 'refund')}>Refund decision</button>}</div></div>)}{!orders.length && <div className="seller-empty">No orders available.</div>}</section>
      <section className="seller-card"><div className="seller-card__heading"><div><span className="eyebrow"><Tag size={14} /> Categories</span><h2>Category tools</h2></div><button className="primary-button" onClick={() => void proposeCategory()}>Propose category</button></div><div className="seller-category-grid">{categories.slice(0, 12).map((category) => <div key={category._id}><strong>{category.name}</strong><small>{category.status || (category.parent ? 'Subcategory' : 'Top level')}</small><button className="small-action" onClick={() => void categoryPerformance(category)}>Performance</button><button className="small-action" onClick={() => void manageCategory(category)}>Manage</button></div>)}</div></section>
    </div>
  </main>
}

function SellerCatalogBrowser() {
  const [tab, setTab] = useState<'products' | 'orders'>('products')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const pageSize = 5

  useEffect(() => {
    void Promise.all([
      getJson<{ products: Product[] }>('/products/seller/products?page=1&limit=100'),
      getJson<{ orders: Order[] }>('/orders/seller/orders?page=1&limit=100'),
    ]).then(([productData, orderData]) => { setProducts(productData.products || []); setOrders(orderData.orders || []) }).catch(() => undefined)
  }, [])

  const source = tab === 'products' ? products : orders
  const filtered = source.filter((item: any) => {
    const text = `${item.name || ''} ${item.product?.name || ''} ${item.orderId || ''}`.toLowerCase()
    const itemStatus = tab === 'products' ? (item.isActive === false ? 'inactive' : item.approvalStatus || 'pending') : item.fulfillmentStatus || 'pending'
    return (!query.trim() || text.includes(query.toLowerCase().trim())) && (status === 'all' || itemStatus === status)
  })
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize)
  return <section className="seller-card seller-list-browser"><div className="seller-card__heading"><div><span className="eyebrow">Store records</span><h2>Search and filter</h2></div><div className="seller-tabs seller-tabs--compact"><button className={tab === 'products' ? 'is-active' : ''} onClick={() => { setTab('products'); setPage(1); setStatus('all') }}>Products</button><button className={tab === 'orders' ? 'is-active' : ''} onClick={() => { setTab('orders'); setPage(1); setStatus('all') }}>Orders</button></div></div><div className="seller-filter-row"><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder={tab === 'products' ? 'Search product name...' : 'Search product or order ID...'} /><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }}><option value="all">All statuses</option>{(tab === 'products' ? ['pending', 'approved', 'rejected', 'inactive'] : ['pending', 'processing', 'shipped', 'delivered', 'cancelled']).map((value) => <option key={value} value={value}>{value}</option>)}</select></div><div className="seller-table">{rows.map((item: any) => <div className="seller-list-row" key={item._id || item.itemId}><span><strong>{item.name || item.product?.name || 'Order'}</strong><small>{tab === 'products' ? `${item.approvalStatus || 'pending'} · ${item.stock || 0} in stock` : `#${String(item.orderId).slice(-8).toUpperCase()} · ${item.fulfillmentStatus || 'pending'}`}</small></span><b>{tab === 'products' ? item.brand || 'Product' : item.quantity || 0}</b></div>)}{!rows.length && <div className="seller-empty">No matching records.</div>}</div><div className="seller-pagination"><button className="outline-button" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button><span>Page <strong>{page}</strong> of <strong>{totalPages}</strong> · {filtered.length} records</span><button className="outline-button" disabled={page >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</button></div></section>
}
