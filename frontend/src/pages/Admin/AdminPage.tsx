import { useCallback, useEffect, useMemo, useState } from 'react'
import { BarChart3, Check, CircleAlert, Download, LayoutDashboard, Package, RefreshCw, ShieldCheck, ShoppingBag, Store, Users, X, Megaphone, TicketPercent, Activity, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthProvider'
import { getBlob, getJson, sendForm, sendJson } from '../../services/apiClient'
import { formatPrice } from '../../utils/formatters'
import { useSiteSettings } from '../../app/providers/SiteSettingsProvider'
import { AdminCategoriesView, AdminProductsView, AdminResourceDetailsDrawer, AdminUsersView } from './AdminResourceTables'
import { AdminStatusPicker } from './AdminStatusPicker'
import { AdminDatePicker } from './AdminDatePicker'
import { AdminThemedSelect } from './AdminThemedSelect'

type AdminTab = 'overview' | 'orders' | 'products' | 'categories' | 'reviews' | 'customers' | 'sellers' | 'operations' | 'advanced' | 'settings'
type AdminUser = { _id: string; fullname?: string; username?: string; email: string; role: string; isActive?: boolean; isApproved?: boolean; createdAt?: string }
type AdminOrder = { orderId: string; customer?: { name?: string; email?: string }; orderStatus?: string; paymentStatus?: string; finalAmount?: number; createdAt?: string }
type AdminProduct = { _id: string; name: string; approvalStatus?: string; isActive?: boolean; isDeleted?: boolean; ratings?: number; sold?: number; seller?: { fullname?: string; email?: string }; category?: { name?: string } }
type AdminCategory = { _id: string; name: string; slug?: string; status?: string; isActive?: boolean; isDeleted?: boolean; parent?: { name?: string }; proposedBy?: { fullname?: string; email?: string } }
type AdminReview = { _id: string; rating: number; title?: string; comment?: string; status?: string; helpfulCount?: number; reportCount?: number; createdAt?: string; productData?: { name?: string }; userData?: { fullname?: string; email?: string } }
type AdminBanner = { _id: string; title?: string; tagline?: string; image?: { url?: string }; redirectLink?: string; position?: string; type?: string; isActive?: boolean }
type AdminCoupon = { _id: string; code: string; discountType?: string; discountValue?: number; isActive?: boolean; expiryDate?: string; usageLimit?: number; usedCount?: number }
type AdminAnalytics = { revenue?: number; orders?: number; customers?: number; sellers?: number; daily?: Array<{ _id?: string; revenue?: number; orders?: number }>; topProducts?: Array<{ _id?: string; units?: number; revenue?: number }> }
type AdminDetailType = 'product' | 'category' | 'customer' | 'seller'

const tabs: Array<{ id: AdminTab; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: BarChart3 },
  { id: 'reviews', label: 'Reviews', icon: ShieldCheck },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'sellers', label: 'Sellers', icon: Store },
  { id: 'operations', label: 'Operations', icon: Activity },
  { id: 'advanced', label: 'Advanced tools', icon: BarChart3 },
  { id: 'settings', label: 'Storefront settings', icon: Store },
]

const statusLabel = (value?: string) => (value || 'pending').replace(/_/g, ' ')
const dateLabel = (value?: string) => value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
// Legacy inline table implementations remain below for compatibility with the existing admin page module.
// The active tabs use the shared detail-enabled table components imported above.
void AdminProducts
void AdminCategories
void AdminUsers

