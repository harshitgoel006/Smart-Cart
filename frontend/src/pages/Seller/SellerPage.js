import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Check, ChevronRight, Package, Plus, Reply, Store, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { getJson, sendForm, sendJson } from '../../services/apiClient';
import { formatPrice, productImage } from '../../utils/formatters';
import { SimpleAccountPage } from '../../components/ui/EmptyState/SimpleAccountPage';
const statuses = ['pending', 'processing', 'shipped', 'delivered'];
export function SellerPage() {
    const { user, loading } = useAuth();
    const [tab, setTab] = useState('overview');
    const [message, setMessage] = useState('');
    const [busy, setBusy] = useState('');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [profile, setProfile] = useState(null);
    const [showProductForm, setShowProductForm] = useState(false);
    const [productForm, setProductForm] = useState({ name: '', description: '', brand: '', price: '', stock: '', category: '', images: null });
    const loadProducts = async () => { const data = await getJson('/products/seller/products?page=1&limit=50&sort=newest'); setProducts(data.products || []); };
    const loadOrders = async () => { const data = await getJson('/orders/seller/orders?page=1&limit=50'); setOrders(data.orders || []); };
    const loadReviews = async () => { const data = await getJson('/reviews/seller/reviews?page=1&limit=50'); setReviews(data.reviews || []); };
    const loadCategories = async () => { const data = await getJson('/categories/seller/list'); setCategories(Array.isArray(data) ? data : []); };
    const loadAll = async () => {
        setBusy('load');
        setMessage('');
        const results = await Promise.allSettled([
            loadProducts(), loadOrders(), loadReviews(), loadCategories(),
            getJson('/orders/seller/sales-analytics'), getJson('/users/seller/profile'),
        ]);
        if (results[4].status === 'fulfilled')
            setAnalytics(results[4].value);
        if (results[5].status === 'fulfilled')
            setProfile(results[5].value);
        const failed = results.filter((result) => result.status === 'rejected').length;
        if (failed)
            setMessage('Some seller data could not be loaded. Refresh once the server is ready.');
        setBusy('');
    };
    useEffect(() => { if (user?.role === 'seller')
        void loadAll(); }, [user]);
    const submitProduct = async (event) => {
        event.preventDefault();
        setBusy('product');
        setMessage('');
        try {
            const form = new FormData();
            Object.entries(productForm).forEach(([key, value]) => { if (key !== 'images' && value)
                form.append(key, value); });
            if (productForm.images)
                Array.from(productForm.images).forEach((file) => form.append('images', file));
            await sendForm('/products/create', form);
            setProductForm({ name: '', description: '', brand: '', price: '', stock: '', category: '', images: null });
            setShowProductForm(false);
            setMessage('Product submitted for admin approval.');
            await loadProducts();
        }
        catch (error) {
            setMessage(error.message);
        }
        finally {
            setBusy('');
        }
    };
    const updateStock = async (product) => {
        const value = window.prompt('Enter new stock quantity', String(product.stock || 0));
        if (value === null)
            return;
        setBusy(product._id);
        try {
            await sendJson(`/products/product/${product._id}/stock`, 'PATCH', { stock: Number(value) });
            await loadProducts();
            setMessage('Stock updated.');
        }
        catch (error) {
            setMessage(error.message);
        }
        finally {
            setBusy('');
        }
    };
    const updateOrder = async (order, status) => {
        setBusy(order.itemId);
        setMessage('');
        try {
            const tracking = status === 'shipped' ? { courierName: order.shipment?.courierName || window.prompt('Courier name') || '', trackingNumber: order.shipment?.trackingNumber || window.prompt('Tracking number') || '' } : undefined;
            await sendJson('/orders/seller/orders/update-status', 'PATCH', { orderId: order.orderId, itemId: order.itemId, status, ...(tracking ? { tracking } : {}) });
            await loadOrders();
            setMessage('Order status updated.');
        }
        catch (error) {
            setMessage(error.message);
        }
        finally {
            setBusy('');
        }
    };
    const replyReview = async (review) => {
        const reply = window.prompt('Write your reply to this review');
        if (!reply?.trim())
            return;
        setBusy(review._id);
        try {
            await sendJson(`/reviews/seller/reviews/${review._id}/reply`, 'POST', { message: reply.trim() });
            await loadReviews();
            setMessage('Reply posted.');
        }
        catch (error) {
            setMessage(error.message);
        }
        finally {
            setBusy('');
        }
    };
    const totals = useMemo(() => ({ products: products.length, pending: products.filter((item) => item.approvalStatus === 'pending').length, orders: orders.length, revenue: analytics?.summary?.totalRevenue || 0 }), [products, orders, analytics]);
    if (loading)
        return _jsx("main", { className: "section empty-page", children: _jsx("h1", { children: "Loading seller workspace..." }) });
    if (!user)
        return _jsx(SimpleAccountPage, { title: "Seller workspace", text: "Sign in to manage your SmartCart store.", link: "/login", linkText: "Sign in" });
    if (user.role !== 'seller')
        return _jsx(SimpleAccountPage, { title: "Seller access required", text: "This workspace is available only to seller accounts.", link: "/", linkText: "Back to storefront" });
    return _jsxs("main", { className: "seller-page section", children: [_jsxs("div", { className: "seller-hero", children: [_jsxs("div", { children: [_jsxs("span", { className: "eyebrow", children: [_jsx(Store, { size: 14 }), " Seller workspace"] }), _jsx("h1", { children: "Run your store with confidence." }), _jsx("p", { children: "Manage products, fulfilment, customer feedback and sales from one focused space." })] }), _jsxs("button", { className: "outline-button", onClick: () => void loadAll(), disabled: busy === 'load', children: [_jsx(BarChart3, { size: 16 }), " ", busy === 'load' ? 'Refreshing...' : 'Refresh data'] })] }), message && _jsx("div", { className: "api-notice", children: message }), _jsx("nav", { className: "seller-tabs", "aria-label": "Seller navigation", children: [['overview', 'Overview'], ['products', 'Products'], ['orders', 'Orders'], ['reviews', 'Reviews'], ['categories', 'Categories'], ['profile', 'Store profile']].map(([key, label]) => _jsx("button", { className: tab === key ? 'is-active' : '', onClick: () => setTab(key), children: label }, key)) }), tab === 'overview' && _jsxs(_Fragment, { children: [_jsxs("section", { className: "seller-stats", children: [_jsxs("article", { children: [_jsx(Package, {}), _jsx("small", { children: "Products" }), _jsx("strong", { children: totals.products })] }), _jsxs("article", { children: [_jsx(Truck, {}), _jsx("small", { children: "Orders" }), _jsx("strong", { children: totals.orders })] }), _jsxs("article", { children: [_jsx(Check, {}), _jsx("small", { children: "Pending approval" }), _jsx("strong", { children: totals.pending })] }), _jsxs("article", { children: [_jsx(BarChart3, {}), _jsx("small", { children: "Revenue" }), _jsx("strong", { children: formatPrice(totals.revenue) })] })] }), _jsxs("div", { className: "seller-grid", children: [_jsxs("section", { className: "seller-card", children: [_jsx("div", { className: "seller-card__heading", children: _jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Sales intelligence" }), _jsx("h2", { children: "Top products" })] }) }), (analytics?.topProducts || []).length ? analytics.topProducts.map((item) => _jsxs("div", { className: "seller-list-row", children: [_jsx("span", { children: item.productName || 'Product' }), _jsxs("b", { children: [item.totalUnitsSold || 0, " sold"] })] }, String(item._id))) : _jsx("div", { className: "seller-empty", children: "Sales insights will appear after your first orders." })] }), _jsxs("section", { className: "seller-card", children: [_jsxs("div", { className: "seller-card__heading", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Fulfilment" }), _jsx("h2", { children: "Recent orders" })] }), _jsxs("button", { className: "link-button", onClick: () => setTab('orders'), children: ["View all ", _jsx(ChevronRight, { size: 15 })] })] }), orders.slice(0, 5).map((order) => _jsxs("div", { className: "seller-list-row", children: [_jsxs("span", { children: [order.product?.name || 'Product', _jsxs("small", { children: ["#", String(order.orderId).slice(-8).toUpperCase()] })] }), _jsx("b", { children: order.fulfillmentStatus || 'pending' })] }, order.itemId)), !orders.length && _jsx("div", { className: "seller-empty", children: "No orders yet." })] })] })] }), tab === 'products' && _jsxs("section", { className: "seller-card", children: [_jsxs("div", { className: "seller-card__heading", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Catalog" }), _jsx("h2", { children: "Your products" })] }), _jsxs("button", { className: "primary-button", onClick: () => setShowProductForm((value) => !value), children: [_jsx(Plus, { size: 16 }), " ", showProductForm ? 'Close form' : 'Add product'] })] }), showProductForm && _jsxs("form", { className: "seller-form", onSubmit: submitProduct, children: [_jsxs("div", { className: "seller-form-grid", children: [_jsxs("label", { children: ["Name", _jsx("input", { required: true, value: productForm.name, onChange: (event) => setProductForm({ ...productForm, name: event.target.value }) })] }), _jsxs("label", { children: ["Brand", _jsx("input", { value: productForm.brand, onChange: (event) => setProductForm({ ...productForm, brand: event.target.value }) })] }), _jsxs("label", { children: ["Price", _jsx("input", { required: true, type: "number", min: "1", value: productForm.price, onChange: (event) => setProductForm({ ...productForm, price: event.target.value }) })] }), _jsxs("label", { children: ["Stock", _jsx("input", { required: true, type: "number", min: "0", value: productForm.stock, onChange: (event) => setProductForm({ ...productForm, stock: event.target.value }) })] }), _jsxs("label", { children: ["Category", _jsxs("select", { required: true, value: productForm.category, onChange: (event) => setProductForm({ ...productForm, category: event.target.value }), children: [_jsx("option", { value: "", children: "Choose a leaf category" }), categories.filter((item) => !categories.some((child) => child.parent === item._id)).map((item) => _jsx("option", { value: item._id, children: item.name }, item._id))] })] }), _jsxs("label", { children: ["Images", _jsx("input", { required: true, type: "file", accept: "image/*", multiple: true, onChange: (event) => setProductForm({ ...productForm, images: event.target.files }) })] })] }), _jsxs("label", { children: ["Description", _jsx("textarea", { required: true, minLength: 10, value: productForm.description, onChange: (event) => setProductForm({ ...productForm, description: event.target.value }) })] }), _jsx("button", { className: "primary-button", disabled: busy === 'product', children: busy === 'product' ? 'Submitting...' : 'Submit product' })] }), _jsxs("div", { className: "seller-table", children: [products.map((product) => _jsxs("article", { className: "seller-product-row", children: [_jsx("img", { src: productImage(product), alt: "" }), _jsxs("div", { children: [_jsx("strong", { children: product.name }), _jsxs("small", { children: [product.category?.name || 'Uncategorised', " \u00B7 ", product.stock || 0, " in stock"] })] }), _jsx("span", { className: `seller-status seller-status--${product.approvalStatus || 'pending'}`, children: product.approvalStatus || 'pending' }), _jsx("button", { className: "small-action", onClick: () => void updateStock(product), disabled: busy === product._id, children: "Update stock" })] }, product._id)), !products.length && _jsx("div", { className: "seller-empty", children: "No products found. Add your first product above." })] })] }), tab === 'orders' && _jsxs("section", { className: "seller-card", children: [_jsx("div", { className: "seller-card__heading", children: _jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Fulfilment" }), _jsx("h2", { children: "Seller orders" })] }) }), _jsxs("div", { className: "seller-table", children: [orders.map((order) => _jsxs("article", { className: "seller-order-row", children: [_jsxs("div", { children: [_jsx("strong", { children: order.product?.name || 'Product' }), _jsxs("small", { children: ["Order #", String(order.orderId).slice(-8).toUpperCase(), " \u00B7 ", order.quantity || 0, " units \u00B7 ", formatPrice(order.total || 0)] })] }), _jsx("span", { className: "seller-status", children: order.fulfillmentStatus || 'pending' }), _jsx("select", { value: order.fulfillmentStatus || 'pending', onChange: (event) => void updateOrder(order, event.target.value), disabled: busy === order.itemId, children: statuses.map((status) => _jsx("option", { value: status, children: status }, status)) })] }, order.itemId)), !orders.length && _jsx("div", { className: "seller-empty", children: "No seller orders found." })] })] }), tab === 'reviews' && _jsxs("section", { className: "seller-card", children: [_jsx("div", { className: "seller-card__heading", children: _jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Customer voice" }), _jsx("h2", { children: "Reviews & replies" })] }) }), reviews.map((review) => _jsxs("article", { className: "seller-review-row", children: [_jsxs("div", { children: [_jsxs("strong", { children: ['★'.repeat(review.rating || 0), " ", review.title || 'Customer review'] }), _jsxs("small", { children: [review.product?.name || 'Product', " \u00B7 ", review.user?.fullname || review.user?.username || 'Customer'] }), _jsx("p", { children: review.comment || 'No written feedback.' }), review.sellerResponse?.message && _jsxs("em", { children: ["Your reply: ", review.sellerResponse.message] })] }), !review.sellerResponse?.message && _jsxs("button", { className: "small-action", onClick: () => void replyReview(review), disabled: busy === review._id, children: [_jsx(Reply, { size: 14 }), " Reply"] })] }, review._id)), !reviews.length && _jsx("div", { className: "seller-empty", children: "No reviews found." })] }), tab === 'categories' && _jsxs("section", { className: "seller-card", children: [_jsx("div", { className: "seller-card__heading", children: _jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Catalog taxonomy" }), _jsx("h2", { children: "Approved categories" })] }) }), _jsx("div", { className: "seller-category-grid", children: categories.map((category) => _jsxs(Link, { to: `/categories/${category.slug}`, children: [_jsx("strong", { children: category.name }), _jsxs("small", { children: [category.parent ? 'Subcategory' : 'Top level', " ", _jsx(ChevronRight, { size: 13 })] })] }, category._id)) })] }), tab === 'profile' && _jsx(SellerProfile, { profile: profile, onSaved: async () => { setMessage('Store profile saved.'); const data = await getJson('/users/seller/profile'); setProfile(data); } })] });
}
function SellerProfile({ profile, onSaved }) {
    const [form, setForm] = useState({ ...(profile?.basicInfo || {}), ...(profile?.sellerProfile || {}) });
    const [saving, setSaving] = useState(false);
    const [bannerFile, setBannerFile] = useState(null);
    useEffect(() => { setForm({ ...(profile?.basicInfo || {}), ...(profile?.sellerProfile || {}) }); }, [profile]);
    const save = async (event) => { event.preventDefault(); setSaving(true); try {
        const payload = new FormData();
        Object.entries(form).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== '')
            payload.append(key, String(value)); });
        if (bannerFile)
            payload.append('storeBanner', bannerFile);
        await sendForm('/users/seller/update-account', payload);
        setBannerFile(null);
        await onSaved();
    }
    catch (error) {
        window.alert(error.message);
    }
    finally {
        setSaving(false);
    } };
    return _jsxs("section", { className: "seller-card", children: [_jsx("div", { className: "seller-card__heading", children: _jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Store identity" }), _jsx("h2", { children: "Seller profile" })] }) }), _jsxs("form", { className: "seller-form", onSubmit: save, children: [_jsxs("div", { className: "seller-form-grid", children: [_jsxs("label", { children: ["Full name", _jsx("input", { value: form.fullname || '', onChange: (event) => setForm({ ...form, fullname: event.target.value }) })] }), _jsxs("label", { children: ["Username", _jsx("input", { value: form.username || '', onChange: (event) => setForm({ ...form, username: event.target.value }) })] }), _jsxs("label", { children: ["Shop name", _jsx("input", { value: form.shopName || '', onChange: (event) => setForm({ ...form, shopName: event.target.value }) })] }), _jsxs("label", { children: ["Business type", _jsx("input", { value: form.businessType || '', onChange: (event) => setForm({ ...form, businessType: event.target.value }) })] }), _jsxs("label", { children: ["GST number", _jsx("input", { value: form.gstNumber || '', onChange: (event) => setForm({ ...form, gstNumber: event.target.value }) })] }), _jsxs("label", { children: ["Phone", _jsx("input", { value: form.phone || '', onChange: (event) => setForm({ ...form, phone: event.target.value }) })] }), _jsxs("label", { children: ["Store banner", _jsx("input", { type: "file", accept: "image/*", onChange: (event) => setBannerFile(event.target.files?.[0] || null) })] })] }), _jsxs("label", { children: ["Shop address", _jsx("textarea", { value: form.shopAddress || '', onChange: (event) => setForm({ ...form, shopAddress: event.target.value }) })] }), _jsx("button", { className: "primary-button", disabled: saving, children: saving ? 'Saving...' : 'Save profile' })] })] });
}
