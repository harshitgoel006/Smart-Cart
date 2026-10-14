import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { getJson, sendJson } from '../../services/apiClient';
import { aiApi } from '../../services/ai.api';
import { formatPrice, productImage } from '../../utils/formatters';
import { SimpleAccountPage } from '../../components/ui/EmptyState/SimpleAccountPage';
import { useSiteSettings } from '../../app/providers/SiteSettingsProvider';
function notifyCartUpdated() {
    window.dispatchEvent(new CustomEvent('smartcart:cart-updated'));
}
function CartAiSuggestions({ suggestions }) {
    if (!suggestions.length)
        return null;
    return (_jsxs("section", { className: "cart-ai-section", "aria-labelledby": "cart-ai-heading", children: [_jsxs("div", { className: "cart-ai-section__heading", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Picked for your basket" }), _jsx("h2", { id: "cart-ai-heading", children: "Smart picks to complete your order" })] }), _jsx("span", { className: "cart-ai-section__note", children: "AI-curated for you" })] }), _jsx("div", { className: "cart-ai-grid", children: suggestions.map((suggestion) => (_jsxs(Link, { className: "cart-ai-card", to: `/products/${suggestion.id}`, children: [_jsx("div", { className: "cart-ai-card__image", children: _jsx("img", { src: suggestion.image || productImage({ _id: suggestion.id, name: suggestion.name }), alt: suggestion.name }) }), _jsxs("div", { className: "cart-ai-card__copy", children: [_jsx("span", { children: suggestion.brand || 'SmartCart pick' }), _jsx("h3", { children: suggestion.name }), suggestion.price ? _jsx("strong", { children: formatPrice(suggestion.price) }) : null] }), _jsx("span", { className: "cart-ai-card__arrow", "aria-hidden": "true", children: "\u2197" })] }, suggestion.id))) })] }));
}
export function CartPage() {
    const { user } = useAuth();
    const settings = useSiteSettings();
    const [cart, setCart] = useState(null);
    const [coupon, setCoupon] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const refresh = async () => {
        try {
            const nextCart = await getJson('/carts');
            setCart(nextCart);
            notifyCartUpdated();
            if (nextCart.items?.length) {
                const productIds = nextCart.items.map((item) => item.product?._id).filter(Boolean);
                try {
                    setSuggestions(await aiApi.cartSuggestions(productIds));
                }
                catch {
                    setSuggestions([]);
                }
            }
            else {
                setSuggestions([]);
            }
        }
        catch (error) {
            setMessage(error.message);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (user)
            void refresh();
        else
            setLoading(false);
    }, [user]);
    useEffect(() => {
        if (!user)
            return;
        void getJson('/carts/coupon/available')
            .then((result) => setAvailableCoupons(result.coupons || []))
            .catch(() => setAvailableCoupons([]));
    }, [user]);
    const updateQuantity = async (itemId, quantity) => {
        setBusy(itemId);
        setMessage('');
        try {
            const nextCart = await sendJson(`/carts/update/${itemId}`, 'PUT', { quantity });
            setCart(nextCart);
            notifyCartUpdated();
        }
        catch (error) {
            setMessage(error.message);
        }
        finally {
            setBusy('');
        }
    };
    const removeItem = async (itemId) => {
        setBusy(itemId);
        setMessage('');
        try {
            const nextCart = await sendJson(`/carts/remove/${itemId}`, 'DELETE');
            setCart(nextCart);
            notifyCartUpdated();
            if (!nextCart.items.length)
                setSuggestions([]);
        }
        catch (error) {
            setMessage(error.message);
        }
        finally {
            setBusy('');
        }
    };
    const clear = async () => {
        setBusy('clear');
        setMessage('');
        try {
            setCart(await sendJson('/carts/clear', 'DELETE'));
            setSuggestions([]);
            notifyCartUpdated();
        }
        catch (error) {
            setMessage(error.message);
        }
        finally {
            setBusy('');
        }
    };
    const applyCoupon = async (event) => {
        event.preventDefault();
        if (!coupon.trim())
            return;
        setBusy('coupon');
        setMessage('');
        try {
            setCart(await sendJson('/carts/apply-coupon', 'POST', { couponCode: coupon.trim() }));
            setMessage('Coupon applied successfully.');
        }
        catch (error) {
            setMessage(error.message);
        }
        finally {
            setBusy('');
        }
    };
    if (!user)
        return _jsx(SimpleAccountPage, { title: "Your bag is private.", text: "Sign in to see your saved bag and continue checkout.", link: "/login", linkText: "Sign in" });
    if (loading)
        return _jsx("main", { className: "section empty-page", children: _jsx("h1", { children: "Loading your bag..." }) });
    const hasItems = Boolean(cart?.items?.length);
    return (_jsxs("main", { className: "cart-page section", children: [_jsxs("div", { className: "catalog-heading", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Your edit" }), _jsx("h1", { children: "Your bag" }), _jsx("p", { className: "cart-page__intro", children: "Thoughtful picks, ready when you are." })] }), hasItems ? _jsx("button", { className: "link-button", onClick: () => void clear(), disabled: Boolean(busy), children: "Clear bag" }) : null] }), message ? _jsx("div", { className: "api-notice", children: message }) : null, hasItems && cart ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "cart-layout", children: [_jsxs("div", { className: "cart-items-column", children: [_jsxs("div", { className: "cart-items-heading", children: [_jsxs("span", { children: [cart.items.length, " ", cart.items.length === 1 ? 'item' : 'items'] }), _jsx("span", { children: "Price" })] }), cart.items.map((item) => (_jsxs("article", { className: "cart-item", children: [_jsx("img", { src: productImage(item.product || { _id: '', name: '' }), alt: item.product?.name || 'Product' }), _jsxs("div", { className: "cart-item__info", children: [_jsx("span", { className: "eyebrow", children: item.product?.brand || 'SmartCart' }), _jsx("h3", { children: item.product?.name || 'Product' }), _jsx("strong", { children: formatPrice(item.lineTotalSnapshot || item.unitPriceSnapshot) }), _jsxs("div", { className: "cart-item__actions", children: [_jsxs("div", { className: "quantity", "aria-label": `Quantity ${item.quantity}`, children: [_jsx("button", { "aria-label": "Decrease quantity", disabled: Boolean(busy) || item.quantity <= 1, onClick: () => void updateQuantity(item._id, Math.max(1, item.quantity - 1)), children: "\u2212" }), _jsx("span", { children: item.quantity }), _jsx("button", { "aria-label": "Increase quantity", disabled: Boolean(busy), onClick: () => void updateQuantity(item._id, item.quantity + 1), children: "\uFF0B" })] }), _jsx("button", { className: "link-button cart-remove", disabled: Boolean(busy), onClick: () => void removeItem(item._id), children: "Remove" })] })] })] }, item._id)))] }), _jsxs("aside", { className: `cart-summary ${settings.features?.coupons === false ? 'cart-summary--coupons-hidden' : ''}`, children: [_jsx("span", { className: "eyebrow", children: "Order summary" }), _jsx("h2", { children: formatPrice(cart.finalAmount) }), _jsxs("p", { children: [_jsx("span", { children: "Subtotal" }), _jsx("b", { children: formatPrice(cart.subtotal) })] }), _jsxs("p", { children: [_jsx("span", { children: "Discount" }), _jsxs("b", { children: ["-", formatPrice(cart.discountAmount)] })] }), _jsxs("form", { className: "cart-coupon", onSubmit: applyCoupon, children: [_jsx("input", { "aria-label": "Coupon code", placeholder: "Coupon code", value: coupon, onChange: (event) => setCoupon(event.target.value) }), _jsx("button", { className: "ghost-dark-button", disabled: Boolean(busy), children: busy === 'coupon' ? '...' : 'Apply' })] }), availableCoupons.length ? _jsxs("div", { className: "cart-available-coupons", children: [_jsx("span", { className: "eyebrow", children: "Available offers" }), availableCoupons.slice(0, 3).map((offer) => _jsxs("button", { type: "button", onClick: () => setCoupon(offer.code), children: [_jsxs("span", { children: [_jsx("strong", { children: offer.code }), _jsx("small", { children: offer.description || `${offer.discountType === 'percent' ? `${offer.discountValue}% off` : `₹${offer.discountValue} off`}${offer.minOrderValue ? ` on orders above ₹${offer.minOrderValue}` : ''}` })] }), _jsx("b", { children: "Use" })] }, offer.code))] }) : null, "\\n              ", _jsxs(Link, { className: "primary-button", to: "/checkout", children: ["Continue to checkout ", _jsx("span", { children: "\u2197" })] }), _jsx("small", { className: "cart-summary__hint", children: "Secure checkout \u00B7 Easy 7-day returns" })] })] }), _jsx(CartAiSuggestions, { suggestions: suggestions })] })) : (_jsxs("div", { className: "empty-page cart-empty-state", children: [_jsx("span", { className: "eyebrow", children: "Nothing here yet" }), _jsx("h1", { children: "Your bag is waiting." }), _jsx("p", { children: "Add something considered to get started." }), _jsxs(Link, { className: "primary-button", to: "/products", children: ["Explore products ", _jsx("span", { children: "\u2197" })] })] }))] }));
}