export function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const siteSettings = useSiteSettings()
  const [tab, setTab] = useState<AdminTab>('overview')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [customers, setCustomers] = useState<AdminUser[]>([])
  const [sellers, setSellers] = useState<AdminUser[]>([])
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [banners, setBanners] = useState<AdminBanner[]>([])
  const [coupons, setCoupons] = useState<AdminCoupon[]>([])
  const [cartAnalytics, setCartAnalytics] = useState<Record<string, number> | null>(null)
  const [dashboardAnalytics, setDashboardAnalytics] = useState<AdminAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [statusOpen, setStatusOpen] = useState(false)
  const statusOptions = tab === 'orders' || tab === 'operations'
    ? ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'paid', 'refunded']
    : tab === 'products' || tab === 'categories' || tab === 'reviews'
      ? ['all', 'pending', 'approved', 'rejected']
      : ['all', 'active', 'inactive', 'pending', 'approved', 'rejected']
  const activeFilterCount = Number(Boolean(search.trim())) + Number(statusFilter !== 'all')
  const [detailView, setDetailView] = useState<{ type: AdminDetailType; data: any } | null>(null)

  const loadAdminData = useCallback(async () => {
    if (user?.role !== 'admin') return
    setLoading(true)
    setMessage('')
    const results = await Promise.allSettled([
      getJson<{ users: AdminUser[] }>(`/users/admin/users?page=${page}&limit=${pageSize}`),
      getJson<{ customers: AdminUser[] }>(`/users/admin/customers?page=${page}&limit=${pageSize}`),
      getJson<{ sellers: AdminUser[] }>(`/users/admin/sellers?page=${page}&limit=${pageSize}`),
      getJson<{ orders: AdminOrder[] }>(`/orders/admin/orders?page=${page}&limit=${pageSize}`),
      getJson<{ products: AdminProduct[] }>(`/products/products?page=${page}&limit=${pageSize}`),
      getJson<{ categories: AdminCategory[] }>(`/categories/admin/list?page=${page}&limit=${pageSize}`),
      getJson<{ reviews: AdminReview[] }>(`/reviews/admin/reviews?page=${page}&limit=${pageSize}`),
      getJson<{ banners: AdminBanner[] }>(`/banners/admin/all?page=${page}&limit=${pageSize}`),
      getJson<{ coupons: AdminCoupon[] }>(`/carts/coupon/list?page=${page}&limit=${pageSize}`),
      getJson<Record<string, number>>('/carts/cart-analytics'),
    ])
    const [userResult, customerResult, sellerResult, orderResult, productResult, categoryResult, reviewResult, bannerResult, couponResult, analyticsResult] = results
    if (userResult.status === 'fulfilled') setUsers(userResult.value.users || [])
    if (customerResult.status === 'fulfilled') setCustomers(customerResult.value.customers || [])
    if (sellerResult.status === 'fulfilled') setSellers(sellerResult.value.sellers || [])
    if (orderResult.status === 'fulfilled') setOrders(orderResult.value.orders || [])
    if (productResult.status === 'fulfilled') setProducts(productResult.value.products || [])
    if (categoryResult.status === 'fulfilled') setCategories(categoryResult.value.categories || [])
    if (reviewResult.status === 'fulfilled') setReviews(reviewResult.value.reviews || [])
    if (bannerResult.status === 'fulfilled') setBanners(bannerResult.value.banners || [])
    if (couponResult.status === 'fulfilled') setCoupons(couponResult.value.coupons || [])
    if (analyticsResult.status === 'fulfilled') setCartAnalytics(analyticsResult.value)
    const requestNames = ['users', 'customers', 'sellers', 'orders', 'products', 'categories', 'reviews', 'banners', 'coupons', 'cart analytics']
    const failedSources = results.flatMap((result, index) => result.status === 'rejected' ? [requestNames[index]] : [])
    const failedCount = failedSources.length
    if (failedCount === results.length) setMessage('Admin data could not be loaded. Please check your admin session and try again.')
    else if (failedCount) setMessage(`${failedCount} admin data source${failedCount > 1 ? 's' : ''} failed: ${failedSources.join(', ')}. Refresh after checking the server logs.`)
    setLoading(false)
  }, [page, user])

  useEffect(() => { void loadAdminData() }, [loadAdminData])
  useEffect(() => { setPage(1) }, [search, statusFilter, tab])
  useEffect(() => { if (user?.role === 'admin') getJson<AdminAnalytics>('/admin-analytics/overview?days=7').then(setDashboardAnalytics).catch(() => undefined) }, [user])

  const runAction = async (key: string, path: string, method = 'POST', payload?: unknown) => {
    setBusy(key)
    setMessage('')
    try {
      await sendJson(path, method, payload)
      await loadAdminData()
      setMessage('Update completed successfully.')
    } catch (error) {
      setMessage((error as Error).message || 'This update could not be completed.')
    } finally { setBusy('') }
  }

  const openDetail = async (type: AdminDetailType, id: string) => {
    try {
      const path = type === 'product'
        ? `/products/admin/products/${id}`
        : type === 'category'
          ? `/categories/admin/view/${id}`
          : `/users/admin/users/${id}`
      setDetailView({ type, data: await getJson(path) })
    } catch {
      setMessage('The selected record details could not be loaded. Please try again.')
    }
  }

  const stats = useMemo(() => [
    { label: 'Total users', value: users.length, icon: Users },
    { label: 'Customers', value: customers.length, icon: ShoppingBag },
    { label: 'Sellers', value: sellers.length, icon: Store },
    { label: 'Orders loaded', value: orders.length, icon: BarChart3 },
  ], [users.length, customers.length, sellers.length, orders.length])

  const filterRows = <T extends Record<string, unknown>>(rows: T[]) => rows.filter((row) => {
    const matchesSearch = !search.trim() || JSON.stringify(row).toLowerCase().includes(search.trim().toLowerCase())
    const rowStatus = String(row.status || row.orderStatus || row.approvalStatus || row.paymentStatus || '').toLowerCase()
    const matchesStatus = statusFilter === 'all' || rowStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  if (authLoading) return <main className="admin-page admin-state"><p>Loading admin workspace...</p></main>
  if (!user || user.role !== 'admin') return <main className="admin-page admin-state"><ShieldCheck size={34} /><h1>Admin access required.</h1><p>Sign in with an administrator account to continue.</p><Link className="primary-button" to="/login">Sign in</Link></main>

  return <main className="admin-page">
    <section className="admin-hero">
      <div><span className="eyebrow"><ShieldCheck size={14} /> SmartCart control room</span><h1>Run the store with clarity.</h1><p>Review customers, sellers, products and orders from one focused workspace.</p></div>
      <button className="outline-button" onClick={() => void loadAdminData()} disabled={loading}><RefreshCw size={15} className={loading ? 'admin-spin' : ''} /> Refresh data</button>
    </section>
    <div className="admin-layout">
      <aside className="admin-sidebar"><div className="admin-sidebar__brand"><span>{siteSettings.brand?.logoUrl ? <img src={siteSettings.brand.logoUrl} alt="SmartCart" /> : 'SC'}</span><div><strong>SmartCart</strong><small>Admin workspace</small></div></div><nav>{tabs.map(({ id, label, icon: Icon }) => <button type="button" className={tab === id ? 'is-active' : ''} onClick={() => setTab(id)} key={id}><Icon size={17} /> {label}</button>)}</nav><div className="admin-sidebar__foot"><span>Signed in as</span><strong>{user.fullname || user.email}</strong></div></aside>
      <section className="admin-content">
        {message && <div className="admin-notice"><CircleAlert size={16} /> {message}</div>}
        <div className="admin-filters"><label>Search all records<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, email, order ID, product..." /></label><label>Status<div className="admin-select"><button type="button" className="admin-select__trigger" aria-expanded={statusOpen} onClick={() => setStatusOpen((current) => !current)}>{statusFilter === 'all' ? 'All statuses' : statusLabel(statusFilter)}<ChevronDown size={15} aria-hidden="true" /></button>{statusOpen && <div className="admin-select__menu">{statusOptions.map((option) => <button type="button" className={statusFilter === option ? 'is-selected' : ''} key={option} onClick={() => { setStatusFilter(option); setStatusOpen(false) }}>{option === 'all' ? 'All statuses' : statusLabel(option)}</button>)}</div>}</div></label>{activeFilterCount > 0 && <span className="admin-filter-count">{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active</span>}<button className="outline-button" onClick={() => { setSearch(''); setStatusFilter('all'); setStatusOpen(false) }}>Clear filters</button></div>
        {loading ? <div className="admin-loading">Loading workspace data...</div> : <>
          {tab === 'overview' && <><div className="admin-stats">{stats.map(({ label, value, icon: Icon }) => <article className="admin-stat" key={label}><span><Icon size={18} /></span><small>{label}</small><strong>{value}</strong></article>)}</div><div className="admin-panels"><section className="admin-panel"><div className="admin-panel__heading"><div><span className="eyebrow">Recent activity</span><h2>Latest orders</h2></div><button className="link-button" onClick={() => setTab('orders')}>View all</button></div>{orders.slice(0, 5).map((order) => <div className="admin-list-row" key={order.orderId}><div><strong>#{String(order.orderId || '').slice(-8).toUpperCase()}</strong><small>{order.customer?.name || order.customer?.email || 'Customer'}  -  {dateLabel(order.createdAt)}</small></div><span className={`admin-status admin-status--${order.orderStatus || 'pending'}`}>{statusLabel(order.orderStatus)}</span><b>{formatPrice(order.finalAmount)}</b></div>)}{!orders.length && <div className="admin-empty">No orders available yet.</div>}</section><section className="admin-panel admin-panel--accent"><span className="eyebrow">Needs attention</span><h2>Moderation queue</h2><p>{products.filter((product) => product.approvalStatus === 'pending').length} products are waiting for approval.</p><button className="primary-button" onClick={() => setTab('products')}>Review products <Package size={15} /></button></section></div></>}
          {tab === 'overview' && dashboardAnalytics && <section className="admin-panel admin-dashboard-analytics"><div className="admin-panel__heading"><div><span className="eyebrow">Performance</span><h2>Sales overview  -  7 days</h2></div><strong>{formatPrice(dashboardAnalytics.revenue || 0)}</strong></div><div className="admin-chart">{(dashboardAnalytics.daily || []).map((day) => <div className="admin-chart__column" key={day._id} title={`${day._id}: ${formatPrice(day.revenue || 0)}`}><div className="admin-chart__bar" style={{ height: `${Math.max(8, Math.min(100, Number(day.revenue || 0) / Math.max(1, Number(dashboardAnalytics.revenue || 1)) * 100))}%` }}><span>{day.orders || 0}</span></div><small className="admin-chart__label">{day._id?.slice(5) || '-'}</small></div>)}</div><div className="admin-top-products">{(dashboardAnalytics.topProducts || []).map((product) => <div className="admin-list-row" key={product._id}><strong>{product._id || 'Product'}</strong><span>{product.units || 0} units</span><b>{formatPrice(product.revenue || 0)}</b></div>)}</div></section>}
          {tab === 'orders' && <AdminOrders orders={filterRows(orders as unknown as Record<string, unknown>[] ) as unknown as AdminOrder[]} page={page} pageSize={pageSize} onPageChange={setPage} />}
          {tab === 'products' && <AdminProductsView products={filterRows(products as unknown as Record<string, unknown>[] ) as unknown as AdminProduct[]} busy={busy} onAction={runAction} onViewDetails={(id) => void openDetail('product', id)} page={page} pageSize={pageSize} onPageChange={setPage} />}
          {tab === 'categories' && <AdminCategoriesView categories={filterRows(categories as unknown as Record<string, unknown>[] ) as unknown as AdminCategory[]} busy={busy} onAction={runAction} onViewDetails={(id) => void openDetail('category', id)} page={page} pageSize={pageSize} onPageChange={setPage} />}
          {tab === 'reviews' && <AdminReviews reviews={filterRows(reviews as unknown as Record<string, unknown>[] ) as unknown as AdminReview[]} busy={busy} onAction={runAction} page={page} pageSize={pageSize} onPageChange={setPage} />}
          {tab === 'customers' && <AdminUsersView title="Customer accounts" users={filterRows(customers as unknown as Record<string, unknown>[] ) as unknown as AdminUser[]} busy={busy} onAction={runAction} onViewDetails={(id) => void openDetail('customer', id)} page={page} pageSize={pageSize} onPageChange={setPage} />}
          {tab === 'sellers' && <AdminUsersView title="Seller accounts" users={filterRows(sellers as unknown as Record<string, unknown>[] ) as unknown as AdminUser[]} busy={busy} onAction={runAction} onViewDetails={(id) => void openDetail('seller', id)} sellerMode page={page} pageSize={pageSize} onPageChange={setPage} />}
          {tab === 'operations' && <AdminOperations orders={orders} banners={banners} coupons={coupons} analytics={cartAnalytics} busy={busy} onAction={runAction} page={page} pageSize={pageSize} onPageChange={setPage} onDownload={async () => { try { const blob = await getBlob('/orders/admin/orders/export'); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'smartcart-orders.csv'; link.click(); URL.revokeObjectURL(url); setMessage('Order report downloaded.') } catch (error) { setMessage((error as Error).message) } }} />}
          {tab === 'advanced' && <AdminAdvanced busy={busy} onAction={runAction} categories={categories} products={products} />}
          {tab === 'settings' && <AdminStorefrontSettings onMessage={setMessage} />}
        </>}
        {!loading && tab === 'overview' && <AdminPagination page={page} hasNext={orders.length === pageSize || products.length === pageSize || customers.length === pageSize || sellers.length === pageSize} onPageChange={setPage} />}
        {detailView && <AdminResourceDetailsDrawer type={detailView.type} data={detailView.data} onClose={() => setDetailView(null)} />}
      </section>
    </div>
  </main>
}

function AdminPagination({ page, pageSize, hasNext, onPageChange }: { page: number; pageSize?: number; hasNext: boolean; onPageChange: (page: number) => void }) { return <div className="admin-pagination"><button className="outline-button" disabled={page === 1} onClick={() => onPageChange(Math.max(1, page - 1))}>Previous</button><span>Page <strong>{page}</strong>{pageSize ? `  -  ${pageSize} per page` : ''}</span><button className="outline-button" disabled={!hasNext} onClick={() => onPageChange(page + 1)}>Next</button></div> }

function AdminOrders({ orders, page, pageSize, onPageChange }: { orders: AdminOrder[]; page: number; pageSize: number; onPageChange: (page: number) => void }) { return <section className="admin-table-panel"><div className="admin-panel__heading"><div><span className="eyebrow">Commerce</span><h2>All orders</h2></div><span className="admin-count">{orders.length} loaded</span></div><div className="admin-table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Status</th><th>Payment</th><th className="align-right">Total</th></tr></thead><tbody>{orders.map((order) => <tr key={order.orderId}><td><strong>#{String(order.orderId || '').slice(-8).toUpperCase()}</strong></td><td>{order.customer?.name || order.customer?.email || 'Customer'}</td><td>{dateLabel(order.createdAt)}</td><td><span className={`admin-status admin-status--${order.orderStatus || 'pending'}`}>{statusLabel(order.orderStatus)}</span></td><td>{statusLabel(order.paymentStatus)}</td><td className="align-right"><strong>{formatPrice(order.finalAmount)}</strong></td></tr>)}</tbody></table>{!orders.length && <div className="admin-empty">No orders found.</div>}</div><AdminPagination page={page} pageSize={pageSize} hasNext={orders.length === pageSize} onPageChange={onPageChange} /></section> }

function AdminProducts({ products, busy, onAction, page, pageSize, onPageChange }: { products: AdminProduct[]; busy: string; onAction: (key: string, path: string, method?: string, payload?: unknown) => Promise<void>; page: number; pageSize: number; onPageChange: (page: number) => void }) { return <section className="admin-table-panel"><div className="admin-panel__heading"><div><span className="eyebrow">Catalog control</span><h2>Product moderation</h2></div><span className="admin-count">{products.length} loaded</span></div><div className="admin-table-wrap"><table><thead><tr><th>Product</th><th>Seller</th><th>Category</th><th>Status</th><th className="align-right">Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product._id}><td><strong>{product.name}</strong><small>{product.sold || 0} sold  -  {Number(product.ratings || 0).toFixed(1)} rating</small></td><td>{product.seller?.fullname || product.seller?.email || '-'}</td><td>{product.category?.name || '-'}</td><td><span className={`admin-status admin-status--${product.approvalStatus || 'pending'}`}>{statusLabel(product.approvalStatus)}</span></td><td className="align-right admin-actions">{product.approvalStatus === 'pending' && <><button className="icon-action icon-action--good" disabled={busy === product._id} onClick={() => void onAction(product._id, `/products/products/${product._id}/approve`)} title="Approve"><Check size={15} /></button><button className="icon-action icon-action--bad" disabled={busy === product._id} onClick={() => void onAction(product._id, `/products/products/${product._id}/reject`)} title="Reject"><X size={15} /></button></>}</td></tr>)}</tbody></table>{!products.length && <div className="admin-empty">No products found.</div>}</div><AdminPagination page={page} pageSize={pageSize} hasNext={products.length === pageSize} onPageChange={onPageChange} /></section> }

function AdminCategories({ categories, busy, onAction, page, pageSize, onPageChange }: { categories: AdminCategory[]; busy: string; onAction: (key: string, path: string, method?: string, payload?: unknown) => Promise<void>; page: number; pageSize: number; onPageChange: (page: number) => void }) { return <section className="admin-table-panel"><div className="admin-panel__heading"><div><span className="eyebrow">Taxonomy control</span><h2>Category moderation</h2></div><span className="admin-count">{categories.length} loaded</span></div><div className="admin-table-wrap"><table><thead><tr><th>Category</th><th>Parent</th><th>Proposed by</th><th>Status</th><th className="align-right">Actions</th></tr></thead><tbody>{categories.map((category) => <tr key={category._id}><td><strong>{category.name}</strong><small>{category.slug || '-'}</small></td><td>{category.parent?.name || 'Top level'}</td><td>{category.proposedBy?.fullname || category.proposedBy?.email || 'Admin'}</td><td><span className={`admin-status admin-status--${category.status || 'pending'}`}>{statusLabel(category.status)}</span></td><td className="align-right admin-actions">{category.status === 'pending' && <><button className="small-action" disabled={busy === category._id} onClick={() => void onAction(category._id, `/categories/admin/approve/${category._id}`, 'PATCH')}>Approve</button><button className="small-action small-action--danger" disabled={busy === category._id} onClick={() => void onAction(category._id, `/categories/admin/reject/${category._id}`, 'PATCH', { reason: 'Does not meet catalog standards' })}>Reject</button></>}</td></tr>)}</tbody></table>{!categories.length && <div className="admin-empty">No categories found.</div>}</div><AdminPagination page={page} pageSize={pageSize} hasNext={categories.length === pageSize} onPageChange={onPageChange} /></section> }

function AdminReviews({ reviews, busy, onAction, page, pageSize, onPageChange }: { reviews: AdminReview[]; busy: string; onAction: (key: string, path: string, method?: string, payload?: unknown) => Promise<void>; page: number; pageSize: number; onPageChange: (page: number) => void }) { return <section className="admin-table-panel"><div className="admin-panel__heading"><div><span className="eyebrow">Trust & safety</span><h2>Review moderation</h2></div><span className="admin-count">{reviews.length} loaded</span></div><div className="admin-table-wrap"><table><thead><tr><th>Review</th><th>Product</th><th>Customer</th><th>Status</th><th className="align-right">Actions</th></tr></thead><tbody>{reviews.map((review) => <tr key={review._id}><td><strong>{'*'.repeat(Math.max(0, Math.min(5, review.rating)))}</strong><small>{review.title || review.comment || 'No review text'}</small></td><td>{review.productData?.name || '-'}</td><td>{review.userData?.fullname || review.userData?.email || '-'}</td><td><span className={`admin-status admin-status--${review.status || 'pending'}`}>{statusLabel(review.status)}</span></td><td className="align-right admin-actions">{review.status === 'pending' && <><button className="icon-action icon-action--good" disabled={busy === review._id} onClick={() => void onAction(review._id, `/reviews/admin/reviews/moderate/${review._id}`, 'POST', { action: 'approve' })} title="Approve"><Check size={15} /></button><button className="icon-action icon-action--bad" disabled={busy === review._id} onClick={() => void onAction(review._id, `/reviews/admin/reviews/moderate/${review._id}`, 'POST', { action: 'reject', reason: 'Review did not meet community guidelines' })} title="Reject"><X size={15} /></button></>}</td></tr>)}</tbody></table>{!reviews.length && <div className="admin-empty">No reviews found.</div>}</div><AdminPagination page={page} pageSize={pageSize} hasNext={reviews.length === pageSize} onPageChange={onPageChange} /></section> }

function AdminUsers({ title, users, busy, onAction, sellerMode = false, page, pageSize, onPageChange }: { title: string; users: AdminUser[]; busy: string; onAction: (key: string, path: string, method?: string, payload?: unknown) => Promise<void>; sellerMode?: boolean; page: number; pageSize: number; onPageChange: (page: number) => void }) { return <section className="admin-table-panel"><div className="admin-panel__heading"><div><span className="eyebrow">People</span><h2>{title}</h2></div><span className="admin-count">{users.length} loaded</span></div><div className="admin-table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Joined</th><th>Status</th><th className="align-right">Actions</th></tr></thead><tbody>{users.map((account) => <tr key={account._id}><td><strong>{account.fullname || account.username || 'Unnamed account'}</strong><small>@{account.username || '-'}</small></td><td>{account.email}</td><td>{dateLabel(account.createdAt)}</td><td><span className={`admin-status ${account.isActive === false ? 'admin-status--cancelled' : 'admin-status--approved'}`}>{account.isActive === false ? 'inactive' : sellerMode && account.isApproved === false ? 'pending' : 'active'}</span></td><td className="align-right admin-actions">{sellerMode && account.isApproved === false && <button className="small-action" disabled={busy === account._id} onClick={() => void onAction(account._id, `/users/admin/sellers/${account._id}/approve`)}>Approve</button>}{sellerMode && <button className="small-action small-action--danger" disabled={busy === account._id} onClick={() => void onAction(account._id, `/users/admin/sellers/${account._id}/${account.isActive === false ? 'unsuspend' : 'suspend'}`)}>{account.isActive === false ? 'Unsuspend' : 'Suspend'}</button>}{account.isActive !== false ? <button className="small-action small-action--danger" disabled={busy === account._id} onClick={() => void onAction(account._id, `/users/admin/users/${account._id}/deactivate`)}>Deactivate</button> : <button className="small-action" disabled={busy === account._id} onClick={() => void onAction(account._id, `/users/admin/users/${account._id}/reactivate`)}>Reactivate</button>}</td></tr>)}</tbody></table>{!users.length && <div className="admin-empty">No accounts found.</div>}</div><AdminPagination page={page} pageSize={pageSize} hasNext={users.length === pageSize} onPageChange={onPageChange} /></section> }

function AdminOperations({ orders, banners, coupons, analytics, busy, onAction, page, pageSize, onPageChange, onDownload }: { orders: AdminOrder[]; banners: AdminBanner[]; coupons: AdminCoupon[]; analytics: Record<string, number> | null; busy: string; onAction: (key: string, path: string, method?: string, payload?: unknown) => Promise<void>; page: number; pageSize: number; onPageChange: (page: number) => void; onDownload: () => Promise<void> }) {
  const [orderId, setOrderId] = useState('')
  const [itemId, setItemId] = useState('')
  const [escalationId, setEscalationId] = useState('')
  const [escalationStatus, setEscalationStatus] = useState('resolved')
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [status, setStatus] = useState('confirmed')
  const [reason, setReason] = useState('Admin operations update')
  const [banner, setBanner] = useState({ title: '', tagline: '', imageUrl: '', redirectLink: '/', type: 'home', position: 'hero' })
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerError, setBannerError] = useState('')
  const [coupon, setCoupon] = useState({ code: '', discountType: 'percent', discountValue: '10', expiryDate: '' })
  const resolveOrderId = () => {
    const enteredId = orderId.trim().replace(/^#/, '')
    const matchingOrder = orders.find((order) => order.orderId === enteredId || order.orderId.toLowerCase().endsWith(enteredId.toLowerCase()))
    return matchingOrder?.orderId || enteredId
  }
  const submitBanner = async () => { try { setBannerError(''); let image = { url: banner.imageUrl }; if (bannerFile) { const form = new FormData(); form.append('file', bannerFile); form.append('folder', 'banners'); image = await sendForm<{ url: string }>('/upload/single', form) } await onAction('banner-create', '/banners/', 'POST', { ...banner, image }) } catch (error) { setBannerError((error as Error).message || 'Banner upload failed.') } }
  const submitCoupon = () => void onAction('coupon-create', '/carts/coupons', 'POST', { code: coupon.code.trim(), discountType: coupon.discountType, discountValue: Number(coupon.discountValue), ...(coupon.expiryDate ? { expiryDate: coupon.expiryDate } : {}) })
  return <div className="admin-operations">
    <section className="admin-panel"><div className="admin-panel__heading"><div><span className="eyebrow"><Activity size={14} /> Operations</span><h2>Store health at a glance</h2></div><button className="outline-button" onClick={() => void onDownload()}><Download size={15} /> Export orders</button></div><div className="admin-stats admin-stats--compact"><article className="admin-stat"><span><ShoppingBag size={18} /></span><small>Orders loaded</small><strong>{orders.length}</strong></article><article className="admin-stat"><span><Megaphone size={18} /></span><small>Live banners</small><strong>{banners.filter((b) => b.isActive !== false).length}</strong></article><article className="admin-stat"><span><TicketPercent size={18} /></span><small>Coupons</small><strong>{coupons.length}</strong></article><article className="admin-stat"><span><Activity size={18} /></span><small>Cart value</small><strong>{formatPrice(analytics?.totalCartValue || 0)}</strong></article></div></section>
    <div className="admin-operation-grid">
      <section className="admin-panel"><div className="admin-panel__heading"><div><span className="eyebrow">Order controls</span><h2>Update an order</h2></div></div><div className="admin-form-grid"><label>Order ID<input value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="Full ID or last 8 characters" /></label><label>New status<AdminStatusPicker value={status} onChange={setStatus} /></label></div><label>Reason<input value={reason} onChange={(event) => setReason(event.target.value)} /></label><div className="admin-button-row"><button className="primary-button" disabled={!orderId || busy === 'order-status'} onClick={() => void onAction('order-status', '/orders/admin/orders/manual-status-update', 'PATCH', { orderId: resolveOrderId(), status, reason })}>Update status</button><button className="outline-button" disabled={!orderId} onClick={async () => { try { setOrderDetails(await getJson(`/orders/admin/orders/${resolveOrderId()}`)) } catch (error) { setOrderDetails({ error: (error as Error).message || 'Order could not be loaded.' }) } }}>View order details</button></div><p className="admin-helper">You can paste the full order ID or the last 8 characters shown in the Orders table.</p></section>
      <section className="admin-panel"><div className="admin-panel__heading"><div><span className="eyebrow">Campaigns</span><h2>Create a banner</h2></div></div><div className="admin-form-grid"><label>Title<input value={banner.title} onChange={(event) => setBanner({ ...banner, title: event.target.value })} /></label><label>Tagline<input value={banner.tagline} onChange={(event) => setBanner({ ...banner, tagline: event.target.value })} /></label></div><label>Upload image<input type="file" accept="image/*" onChange={(event) => setBannerFile(event.target.files?.[0] || null)} /></label><label>Or use image URL<input value={banner.imageUrl} onChange={(event) => setBanner({ ...banner, imageUrl: event.target.value })} placeholder="Cloudinary image URL" /></label><label>Redirect link<input value={banner.redirectLink} onChange={(event) => setBanner({ ...banner, redirectLink: event.target.value })} /></label>{bannerError && <p className="admin-helper admin-helper--error">{bannerError}</p>}<button className="primary-button" disabled={!banner.title || (!banner.imageUrl && !bannerFile) || busy === 'banner-create'} onClick={() => void submitBanner()}>Publish banner</button></section>
    <section className="admin-panel"><div className="admin-panel__heading"><div><span className="eyebrow">Offers</span><h2>Create a coupon</h2></div></div><div className="admin-form-grid"><label>Code<input value={coupon.code} onChange={(event) => setCoupon({ ...coupon, code: event.target.value.toUpperCase() })} placeholder="SMART10" /></label><label>Type<AdminThemedSelect value={coupon.discountType} onChange={(discountType) => setCoupon({ ...coupon, discountType })} options={[{ value: 'percent', label: 'Percent' }, { value: 'flat', label: 'Flat' }]} ariaLabel="Coupon type" /></label></div><div className="admin-form-grid"><label>Value<input type="number" min="1" value={coupon.discountValue} onChange={(event) => setCoupon({ ...coupon, discountValue: event.target.value })} /></label><label>Expiry<AdminDatePicker value={coupon.expiryDate} onChange={(expiryDate) => setCoupon({ ...coupon, expiryDate })} /></label></div><button className="primary-button" disabled={!coupon.code || busy === 'coupon-create'} onClick={submitCoupon}>Create coupon</button></section>
    </div>
    <section className="admin-table-panel"><div className="admin-panel__heading"><div><span className="eyebrow">Live controls</span><h2>Existing campaigns and offers</h2></div></div><div className="admin-table-wrap"><table><thead><tr><th>Type</th><th>Name/code</th><th>Placement/value</th><th>Status</th><th className="align-right">Actions</th></tr></thead><tbody>{banners.map((item) => <tr key={item._id}><td>Banner</td><td><strong>{item.title || 'Untitled banner'}</strong><small>{item.tagline || item.image?.url || '-'}</small></td><td>{item.position || '-'}  -  {item.type || '-'}</td><td><span className={`admin-status ${item.isActive === false ? 'admin-status--cancelled' : 'admin-status--approved'}`}>{item.isActive === false ? 'inactive' : 'active'}</span></td><td className="align-right admin-actions"><button className="small-action small-action--danger" disabled={busy === item._id} onClick={() => void onAction(item._id, `/banners/${item._id}`, item.isActive === false ? 'PUT' : 'DELETE', item.isActive === false ? { isActive: true } : undefined)}>{item.isActive === false ? 'Enable' : 'Disable'}</button></td></tr>)}{coupons.map((item) => <tr key={item._id}><td>Coupon</td><td><strong>{item.code}</strong><small>{item.expiryDate ? `Expires ${dateLabel(item.expiryDate)}` : 'No expiry'}</small></td><td>{item.discountValue} {item.discountType}</td><td><span className={`admin-status ${item.isActive === false ? 'admin-status--cancelled' : 'admin-status--approved'}`}>{item.isActive === false ? 'inactive' : 'active'}</span></td><td className="align-right admin-actions"><button className="small-action" disabled={busy === item._id} onClick={() => void onAction(item._id, `/carts/coupons/${item._id}`, 'PUT', { isActive: item.isActive === false })}>{item.isActive === false ? 'Enable' : 'Disable'}</button></td></tr>)}</tbody></table>{!banners.length && !coupons.length && <div className="admin-empty">No campaigns or coupons found.</div>}</div><AdminPagination page={page} pageSize={pageSize} hasNext={banners.length === pageSize || coupons.length === pageSize} onPageChange={onPageChange} /></section>
    <section className="admin-panel"><div className="admin-panel__heading"><div><span className="eyebrow">Support decisions</span><h2>Refunds, returns & escalations</h2></div></div><div className="admin-form-grid"><label>Order ID<input value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="Full ID or last 8 characters" /></label><label>Item ID<input value={itemId} onChange={(event) => setItemId(event.target.value)} /></label></div><label>Reason / comment<input value={reason} onChange={(event) => setReason(event.target.value)} /></label><div className="admin-button-row"><button className="outline-button" disabled={!orderId || !itemId} onClick={() => void onAction('return-approve', '/orders/admin/returns/approve', 'POST', { orderId: resolveOrderId(), itemId, decision: 'approved', reason })}>Approve return</button><button className="outline-button" disabled={!orderId || !itemId} onClick={() => void onAction('refund-approve', '/orders/admin/refunds/approve', 'POST', { orderId: resolveOrderId(), itemId })}>Process refund</button></div><div className="admin-form-grid"><label>Escalation ID<input value={escalationId} onChange={(event) => setEscalationId(event.target.value)} /></label><label>Escalation status<AdminThemedSelect value={escalationStatus} onChange={setEscalationStatus} options={[{ value: 'in_progress', label: 'In progress' }, { value: 'resolved', label: 'Resolved' }, { value: 'rejected', label: 'Rejected' }]} ariaLabel="Escalation status" /></label></div><button className="outline-button" disabled={!escalationId} onClick={() => void onAction('escalation', '/orders/admin/escalations/handle', 'PATCH', { escalationId, status: escalationStatus, comment: reason })}>{escalationStatus === 'resolved' ? 'Resolve escalation' : 'Update escalation'}</button></section>
    {orderDetails && <AdminOrderDetailsDrawer details={orderDetails} onClose={() => setOrderDetails(null)} />}
  </div>
}

function AdminOrderDetailsDrawer({ details, onClose }: { details: any; onClose: () => void }) {
  const address = details.shippingAddress || {}
  const payment = details.payment || {}
  const pricing = details.pricing || {}
  const addressLine = [address.addressLine, address.city, address.state, address.pincode || address.postalCode].filter(Boolean).join(', ')
  return <div className="admin-drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><aside className="admin-order-drawer" role="dialog" aria-modal="true" aria-label="Order details"><div className="admin-order-drawer__header"><div><span className="eyebrow">Order details</span><h2>#{String(details.orderId || '').slice(-8).toUpperCase()}</h2></div><button type="button" className="icon-action" onClick={onClose} aria-label="Close order details"><X size={18} /></button></div><div className="admin-order-drawer__status"><span className={`admin-status admin-status--${details.orderStatus || 'pending'}`}>{statusLabel(details.orderStatus)}</span><span>{dateLabel(details.createdAt)}</span></div><div className="admin-detail-grid"><section><span className="eyebrow">Customer</span><strong>{details.customer?.name || 'Customer'}</strong><small>{details.customer?.email || 'Email unavailable'}</small><small>{details.customer?.phone || 'Phone unavailable'}</small></section><section><span className="eyebrow">Delivering to</span><strong>{address.fullName || details.customer?.name || 'Shipping address'}</strong><small>{addressLine || 'Address unavailable'}</small><small>{address.mobile || details.customer?.phone || ''}</small></section><section><span className="eyebrow">Payment</span><strong>{payment.method || 'Payment method unavailable'}</strong><small>Status: {statusLabel(payment.status)}</small><small>{payment.transactionId ? `Transaction: ${payment.transactionId}` : 'Transaction ID unavailable'}</small></section><section><span className="eyebrow">Amount</span><strong>{formatPrice(pricing.finalAmount || 0)}</strong><small>Subtotal {formatPrice(pricing.subtotal || 0)}</small><small>Discount {formatPrice(pricing.discount || 0)}</small><small>Delivery {formatPrice(pricing.deliveryCharge || 0)}</small></section></div><section className="admin-drawer-section"><div className="admin-panel__heading"><div><span className="eyebrow">Items</span><h3>Products in this order</h3></div><span className="admin-count">{details.items?.length || 0}</span></div><div className="admin-drawer-items">{(details.items || []).map((item: any) => <article key={String(item.itemId)}><div className="admin-drawer-item__image">{item.product?.image?.url || item.product?.image ? <img src={item.product.image.url || item.product.image} alt="" /> : <Package size={19} />}</div><div className="admin-drawer-item__body"><strong>{item.product?.name || 'Product unavailable'}</strong><small>{item.seller?.name || 'Seller unavailable'}  -  Qty {item.quantity || 0}</small><span>{formatPrice(item.total || 0)}</span><div className="admin-drawer-item__statuses"><span>{statusLabel(item.fulfillmentStatus)}</span><span>Return: {statusLabel(item.returnStatus)}</span><span>Refund: {statusLabel(item.refundStatus)}</span></div></div></article>)}</div></section>{details.statusHistory?.length > 0 && <section className="admin-drawer-section"><div className="admin-panel__heading"><div><span className="eyebrow">Timeline</span><h3>Status history</h3></div></div><div className="admin-timeline">{[...details.statusHistory].reverse().map((entry: any, index: number) => <div key={`${entry.updatedAt || entry.status}-${index}`}><span className="admin-timeline__dot" /><div><strong>{statusLabel(entry.status)}</strong><small>{dateLabel(entry.updatedAt)}{entry.comment ? `  -  ${entry.comment}` : ''}</small></div></div>)}</div></section>}<section className="admin-drawer-section"><div className="admin-panel__heading"><div><span className="eyebrow">Shipment</span><h3>Tracking information</h3></div></div>{(details.items || []).some((item: any) => item.shipment?.trackingNumber) ? <div className="admin-shipment-list">{details.items.filter((item: any) => item.shipment?.trackingNumber).map((item: any) => <div key={String(item.itemId)}><strong>{item.shipment.courierName || 'Courier'}</strong><span>{item.shipment.trackingNumber}</span></div>)}</div> : <p className="admin-helper">Tracking details will appear after the order is shipped.</p>}</section></aside></div>
}

function AdminInfoCard({ label, value }: { label: string; value: unknown }) {
  const text = value === null || value === undefined || value === '' ? '-' : String(value)
  return <div className="admin-info-card"><span>{label}</span><strong title={text}>{text}</strong></div>
}

function ReviewAnalyticsSummary({ data }: { data: any }) {
  const summary = data?.summary || {}
  const rating = data?.rating || {}
  const breakdown = rating.starBreakdown || {}
  return <div className="admin-readable-details">
    <div className="admin-readable-grid">
      <AdminInfoCard label="Total reviews" value={summary.totalReviews} />
      <AdminInfoCard label="Pending" value={summary.pending} />
      <AdminInfoCard label="Approved" value={summary.approved} />
      <AdminInfoCard label="Rejected" value={summary.rejected} />
      <AdminInfoCard label="Deleted" value={summary.deleted} />
      <AdminInfoCard label="Average rating" value={rating.avgRating ? `${Number(rating.avgRating).toFixed(1)} / 5` : '-'} />
    </div>
    <div className="admin-readable-section"><span className="eyebrow">Rating distribution</span>{[5, 4, 3, 2, 1].map((star) => <div className="admin-rating-row" key={star}><span>{star} star</span><div><i style={{ width: `${summary.totalReviews ? Math.min(100, (Number(breakdown[String(star)] || 0) / Number(summary.totalReviews)) * 100) : 0}%` }} /></div><strong>{breakdown[String(star)] || 0}</strong></div>)}</div>
  </div>
}

function CategoryDetailsSummary({ data }: { data: any }) {
  const parent = typeof data?.parent === 'object' ? data.parent?.name : data?.parent
  const image = data?.image?.url || data?.bannerImage?.url
  return <div className="admin-readable-details">
    {image && <img className="admin-category-preview" src={image} alt={data?.name || 'Category'} />}
    <div className="admin-readable-grid">
      <AdminInfoCard label="Category ID" value={data?._id} />
      <AdminInfoCard label="Name" value={data?.name} />
      <AdminInfoCard label="Slug" value={data?.slug} />
      <AdminInfoCard label="Parent" value={parent || 'Top level'} />
      <AdminInfoCard label="Level" value={data?.level} />
      <AdminInfoCard label="Products" value={data?.products ?? data?.productCount ?? 0} />
      <AdminInfoCard label="Status" value={data?.status} />
      <AdminInfoCard label="Active" value={data?.isActive === undefined ? '-' : data.isActive ? 'Yes' : 'No'} />
      <AdminInfoCard label="Featured" value={data?.isFeatured === undefined ? '-' : data.isFeatured ? 'Yes' : 'No'} />
      <AdminInfoCard label="Display order" value={data?.displayOrder} />
      <AdminInfoCard label="Tagline" value={data?.tagline} />
      <AdminInfoCard label="Tags" value={Array.isArray(data?.tags) ? data.tags.join(', ') : data?.tags} />
    </div>
    <div className="admin-readable-section"><span className="eyebrow">Description</span><p>{data?.description || 'No description available.'}</p></div>
  </div>
}

function AdminAdvanced({ busy, onAction, categories, products }: { busy: string; onAction: (key: string, path: string, method?: string, payload?: unknown) => Promise<void>; categories: AdminCategory[]; products: AdminProduct[] }) {
  const [categoryId, setCategoryId] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const [categoryImageUrl, setCategoryImageUrl] = useState('')
  const [categoryFile, setCategoryFile] = useState<File | null>(null)
  const [categoryError, setCategoryError] = useState('')
  const [bulkCategoryIds, setBulkCategoryIds] = useState('')
  const [bulkCategoryStatus, setBulkCategoryStatus] = useState('approved')
  const [categoryData, setCategoryData] = useState<any>(null)
  const [productId, setProductId] = useState('')
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productStock, setProductStock] = useState('')
  const [bulkProductIds, setBulkProductIds] = useState('')
  const [reviewId, setReviewId] = useState('')
  const [reviewData, setReviewData] = useState<any>(null)
  const [categoryStats, setCategoryStats] = useState<Array<{ name?: string; totalProducts?: number; activeProducts?: number }>>([])
  const [categoryStatsPage, setCategoryStatsPage] = useState(1)
  const [reviewAnalytics, setReviewAnalytics] = useState<Record<string, unknown> | null>(null)
  const [auditLogs, setAuditLogs] = useState<Array<{ orderId?: string; action?: string; role?: string; comment?: string; timestamp?: string }>>([])
  const [sellerPerformance, setSellerPerformance] = useState<any>(null)
  const [couponAnalytics, setCouponAnalytics] = useState<any>(null)
  const [broadcast, setBroadcast] = useState({ title: '', message: '', role: 'customer' })
  const [permissionUserId, setPermissionUserId] = useState('')
  const [permissions, setPermissions] = useState(['manage_catalog', 'manage_orders', 'manage_customers', 'manage_content'])
  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState('')

  const resolveId = (value: string, records: Array<{ _id: string }>) => {
    const entered = value.trim().replace(/^#/, '').toLowerCase()
    const match = records.find((record) => record._id.toLowerCase() === entered || record._id.toLowerCase().endsWith(entered))
    return match?._id || entered
  }
  const resolveIds = (value: string, records: Array<{ _id: string }>) => value.split(',').map((id) => resolveId(id, records)).filter(Boolean)
  const requireValue = (value: string, message: string) => {
    if (!value.trim()) { setValidationError(message); return false }
    setValidationError('')
    return true
  }

  const saveCategory = async (mode: 'create' | 'update') => {
    try {
      setCategoryError('')
      let image: { url?: string; public_id?: string } | undefined
      if (categoryFile) {
        const form = new FormData()
        form.append('file', categoryFile)
        form.append('folder', 'categories')
        image = await sendForm<{ url: string; public_id?: string }>('/upload/single', form)
      }
      const payload = { name: categoryName, description: categoryDescription, ...(!image && categoryImageUrl.trim() ? { image: { url: categoryImageUrl.trim() } } : {}), ...(image ? { image } : {}) }
      await onAction(`category-${mode}`, mode === 'create' ? '/categories/admin/create' : `/categories/admin/update/${resolveId(categoryId, categories)}`, mode === 'create' ? 'POST' : 'PATCH', payload)
    } catch (error) { setCategoryError((error as Error).message || 'Category image upload failed.') }
  }

  const loadAdvanced = async () => {
    setLoading(true)
    const [categoryResult, reviewResult, auditResult, sellerResult, couponResult] = await Promise.allSettled([
      getJson<Array<{ name?: string; totalProducts?: number; activeProducts?: number }>>('/categories/admin/statistics'),
      getJson<Record<string, unknown>>('/reviews/admin/reviews/analytics'),
      getJson<{ logs?: Array<{ orderId?: string; action?: string; role?: string; comment?: string; timestamp?: string }> }>('/orders/admin/audit-logs?limit=50'),
      getJson('/admin-controls/seller-performance?days=30&commissionRate=10'),
      getJson('/admin-controls/coupon-analytics'),
    ])
    if (categoryResult.status === 'fulfilled') { setCategoryStats(categoryResult.value); setCategoryStatsPage(1) }
    if (reviewResult.status === 'fulfilled') setReviewAnalytics(reviewResult.value)
    if (auditResult.status === 'fulfilled') setAuditLogs(auditResult.value.logs || [])
    if (sellerResult.status === 'fulfilled') setSellerPerformance(sellerResult.value)
    if (couponResult.status === 'fulfilled') setCouponAnalytics(couponResult.value)
    setLoading(false)
  }

  useEffect(() => { void loadAdvanced() }, [])

  return <div className="admin-operations">
    <section className="admin-panel"><div className="admin-panel__heading"><div><span className="eyebrow">Advanced controls</span><h2>Catalog administration</h2></div><button className="outline-button" onClick={() => void loadAdvanced()} disabled={loading}><RefreshCw size={15} className={loading ? 'admin-spin' : ''} /> Refresh analytics</button></div><div className="admin-operation-grid">
      <div><h3>Category editor</h3><label>Category ID<input value={categoryId} onChange={(event) => { setCategoryId(event.target.value); setValidationError('') }} placeholder="Full ID or #last 8" /></label><label>Name<input value={categoryName} onChange={(event) => { setCategoryName(event.target.value); setValidationError('') }} /></label><label>Description<input value={categoryDescription} onChange={(event) => setCategoryDescription(event.target.value)} /></label><label>Category image<input type="file" accept="image/*" onChange={(event) => setCategoryFile(event.target.files?.[0] || null)} /></label><label>Or image URL<input value={categoryImageUrl} onChange={(event) => setCategoryImageUrl(event.target.value)} placeholder="Cloudinary image URL" /></label>{categoryError && <p className="admin-helper admin-helper--error">{categoryError}</p>}<div className="admin-button-row"><button className="primary-button" onClick={() => { if (requireValue(categoryName, 'Enter a category name before creating.')) void saveCategory('create') }}>Create</button><button className="outline-button" onClick={() => { if (!requireValue(categoryId, 'Enter a category ID before updating.')) return; if (!categoryName && !categoryDescription && !categoryImageUrl && !categoryFile) { setValidationError('Add at least one category field to update.'); return } void saveCategory('update') }}>Update</button><button className="small-action small-action--danger" onClick={() => { if (requireValue(categoryId, 'Enter a category ID before deleting.')) void onAction('category-delete', `/categories/admin/delete/${resolveId(categoryId, categories)}`, 'DELETE') }}>Delete</button><button className="small-action" onClick={() => { if (requireValue(categoryId, 'Enter a category ID before restoring.')) void onAction('category-restore', `/categories/admin/restore/${resolveId(categoryId, categories)}`, 'PATCH') }}>Restore</button></div>{validationError && <p className="admin-helper admin-helper--error">{validationError}</p>}</div>
      <div><h3>Product editor</h3><label>Product ID<input value={productId} onChange={(event) => { setProductId(event.target.value); setValidationError('') }} placeholder="Full ID or #last 8" /></label><label>Name<input value={productName} onChange={(event) => setProductName(event.target.value)} /></label><div className="admin-form-grid"><label>Price<input value={productPrice} onChange={(event) => setProductPrice(event.target.value)} type="number" /></label><label>Stock<input value={productStock} onChange={(event) => setProductStock(event.target.value)} type="number" /></label></div><div className="admin-button-row"><button className="primary-button" onClick={() => { if (requireValue(productId, 'Enter a product ID before saving.')) void onAction('product-moderate', `/products/products/${resolveId(productId, products)}/moderate`, 'POST', { name: productName || undefined, price: productPrice || undefined, stock: productStock === '' ? undefined : Number(productStock) }) }}>Save product</button><button className="outline-button" onClick={() => { if (requireValue(productId, 'Enter a product ID before activating.')) void onAction('product-toggle', `/products/product/${resolveId(productId, products)}/toggle-status`, 'POST', { isActive: true }) }}>Activate</button></div></div>
      <div><h3>Bulk product moderation</h3><label>Product IDs<input value={bulkProductIds} onChange={(event) => { setBulkProductIds(event.target.value); setValidationError('') }} placeholder="Comma-separated IDs or #last 8" /></label><div className="admin-button-row"><button className="primary-button" onClick={() => { if (requireValue(bulkProductIds, 'Enter at least one product ID before approving.')) void onAction('products-bulk-approve', '/products/products/bulk-moderate', 'POST', { ids: resolveIds(bulkProductIds, products), action: 'approve' }) }}>Approve selected</button><button className="small-action small-action--danger" onClick={() => { if (requireValue(bulkProductIds, 'Enter at least one product ID before rejecting.')) void onAction('products-bulk-reject', '/products/products/bulk-moderate', 'POST', { ids: resolveIds(bulkProductIds, products), action: 'reject', reason: 'Admin moderation decision' }) }}>Reject selected</button></div><h3 className="admin-subheading">Bulk category status</h3><label>Category IDs<input value={bulkCategoryIds} onChange={(event) => { setBulkCategoryIds(event.target.value); setValidationError('') }} placeholder="Comma-separated IDs or #last 8" /></label><div className="admin-button-row"><AdminThemedSelect value={bulkCategoryStatus} onChange={setBulkCategoryStatus} ariaLabel="Bulk category status" options={[{ value: 'approved', label: 'Approved' }, { value: 'pending', label: 'Pending' }, { value: 'rejected', label: 'Rejected' }]} /><button className="outline-button" onClick={() => { if (requireValue(bulkCategoryIds, 'Enter at least one category ID before updating.')) void onAction('categories-bulk-update', '/categories/admin/bulk-update', 'PATCH', { categoryIds: resolveIds(bulkCategoryIds, categories), status: bulkCategoryStatus }) }}>Update selected</button></div>{validationError && <p className="admin-helper admin-helper--error">{validationError}</p>}</div>
    </div></section>
    <section className="admin-operation-grid"><section className="admin-panel"><div className="admin-panel__heading"><div><span className="eyebrow">Review intelligence</span><h2>Review analytics & details</h2></div></div><label>Review ID<input value={reviewId} onChange={(event) => setReviewId(event.target.value)} /></label><div className="admin-button-row"><button className="outline-button" disabled={!reviewId} onClick={async () => { try { setReviewData(await getJson(`/reviews/admin/reviews/view/${reviewId}`)) } catch { setReviewData({ error: 'Review could not be loaded.' }) } }}>View review</button><button className="small-action" disabled={!reviewId || busy === 'review-unfeature'} onClick={() => void onAction('review-unfeature', `/reviews/admin/reviews/feature/${reviewId}`, 'PATCH', { featured: false })}>Unfeature</button></div>{reviewData && <p className="admin-helper admin-helper--error">Review details loaded. Use the review table for the full record.</p>}<ReviewAnalyticsSummary data={reviewAnalytics} /></section><section className="admin-panel"><div className="admin-panel__heading"><div><span className="eyebrow">Category detail</span><h2>Inspect category</h2></div></div><label>Category ID<input value={categoryId} onChange={(event) => setCategoryId(event.target.value)} placeholder="Full ID or #last 8" /></label><button className="outline-button" disabled={!categoryId} onClick={async () => { try { setCategoryData(await getJson(`/categories/admin/view/${resolveId(categoryId, categories)}`)) } catch { setCategoryData({ error: 'Category could not be loaded.' }) } }}>View category</button>{categoryData && <CategoryDetailsSummary data={categoryData} />}</section><section className="admin-panel"><div className="admin-panel__heading"><div><span className="eyebrow">Account recovery</span><h2>Reset customer cart</h2></div></div><label>Customer ID<input id="admin-customer-cart-id" placeholder="Customer user ID" /></label><button className="outline-button" onClick={() => { const input = document.getElementById('admin-customer-cart-id') as HTMLInputElement | null; if (input?.value) void onAction('cart-reset', `/carts/cart/reset/${input.value}`, 'PUT') }}>Reset cart</button><p className="admin-helper">Use this only when a customer reports a stuck or corrupted cart.</p></section></section>
    <section className="admin-table-panel"><div className="admin-panel__heading"><div><span className="eyebrow">Audit trail</span><h2>Recent admin activity</h2></div><span className="admin-count">{auditLogs.length} logs</span></div><div className="admin-table-wrap"><table><thead><tr><th>Order</th><th>Action</th><th>Role</th><th>Comment</th><th>Date</th></tr></thead><tbody>{auditLogs.map((log, index) => <tr key={`${log.orderId}-${index}`}><td>{log.orderId ? `#${String(log.orderId).slice(-8).toUpperCase()}` : '-'}</td><td>{statusLabel(log.action)}</td><td>{log.role || '-'}</td><td>{log.comment || '-'}</td><td>{dateLabel(log.timestamp)}</td></tr>)}</tbody></table>{!auditLogs.length && <div className="admin-empty">No audit logs found.</div>}</div></section>
    <section className="admin-table-panel"><div className="admin-panel__heading"><div><span className="eyebrow">Category analytics</span><h2>Products by category</h2></div><span className="admin-count">{categoryStats.length} categories</span></div><div className="admin-table-wrap"><table><thead><tr><th>Category</th><th>Products</th><th>Active</th></tr></thead><tbody>{categoryStats.slice((categoryStatsPage - 1) * 10, categoryStatsPage * 10).map((item, index) => <tr key={`${item.name}-${index}`}><td><strong>{item.name || '-'}</strong></td><td>{item.totalProducts || 0}</td><td>{item.activeProducts || 0}</td></tr>)}</tbody></table>{!categoryStats.length && <div className="admin-empty">No category analytics found.</div>}</div>{categoryStats.length > 0 && <AdminPagination page={categoryStatsPage} pageSize={10} hasNext={categoryStatsPage * 10 < categoryStats.length} onPageChange={setCategoryStatsPage} />}</section>
    <section className="admin-operation-grid admin-insights-grid"><section className="admin-panel admin-insight-panel"><div className="admin-panel__heading"><div><span className="eyebrow">Commercial health</span><h3>Seller performance</h3></div><span className="admin-insight-icon">₹</span></div><p className="admin-helper">Last 30 days · commission estimate</p>{(sellerPerformance?.sellers || []).slice(0, 8).map((seller: any) => <div className="admin-insight-row" key={String(seller.sellerId)}><div className="admin-insight-row__identity"><span className="admin-avatar">{String(seller.name || seller.email || 'S').slice(0, 1).toUpperCase()}</span><div><strong>{seller.name || seller.email || 'Seller'}</strong><small>{seller.units || 0} units · {seller.orders || 0} orders</small></div></div><div className="admin-insight-row__metrics"><div className="admin-insight-row__metric"><small>Sales</small><strong>{formatPrice(seller.sales || 0)}</strong></div><div className="admin-insight-row__metric"><small>Commission</small><strong>{formatPrice(seller.commission || 0)}</strong></div></div></div>)}{!(sellerPerformance?.sellers || []).length && <div className="admin-insight-empty">No seller performance data yet.</div>}</section><section className="admin-panel admin-insight-panel"><div className="admin-panel__heading"><div><span className="eyebrow">Offer health</span><h3>Coupon usage</h3></div><span className="admin-insight-icon">%</span></div><p className="admin-helper">{couponAnalytics?.totalUses || 0} total redemptions</p>{(couponAnalytics?.coupons || []).slice(0, 8).map((coupon: any) => <div className="admin-insight-row admin-insight-row--coupon" key={coupon._id}><div className="admin-insight-row__identity"><span className="admin-coupon-icon">%</span><div><strong>{coupon.code}</strong><small>{coupon.usageCount || 0} redemptions</small></div></div><span className={`admin-status ${coupon.isActive ? 'admin-status--approved' : 'admin-status--cancelled'}`}>{coupon.isActive ? 'Active' : 'Inactive'}</span></div>)}{!(couponAnalytics?.coupons || []).length && <div className="admin-insight-empty">No coupon usage data yet.</div>}</section></section>
    <section className="admin-panel"><div className="admin-panel__heading"><div><span className="eyebrow">Customer communication</span><h2>Broadcast notification</h2></div></div><div className="admin-form-grid"><label>Title<input value={broadcast.title} onChange={(event) => { setBroadcast({ ...broadcast, title: event.target.value }); setValidationError('') }} /></label><label>Audience<AdminThemedSelect value={broadcast.role} onChange={(role) => setBroadcast({ ...broadcast, role })} options={[{ value: 'customer', label: 'Customers' }, { value: 'seller', label: 'Sellers' }, { value: 'admin', label: 'Admins' }]} ariaLabel="Broadcast audience" /></label></div><label>Message<input value={broadcast.message} onChange={(event) => { setBroadcast({ ...broadcast, message: event.target.value }); setValidationError('') }} /></label><button className="primary-button" onClick={() => { if (!requireValue(broadcast.title, 'Enter a broadcast title.')) return; if (!requireValue(broadcast.message, 'Enter a broadcast message.')) return; void onAction('broadcast', '/admin-controls/broadcast', 'POST', broadcast) }}>Send broadcast</button>{validationError && <p className="admin-helper admin-helper--error">{validationError}</p>}</section>
    <section className="admin-panel"><div className="admin-panel__heading"><div><span className="eyebrow">Access control</span><h2>Admin permissions</h2></div></div><label>User ID<input value={permissionUserId} onChange={(event) => { setPermissionUserId(event.target.value); setValidationError('') }} placeholder="Admin user ID" /></label><div className="admin-permission-grid">{['manage_catalog', 'manage_orders', 'manage_customers', 'manage_content', 'manage_settings', 'manage_broadcasts'].map((permission) => <label className="admin-toggle" key={permission}><input type="checkbox" checked={permissions.includes(permission)} onChange={(event) => setPermissions((current) => event.target.checked ? [...new Set([...current, permission])] : current.filter((item) => item !== permission))} /> {permission.replace('manage_', 'Manage ')}</label>)}</div><button className="primary-button" onClick={() => { if (requireValue(permissionUserId, 'Enter an admin user ID.')) void onAction('permissions', `/admin-controls/permissions/${permissionUserId}`, 'PATCH', { permissions }) }}>Save permissions</button><p className="admin-helper">Use the user ID of an existing admin account. This does not create new admins.</p>{validationError && <p className="admin-helper admin-helper--error">{validationError}</p>}</section>
  </div>
}

function AdminStorefrontSettings({ onMessage }: { onMessage: (message: string) => void }) {
  const { refresh: refreshPublicSettings } = useSiteSettings()
  const [settings, setSettings] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  useEffect(() => { getJson('/site-settings/admin').then(setSettings).catch((error: Error) => onMessage(error.message)) }, [onMessage])
  if (!settings) return <div className="admin-loading">Loading storefront settings...</div>
  const update = (group: string, key: string, value: unknown) => setSettings((current: any) => ({ ...current, [group]: { ...current[group], [key]: value } }))
  const save = async () => { setSaving(true); try { await sendJson('/site-settings/admin', 'PATCH', settings); await refreshPublicSettings(); onMessage('Storefront settings saved successfully.') } catch (error) { onMessage((error as Error).message) } finally { setSaving(false) } }
  const sections = [...(settings.homepage?.sections || [])].sort((a: any, b: any) => a.order - b.order)
  const moveSection = (key: string, direction: -1 | 1) => setSettings((current: any) => { const ordered = [...(current.homepage?.sections || [])].sort((a: any, b: any) => a.order - b.order); const index = ordered.findIndex((item: any) => item.key === key); const target = index + direction; if (index < 0 || target < 0 || target >= ordered.length) return current; [ordered[index], ordered[target]] = [ordered[target], ordered[index]]; return { ...current, homepage: { ...current.homepage, sections: ordered.map((item: any, itemIndex: number) => ({ ...item, order: itemIndex })) } } })
  return <section className="admin-settings"><div className="admin-panel__heading"><div><span className="eyebrow">Store control</span><h2>Manage the storefront without code</h2></div><button className="primary-button" onClick={() => void save()} disabled={saving}>{saving ? 'Saving...' : 'Save settings'}</button></div><div className="admin-settings-grid"><section className="admin-panel"><h3>Announcement bar</h3><label>Message<input value={settings.announcement?.text || ''} onChange={(event) => update('announcement', 'text', event.target.value)} /></label><label>Offer code<input value={settings.announcement?.code || ''} onChange={(event) => update('announcement', 'code', event.target.value)} /></label><label className="admin-toggle"><input type="checkbox" checked={settings.announcement?.enabled !== false} onChange={(event) => update('announcement', 'enabled', event.target.checked)} /> Show announcement bar</label></section><section className="admin-panel"><h3>Brand & contact</h3><label>Logo URL<input value={settings.brand?.logoUrl || ''} onChange={(event) => update('brand', 'logoUrl', event.target.value)} placeholder="Cloudinary URL" /></label><label>Favicon URL<input value={settings.brand?.faviconUrl || ''} onChange={(event) => update('brand', 'faviconUrl', event.target.value)} placeholder="Cloudinary URL" /></label><label>Support email<input value={settings.brand?.email || ''} onChange={(event) => update('brand', 'email', event.target.value)} /></label><label>Phone<input value={settings.brand?.phone || ''} onChange={(event) => update('brand', 'phone', event.target.value)} /></label></section><section className="admin-panel"><h3>Theme</h3><div className="admin-form-grid"><label>Primary color<input type="color" value={settings.theme?.primaryColor || '#7b421f'} onChange={(event) => update('theme', 'primaryColor', event.target.value)} /></label><label>Accent color<input type="color" value={settings.theme?.accentColor || '#b9622f'} onChange={(event) => update('theme', 'accentColor', event.target.value)} /></label></div><label>Background color<input type="color" value={settings.theme?.backgroundColor || '#fbf7f1'} onChange={(event) => update('theme', 'backgroundColor', event.target.value)} /></label></section><section className="admin-panel"><h3>Features</h3>{Object.entries(settings.features || {}).map(([key, value]) => <label className="admin-toggle" key={key}><input type="checkbox" checked={Boolean(value)} onChange={(event) => update('features', key, event.target.checked)} /> {key.replace(/([A-Z])/g, ' $1')}</label>)}</section></div><section className="admin-panel"><div className="admin-panel__heading"><div><span className="eyebrow">Homepage builder</span><h2>Show, hide or reorder sections</h2></div></div><div className="admin-section-list">{sections.map((section: any, index: number) => <div className="admin-section-row" key={section.key}><span>{section.label || section.key}</span><div className="admin-section-actions"><button type="button" className="small-action" disabled={index === 0} onClick={() => moveSection(section.key, -1)}>â†‘</button><button type="button" className="small-action" disabled={index === sections.length - 1} onClick={() => moveSection(section.key, 1)}>â†“</button><input type="checkbox" checked={section.enabled !== false} onChange={(event) => setSettings((current: any) => ({ ...current, homepage: { ...current.homepage, sections: current.homepage.sections.map((item: any) => item.key === section.key ? { ...item, enabled: event.target.checked } : item) } }))} /></div></div>)}</div></section></section>
}






