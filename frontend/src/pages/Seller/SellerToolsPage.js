import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { ArrowLeft, Boxes, CalendarClock, MessageSquare, Pencil, RefreshCw, Tag, Trash2, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { getJson, sendForm, sendJson } from '../../services/apiClient';
import { SimpleAccountPage } from '../../components/ui/EmptyState/SimpleAccountPage';
export function SellerToolsPage() {
    const { user, loading } = useAuth();
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [qna, setQna] = useState([]);
    const [reviewSummary, setReviewSummary] = useState(null);
    const [detailData, setDetailData] = useState(null);
    const [message, setMessage] = useState('');
    const [busy, setBusy] = useState('');
    const refresh = async () => {
        setBusy('refresh');
        const results = await Promise.allSettled([
            getJson('/products/seller/products?page=1&limit=50&sort=newest'),
            getJson('/orders/seller/orders?page=1&limit=50'),
            getJson('/categories/seller/list'),
        ]);
        if (results[0].status === 'fulfilled')
            setProducts(results[0].value.products || []);
        if (results[1].status === 'fulfilled')
            setOrders(results[1].value.orders || []);
        if (results[2].status === 'fulfilled')
            setCategories(results[2].value || []);
        if (results.some((result) => result.status === 'rejected'))
            setMessage('Some seller controls could not be loaded.');
        setBusy('');
    };
    useEffect(() => { if (user?.role === 'seller')
        void refresh(); }, [user]);
    const productAction = async (productId, action, payload) => {
        setBusy(productId);
        setMessage('');
        const method = action === 'delete-flash-sale' ? 'DELETE' : action === 'variants' ? 'PATCH' : 'POST';
        try {
            await sendJson(`/products/product/${productId}/${action}`, method, payload);
            await refresh();
            setMessage('Product control updated.');
        }
        catch (error) {
            setMessage(error.message);
        }
        finally {
            setBusy('');
        }
    };
    const editProduct = async (product) => {
        const name = window.prompt('Product name', product.name);
        const price = window.prompt('Price', String(product.price || ''));
        const description = window.prompt('Description', product.description || '');
        if (!name?.trim() || price === null || description === null)
            return;
        const form = new FormData();
        form.append('name', name.trim());
        form.append('price', price);
        form.append('description', description);
        setBusy(product._id);
        try {
            await sendForm(`/products/seller/product/${product._id}`, form, 'PUT');
            await refresh();
            setMessage('Product updated and sent for approval.');
        }
        catch (error) {
            setMessage(error.message);
        }
        finally {
            setBusy('');
        }
    };
    const deleteProduct = async (product) => {
        if (!window.confirm(`Delete ${product.name}?`))
            return;
        try {
            await sendJson(`/products/seller/product/${product._id}`, 'DELETE');
            await refresh();
            setMessage('Product deleted.');
        }
        catch (error) {
            setMessage(error.message);
        }
    };
    const editVariants = async (product) => {
        const raw = window.prompt('Variants JSON', JSON.stringify(product.variants || []));
        if (!raw)
            return;
        try {
            await productAction(product._id, 'variants', { variants: JSON.parse(raw) });
        }
        catch {
            setMessage('Variants must be valid JSON.');
        }
    };
    const flashSale = async (product) => {
        if (product.flashSale?.isActive) {
            await productAction(product._id, 'delete-flash-sale');
            return;
        }
        const start = window.prompt('Start date/time (future ISO format)', new Date(Date.now() + 3600000).toISOString().slice(0, 16));
        const end = window.prompt('End date/time (future ISO format)', new Date(Date.now() + 86400000).toISOString().slice(0, 16));
        const discountPercentage = window.prompt('Discount percentage (1-90)', '10');
        if (start && end && discountPercentage)
            await productAction(product._id, 'flash-sale', { start, end, discountPercentage: Number(discountPercentage) });
    };
    const loadFeedback = async (productId) => {
        setSelectedProduct(productId);
        setBusy(`feedback-${productId}`);
        try {
            const [reviewData, qnaData, summary] = await Promise.all([
                getJson(`/products/product/${productId}/feedback?page=1&limit=20`),
                getJson(`/products/product/${productId}/qna?limit=20`),
                getJson(`/reviews/seller/reviews/summary?productId=${productId}`),
            ]);
            setFeedback(reviewData);
            setQna(qnaData.qna || []);
            setReviewSummary(summary);
        }
        catch (error) {
            setMessage(error.message);
        }
        finally {
            setBusy('');
        }
    };
    const answerQuestion = async (item) => {
        const answer = window.prompt('Write answer', item.answer || '');
        if (!answer?.trim() || !selectedProduct)
            return;
        try {
            await sendJson(`/products/product/${selectedProduct}/qna/${item._id}/respond`, 'POST', { answer: answer.trim() });
            await loadFeedback(selectedProduct);
        }
        catch (error) {
            setMessage(error.message);
        }
    };
    const tracking = async (order) => {
        const courierName = window.prompt('Courier name', order.shipment?.courierName || '');
        const trackingNumber = window.prompt('Tracking number', order.shipment?.trackingNumber || '');
        if (!courierName || !trackingNumber)
            return;
        try {
            await sendJson('/orders/seller/orders/update-tracking', 'PATCH', { orderId: order.orderId, itemId: order.itemId, tracking: { courierName, trackingNumber } });
            setMessage('Tracking details saved.');
        }
        catch (error) {
            setMessage(error.message);
        }
    };
    const orderDetails = async (order) => {
        try {
            const data = await getJson(`/orders/seller/orders/${order.orderId}`);
            setDetailData({ title: `Order #${String(order.orderId).slice(-8).toUpperCase()}`, data });
        }
        catch (error) {
            setMessage(error.message);
        }
    };
    const categoryPerformance = async (category) => {
        try {
            const data = await getJson(`/categories/seller/performance/${category._id}`);
            setDetailData({ title: `${category.name} performance`, data });
        }
        catch (error) {
            setMessage(error.message);
        }
    };
    const trackingEvent = async (order) => {
        const event = window.prompt('Tracking event, e.g. Out for delivery');
        if (!event)
            return;
        try {
            await sendJson('/orders/seller/orders/tracking-event', 'POST', { orderId: order.orderId, itemId: order.itemId, event, location: window.prompt('Location') || '', remarks: window.prompt('Remarks') || '' });
            setMessage('Tracking event added.');
            await refresh();
        }
        catch (error) {
            setMessage(error.message);
        }
    };
    const decide = async (order, type) => {
        const decision = window.prompt('Enter approved or rejected');
        if (!['approved', 'rejected'].includes(decision || ''))
            return;
        try {
            await sendJson(`/orders/seller/orders/${type}-request`, 'POST', { orderId: order.orderId, itemId: order.itemId, decision, reason: window.prompt('Reason') || '' });
            setMessage(`${type} decision saved.`);
            await refresh();
        }
        catch (error) {
            setMessage(error.message);
        }
    };
    const proposeCategory = async () => {
        const name = window.prompt('New category name');
        if (!name?.trim())
            return;
        try {
            await sendJson('/categories/seller/propose', 'POST', { name: name.trim(), parent: window.prompt('Parent category ID (optional)') || null, description: window.prompt('Description') || '' });
            setMessage('Category proposal sent for admin approval.');
            await refresh();
        }
        catch (error) {
            setMessage(error.message);
        }
    };
    const manageCategory = async (category) => {
        const action = window.prompt('Enter action: edit, status, or delete', 'edit');
        try {
            if (action === 'delete' && window.confirm(`Delete ${category.name}?`))
                await sendJson(`/categories/seller/delete/${category._id}`, 'DELETE');
            if (action === 'status') {
                const status = window.prompt('Status: pending, approved, rejected', category.status || 'pending');
                if (status)
                    await sendJson(`/categories/seller/update-status/${category._id}`, 'PATCH', { status });
            }
            if (action === 'edit') {
                const name = window.prompt('Category name', category.name);
                if (name?.trim())
                    await sendJson(`/categories/seller/update-status/${category._id}`, 'PATCH', { name: name.trim() });
            }
            await refresh();
            setMessage('Category updated.');
        }
        catch (error) {
            setMessage(error.message);
        }
    };
    if (loading)
        return _jsx("main", { className: "section empty-page", children: _jsx("h1", { children: "Loading seller controls..." }) });
    if (!user)
        return _jsx(SimpleAccountPage, { title: "Seller workspace", text: "Sign in to continue.", link: "/login", linkText: "Sign in" });
    if (user.role !== 'seller')
        return _jsx(SimpleAccountPage, { title: "Seller access required", text: "This page is only for sellers.", link: "/", linkText: "Back" });
    return _jsxs("main", { className: "seller-page section", children: [_jsx(SellerCatalogBrowser, {}), _jsxs("div", { className: "seller-hero", children: [_jsxs("div", { children: [_jsxs(Link, { className: "back-link", to: "/seller", children: [_jsx(ArrowLeft, { size: 15 }), " Seller workspace"] }), _jsxs("span", { className: "eyebrow", children: [_jsx(Boxes, { size: 14 }), " Advanced controls"] }), _jsx("h1", { children: "Operate every part of your store." }), _jsx("p", { children: "Manage catalogue quality, delivery events, customer questions and category proposals." })] }), _jsxs("button", { className: "outline-button", onClick: () => void refresh(), disabled: busy === 'refresh', children: [_jsx(RefreshCw, { size: 15 }), " ", busy === 'refresh' ? 'Refreshing...' : 'Refresh'] })] }), message && _jsx("div", { className: "api-notice", children: message }), detailData && _jsx("div", { className: "seller-detail-backdrop", role: "presentation", onMouseDown: (event) => { if (event.target === event.currentTarget)
                    setDetailData(null); }, children: _jsxs("section", { className: "seller-detail-modal", role: "dialog", "aria-modal": "true", children: [_jsxs("div", { className: "seller-card__heading", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Seller details" }), _jsx("h2", { children: detailData.title })] }), _jsx("button", { className: "icon-action", onClick: () => setDetailData(null), "aria-label": "Close", children: "\u00D7" })] }), _jsx("div", { className: "seller-detail-grid", children: Object.entries(detailData.data || {}).map(([key, value]) => _jsxs("div", { children: [_jsx("small", { children: key.replace(/([A-Z])/g, ' $1') }), _jsx("strong", { children: typeof value === 'object' ? JSON.stringify(value) : String(value ?? '-') })] }, key)) })] }) }), _jsxs("div", { className: "seller-tools-grid", children: [_jsxs("section", { className: "seller-card", children: [_jsx("div", { className: "seller-card__heading", children: _jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Product operations" }), _jsx("h2", { children: "Catalogue controls" })] }) }), products.map((product) => _jsxs("div", { className: "seller-tool-row", children: [_jsxs("div", { children: [_jsx("strong", { children: product.name }), _jsxs("small", { children: [product.isArchived ? 'Archived' : product.isActive === false ? 'Inactive' : 'Active', product.flashSale?.isActive ? ` · ${product.flashSale.discountPercentage}% flash sale` : ''] })] }), _jsxs("div", { className: "seller-tool-actions", children: [_jsx("button", { className: "small-action", onClick: () => void productAction(product._id, 'toggle-active', { isActive: product.isActive === false }), children: "Toggle active" }), _jsx("button", { className: "small-action", onClick: () => void productAction(product._id, 'toggle-feature', { featured: !product.featured }), children: "Feature" }), _jsxs("button", { className: "small-action", onClick: () => void editProduct(product), children: [_jsx(Pencil, { size: 14 }), " Edit"] }), _jsx("button", { className: "small-action", onClick: () => void editVariants(product), children: "Variants" }), _jsxs("button", { className: "small-action", onClick: () => void flashSale(product), children: [_jsx(CalendarClock, { size: 14 }), " ", product.flashSale?.isActive ? 'Remove sale' : 'Flash sale'] }), _jsxs("button", { className: "small-action seller-danger-action", onClick: () => void deleteProduct(product), children: [_jsx(Trash2, { size: 14 }), " Delete"] }), _jsx("button", { className: "small-action", onClick: () => void productAction(product._id, product.isArchived ? 'restore' : 'archive'), children: product.isArchived ? 'Restore' : 'Archive' }), _jsx("button", { className: "small-action", onClick: () => void loadFeedback(product._id), children: "Feedback" })] })] }, product._id)), !products.length && _jsx("div", { className: "seller-empty", children: "No products available." })] }), _jsxs("section", { className: "seller-card", children: [_jsx("div", { className: "seller-card__heading", children: _jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Customer care" }), _jsx("h2", { children: "Feedback & questions" })] }) }), selectedProduct ? _jsxs(_Fragment, { children: [_jsx("p", { className: "seller-helper", children: reviewSummary ? `${reviewSummary.averageRating || reviewSummary.summary?.averageRating || 0} average rating · ${reviewSummary.totalReviews || reviewSummary.summary?.totalReviews || 0} reviews` : 'Approved feedback' }), (feedback?.reviews || []).map((review) => _jsx("div", { className: "seller-tool-row", children: _jsxs("div", { children: [_jsx("strong", { children: review.title || 'Review' }), _jsx("small", { children: review.comment || 'No comment' })] }) }, review._id)), qna.map((item) => _jsxs("div", { className: "seller-tool-row", children: [_jsxs("div", { children: [_jsxs("strong", { children: ["Q. ", item.question] }), _jsx("small", { children: item.answer || 'Awaiting your answer' })] }), _jsxs("button", { className: "small-action", onClick: () => void answerQuestion(item), children: [_jsx(MessageSquare, { size: 14 }), " Answer"] })] }, item._id))] }) : _jsx("div", { className: "seller-empty", children: "Choose Feedback on a product to inspect reviews and answer questions." })] }), _jsxs("section", { className: "seller-card", children: [_jsx("div", { className: "seller-card__heading", children: _jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Delivery operations" }), _jsx("h2", { children: "Tracking & requests" })] }) }), orders.map((order) => _jsxs("div", { className: "seller-tool-row", children: [_jsxs("div", { children: [_jsx("strong", { children: order.product?.name || 'Order item' }), _jsxs("small", { children: ["#", String(order.orderId).slice(-8).toUpperCase(), " \u00B7 ", order.fulfillmentStatus || 'pending'] })] }), _jsxs("div", { className: "seller-tool-actions", children: [_jsx("button", { className: "small-action", onClick: () => void orderDetails(order), children: "Details" }), _jsxs("button", { className: "small-action", onClick: () => void tracking(order), children: [_jsx(Truck, { size: 14 }), " Tracking"] }), _jsx("button", { className: "small-action", onClick: () => void trackingEvent(order), children: "Add event" }), order.returnStatus === 'requested' && _jsx("button", { className: "small-action", onClick: () => void decide(order, 'return'), children: "Return decision" }), order.refundStatus === 'pending' && _jsx("button", { className: "small-action", onClick: () => void decide(order, 'refund'), children: "Refund decision" })] })] }, order.itemId)), !orders.length && _jsx("div", { className: "seller-empty", children: "No orders available." })] }), _jsxs("section", { className: "seller-card", children: [_jsxs("div", { className: "seller-card__heading", children: [_jsxs("div", { children: [_jsxs("span", { className: "eyebrow", children: [_jsx(Tag, { size: 14 }), " Categories"] }), _jsx("h2", { children: "Category tools" })] }), _jsx("button", { className: "primary-button", onClick: () => void proposeCategory(), children: "Propose category" })] }), _jsx("div", { className: "seller-category-grid", children: categories.slice(0, 12).map((category) => _jsxs("div", { children: [_jsx("strong", { children: category.name }), _jsx("small", { children: category.status || (category.parent ? 'Subcategory' : 'Top level') }), _jsx("button", { className: "small-action", onClick: () => void categoryPerformance(category), children: "Performance" }), _jsx("button", { className: "small-action", onClick: () => void manageCategory(category), children: "Manage" })] }, category._id)) })] })] })] });
}
function SellerCatalogBrowser() {
    const [tab, setTab] = useState('products');
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('all');
    const [page, setPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const pageSize = 5;
    useEffect(() => {
        void Promise.all([
            getJson('/products/seller/products?page=1&limit=100'),
            getJson('/orders/seller/orders?page=1&limit=100'),
        ]).then(([productData, orderData]) => { setProducts(productData.products || []); setOrders(orderData.orders || []); }).catch(() => undefined);
    }, []);
    const source = tab === 'products' ? products : orders;
    const filtered = source.filter((item) => {
        const text = `${item.name || ''} ${item.product?.name || ''} ${item.orderId || ''}`.toLowerCase();
        const itemStatus = tab === 'products' ? (item.isActive === false ? 'inactive' : item.approvalStatus || 'pending') : item.fulfillmentStatus || 'pending';
        return (!query.trim() || text.includes(query.toLowerCase().trim())) && (status === 'all' || itemStatus === status);
    });
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const rows = filtered.slice((page - 1) * pageSize, page * pageSize);
    return _jsxs("section", { className: "seller-card seller-list-browser", children: [_jsxs("div", { className: "seller-card__heading", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Store records" }), _jsx("h2", { children: "Search and filter" })] }), _jsxs("div", { className: "seller-tabs seller-tabs--compact", children: [_jsx("button", { className: tab === 'products' ? 'is-active' : '', onClick: () => { setTab('products'); setPage(1); setStatus('all'); }, children: "Products" }), _jsx("button", { className: tab === 'orders' ? 'is-active' : '', onClick: () => { setTab('orders'); setPage(1); setStatus('all'); }, children: "Orders" })] })] }), _jsxs("div", { className: "seller-filter-row", children: [_jsx("input", { value: query, onChange: (event) => { setQuery(event.target.value); setPage(1); }, placeholder: tab === 'products' ? 'Search product name...' : 'Search product or order ID...' }), _jsxs("select", { value: status, onChange: (event) => { setStatus(event.target.value); setPage(1); }, children: [_jsx("option", { value: "all", children: "All statuses" }), (tab === 'products' ? ['pending', 'approved', 'rejected', 'inactive'] : ['pending', 'processing', 'shipped', 'delivered', 'cancelled']).map((value) => _jsx("option", { value: value, children: value }, value))] })] }), _jsxs("div", { className: "seller-table", children: [rows.map((item) => _jsxs("div", { className: "seller-list-row", children: [_jsxs("span", { children: [_jsx("strong", { children: item.name || item.product?.name || 'Order' }), _jsx("small", { children: tab === 'products' ? `${item.approvalStatus || 'pending'} · ${item.stock || 0} in stock` : `#${String(item.orderId).slice(-8).toUpperCase()} · ${item.fulfillmentStatus || 'pending'}` })] }), _jsx("b", { children: tab === 'products' ? item.brand || 'Product' : item.quantity || 0 })] }, item._id || item.itemId)), !rows.length && _jsx("div", { className: "seller-empty", children: "No matching records." })] }), _jsxs("div", { className: "seller-pagination", children: [_jsx("button", { className: "outline-button", disabled: page === 1, onClick: () => setPage((value) => Math.max(1, value - 1)), children: "Previous" }), _jsxs("span", { children: ["Page ", _jsx("strong", { children: page }), " of ", _jsx("strong", { children: totalPages }), " \u00B7 ", filtered.length, " records"] }), _jsx("button", { className: "outline-button", disabled: page >= totalPages, onClick: () => setPage((value) => Math.min(totalPages, value + 1)), children: "Next" })] })] });
}
