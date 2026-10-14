import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Check, ChevronRight, CircleAlert, Download, Package, RotateCcw, Truck } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { getBlob, getJson, sendJson } from '../../services/apiClient';
import { formatPrice, productImage } from '../../utils/formatters';
import { SimpleAccountPage } from '../../components/ui/EmptyState/SimpleAccountPage';
const formatDate = (value) => value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const formatDateTime = (value) => value ? new Date(value).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : '';
const prettyStatus = (value) => (value || 'processing').replace(/_/g, ' ');
function StatusPill({ status }) {
    return _jsx("span", { className: `status status--${status || 'processing'}`, children: prettyStatus(status) });
}
function OrderProductImage({ item }) {
    const product = item.product;
    return product?.images || product?.coverImage ? _jsx("img", { src: productImage(product), alt: product?.name || 'Product' }) : _jsx("div", { className: "order-product__placeholder", children: _jsx(Package, { size: 20 }) });
}
export function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(() => { if (!user) {
        setLoading(false);
        return;
    } ; getJson('/orders/orders?limit=20').then((data) => setOrders(data.orders || [])).catch((reason) => setError(reason.message)).finally(() => setLoading(false)); }, [user]);
    if (!user)
        return _jsx(SimpleAccountPage, { title: "Your orders are private.", text: "Sign in to view order history and tracking.", link: "/login", linkText: "Sign in" });
    if (loading)
        return _jsx("main", { className: "section empty-page", children: _jsx("h1", { children: "Loading your orders..." }) });
    return _jsxs("main", { className: "orders-page section", children: [_jsxs("section", { className: "orders-hero", children: [_jsxs("div", { children: [_jsxs("span", { className: "eyebrow", children: [_jsx(Package, { size: 14 }), " Your shopping history"] }), _jsx("h1", { children: "Orders, all in one place." }), _jsx("p", { children: "Revisit your purchases, check delivery progress and manage post-order help without losing the details." })] }), _jsxs(Link, { className: "primary-button", to: "/products", children: ["Continue shopping ", _jsx(ArrowUpRight, { size: 16 })] })] }), error && _jsxs("div", { className: "api-notice", children: [_jsx(CircleAlert, { size: 16 }), " ", error] }), orders.length ? _jsxs("section", { className: "orders-list", "aria-label": "Your orders", children: [_jsxs("div", { className: "orders-list__header", children: [_jsxs("span", { children: [orders.length, " ", orders.length === 1 ? 'order' : 'orders'] }), _jsx("span", { children: "Recent first" })] }), orders.map((order) => _jsxs(Link, { className: "order-row", to: `/orders/${order._id}`, children: [_jsxs("div", { className: "order-row__identity", children: [_jsx("span", { className: "order-row__icon", children: _jsx(Package, { size: 19 }) }), _jsxs("div", { children: [_jsxs("span", { className: "eyebrow", children: ["Order placed ", formatDate(order.createdAt)] }), _jsxs("strong", { children: ["#", order._id.slice(-8).toUpperCase()] }), _jsxs("small", { children: [order.items?.length || 0, " items"] })] })] }), _jsxs("div", { className: "order-row__summary", children: [_jsx(StatusPill, { status: order.orderStatus }), _jsx("strong", { children: formatPrice(order.finalAmount) })] }), _jsx(ChevronRight, { className: "order-row__arrow", size: 18 })] }, order._id))] }) : _jsxs("div", { className: "empty-page orders-empty", children: [_jsx(Package, { size: 32 }), _jsx("h2", { children: "No orders yet." }), _jsx("p", { children: "Your next favourite is waiting to be discovered." }), _jsxs(Link, { className: "primary-button", to: "/products", children: ["Explore products ", _jsx(ArrowUpRight, { size: 16 })] })] })] });
}
function TrackingPage({ tracking }) {
    const events = tracking.items?.flatMap((item) => item.trackingTimeline || []) || [];
    return _jsxs("main", { className: "order-detail-page section", children: [_jsxs(Link, { className: "back-link", to: `/orders/${tracking.orderId}`, children: [_jsx(ArrowLeft, { size: 15 }), " Back to order"] }), _jsxs("section", { className: "tracking-hero", children: [_jsxs("span", { className: "eyebrow", children: [_jsx(Truck, { size: 14 }), " Live order tracking"] }), _jsx("h1", { children: "Your delivery journey." }), _jsxs("p", { children: ["Order #", tracking.orderId.slice(-8).toUpperCase(), " \u00B7 Placed ", formatDate(tracking.createdAt)] }), _jsx(StatusPill, { status: tracking.orderStatus })] }), _jsxs("section", { className: "tracking-card", children: [_jsxs("div", { className: "tracking-card__header", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Shipment updates" }), _jsx("h2", { children: "Where your order is now" })] }), _jsx(Truck, { size: 26 })] }), events.length ? _jsx("div", { className: "tracking-timeline", children: events.map((event, index) => _jsxs("div", { className: `tracking-event ${index === 0 ? 'is-latest' : ''}`, children: [_jsx("span", { className: "tracking-event__dot", children: index === 0 ? _jsx(Truck, { size: 13 }) : _jsx(Check, { size: 13 }) }), _jsxs("div", { children: [_jsx("strong", { children: event.event || 'Shipment update' }), _jsxs("small", { children: [event.location || 'SmartCart logistics', " ", event.scannedAt ? `· ${formatDateTime(event.scannedAt)}` : ''] }), event.remarks && _jsx("p", { children: event.remarks })] })] }, `${event.scannedAt}-${index}`)) }) : _jsxs("div", { className: "tracking-empty", children: [_jsx(Truck, { size: 24 }), _jsx("h3", { children: "Tracking will appear soon." }), _jsx("p", { children: "Your order has been received. Updates will show here as it moves through fulfilment." })] })] })] });
}
export function OrderDetailPage() {
    const { user } = useAuth();
    const { id = '' } = useParams();
    const location = useLocation();
    const isTracking = location.pathname.endsWith('/tracking');
    const [order, setOrder] = useState(null);
    const [tracking, setTracking] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState('');
    const normalize = (data) => setOrder({ ...data, finalAmount: data.finalAmount ?? data.pricing?.finalAmount, subtotal: data.subtotal ?? data.pricing?.subtotal, discount: data.discount ?? data.pricing?.discount, paymentStatus: data.paymentStatus ?? data.payment?.status, paymentMethod: data.paymentMethod ?? data.payment?.method });
    const refresh = () => getJson(`/orders/orders/${id}`).then(normalize);
    useEffect(() => { if (!user) {
        setLoading(false);
        return;
    } ; const request = isTracking ? getJson(`/orders/orders/${id}/track`).then(setTracking) : refresh(); request.catch((error) => setMessage(error.message)).finally(() => setLoading(false)); }, [id, isTracking, user]);
    const action = async (name, path, payload) => { setBusy(name); setMessage(''); try {
        await sendJson(path, 'POST', payload);
        await refresh();
        setMessage(`${name} request completed.`);
    }
    catch (error) {
        setMessage(error.message);
    }
    finally {
        setBusy('');
    } };
    const downloadInvoice = async () => { setBusy('invoice'); setMessage(''); try {
        const blob = await getBlob(`/orders/orders/${id}/invoice`);
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `smartcart-invoice-${id}.pdf`;
        anchor.click();
        URL.revokeObjectURL(url);
        setMessage('Invoice download started.');
    }
    catch (error) {
        setMessage(error.message);
    }
    finally {
        setBusy('');
    } };
    if (!user)
        return _jsx(SimpleAccountPage, { title: "Sign in to view this order.", text: "Your order details are protected.", link: "/login", linkText: "Sign in" });
    if (loading)
        return _jsx("main", { className: "section empty-page", children: _jsx("h1", { children: "Loading order..." }) });
    if (isTracking && tracking)
        return _jsx(TrackingPage, { tracking: tracking });
    if (!order)
        return _jsxs("main", { className: "section empty-page", children: [_jsx("h1", { children: "Order unavailable" }), _jsx("p", { children: message }), _jsx(Link, { className: "primary-button", to: "/orders", children: "Back to orders" })] });
    const canCancel = ['pending', 'processing', 'confirmed'].includes(order.orderStatus);
    return _jsxs("main", { className: "order-detail-page section", children: [_jsxs(Link, { className: "back-link", to: "/orders", children: [_jsx(ArrowLeft, { size: 15 }), " All orders"] }), _jsxs("section", { className: "order-detail-heading", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Order confirmation" }), _jsx("h1", { children: order.orderStatus === 'cancelled' ? 'This order was cancelled.' : 'Thank you for your order.' }), _jsxs("p", { children: ["Order #", order._id.slice(-8).toUpperCase(), " \u00B7 Placed ", formatDate(order.createdAt)] })] }), _jsx(StatusPill, { status: order.orderStatus })] }), message && _jsx("div", { className: "api-notice", children: message }), _jsxs("div", { className: "order-detail-layout", children: [_jsxs("section", { className: "order-detail-card", children: [_jsxs("div", { className: "order-status-banner", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Current status" }), _jsx("strong", { children: prettyStatus(order.orderStatus) })] }), _jsx("strong", { children: formatPrice(order.finalAmount) })] }), _jsxs("div", { className: "order-items-heading", children: [_jsx("span", { children: "Items in this order" }), _jsx("span", { children: "Price" })] }), order.items?.map((item, index) => _jsxs("div", { className: "order-item", children: [_jsx(OrderProductImage, { item: item }), _jsxs("div", { className: "order-item__body", children: [_jsx("strong", { children: item.product?.name || 'Product' }), _jsxs("small", { children: ["Quantity: ", item.quantity || 1, " \u00B7 ", prettyStatus(item.fulfillmentStatus)] }), item.returnStatus && item.returnStatus !== 'none' && _jsxs("small", { children: ["Return: ", prettyStatus(item.returnStatus)] }), item.refundStatus && item.refundStatus !== 'none' && _jsxs("small", { children: ["Refund: ", prettyStatus(item.refundStatus)] })] }), _jsx("b", { children: formatPrice(item.lineTotal) }), _jsxs("div", { className: "order-item-actions", children: [item.returnStatus === 'none' && item.fulfillmentStatus === 'delivered' && _jsxs("button", { className: "outline-button", disabled: !!busy, onClick: () => action('Return', `/orders/orders/${id}/return`, { itemId: item._id, reason: 'Changed my mind' }), children: [_jsx(RotateCcw, { size: 14 }), " Return"] }), item.returnStatus === 'approved' && item.refundStatus === 'none' && _jsx("button", { className: "outline-button", disabled: !!busy, onClick: () => action('Refund', `/orders/orders/${id}/refund`, { itemId: item._id, reason: 'Refund requested by customer' }), children: "Request refund" })] })] }, item._id || index)), _jsxs("div", { className: "order-actions", children: [_jsxs(Link, { className: "primary-button", to: `/orders/${order._id}/tracking`, children: [_jsx(Truck, { size: 16 }), " Track order"] }), _jsxs("button", { className: "outline-button", disabled: !!busy, onClick: downloadInvoice, children: [_jsx(Download, { size: 16 }), " ", busy === 'invoice' ? 'Preparing...' : 'Invoice'] }), canCancel && _jsx("button", { className: "text-button text-button--danger", disabled: !!busy, onClick: () => action('Cancellation', `/orders/orders/${id}/cancel`), children: "Cancel order" })] })] }), _jsxs("aside", { className: "order-summary-card", children: [_jsx("span", { className: "eyebrow", children: "Payment summary" }), _jsx("h2", { children: formatPrice(order.finalAmount) }), _jsxs("dl", { children: [_jsxs("div", { children: [_jsx("dt", { children: "Subtotal" }), _jsx("dd", { children: formatPrice(order.subtotal) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Discount" }), _jsx("dd", { children: formatPrice(order.discount) })] }), _jsxs("div", { children: [_jsx("dt", { children: "Payment" }), _jsx("dd", { children: prettyStatus(order.paymentStatus) })] })] }), order.shippingAddress && _jsxs("div", { className: "shipping-address", children: [_jsx("span", { className: "eyebrow", children: "Delivering to" }), _jsxs("p", { children: [order.shippingAddress.street, _jsx("br", {}), order.shippingAddress.city, ", ", order.shippingAddress.state, " \u2014 ", order.shippingAddress.pincode] })] })] })] })] });
}
