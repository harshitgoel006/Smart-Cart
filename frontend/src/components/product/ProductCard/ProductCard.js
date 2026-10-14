import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice, getNumber, productImage } from '../../../utils/formatters';
import { useAuth } from '../../../app/providers/AuthProvider';
import { sendJson } from '../../../services/apiClient';
import { useSiteSettings } from '../../../app/providers/SiteSettingsProvider';
export function ProductCard({ product }) {
    const { user } = useAuth();
    const settings = useSiteSettings();
    const [saved, setSaved] = useState(false);
    const [added, setAdded] = useState(false);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');
    const originalPrice = getNumber(product.price);
    const finalPrice = getNumber(product.finalPrice || product.price);
    const stock = Number(product.stock || 0);
    const isLowStock = stock > 0 && stock <= 5;
    const save = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!user) {
            setMessage('Sign in to save this product');
            return;
        }
        try {
            await sendJson('/wishlists/items', 'POST', { productId: product._id });
            setSaved(true);
            window.dispatchEvent(new CustomEvent('smartcart:wishlist-updated'));
            setMessage('Saved to wishlist');
        }
        catch (error) {
            setMessage(error.message);
        }
    };
    const addToCart = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!user) {
            setMessage('Sign in to add items to your bag');
            return;
        }
        setBusy(true);
        setMessage('');
        try {
            await sendJson('/carts/add', 'POST', { productId: product._id, quantity: 1 });
            window.dispatchEvent(new CustomEvent('smartcart:cart-updated'));
            setAdded(true);
            setMessage('Added to your bag');
        }
        catch (error) {
            setMessage(error.message);
        }
        finally {
            setBusy(false);
        }
    };
    return (_jsxs("article", { className: "product-card", children: [_jsxs("div", { className: "product-card__image-wrap", children: [_jsx(Link, { className: "product-card__image-link", to: `/products/${product._id}`, children: _jsx("img", { src: productImage(product), alt: product.name, loading: "lazy" }) }), _jsx("span", { className: "product-card__image-glow", "aria-hidden": "true" }), _jsxs(Link, { className: "product-card__quick-view", to: `/products/${product._id}`, children: ["View details ", _jsx(ArrowUpRight, { size: 14, strokeWidth: 2 })] }), settings.features?.wishlist !== false && _jsx("button", { type: "button", "aria-label": saved ? 'Saved to wishlist' : 'Save product', className: `product-card__wish ${saved ? 'is-saved' : ''}`, onClick: save, children: _jsx(Heart, { size: 17, strokeWidth: 1.8, fill: saved ? 'currentColor' : 'none' }) }), (product.discountPercentage || 0) > 0 && (_jsxs("span", { className: "product-card__badge", children: ["-", product.discountPercentage, "%"] }))] }), _jsxs("div", { className: "product-card__content", children: [_jsxs("div", { className: "product-card__meta", children: [_jsx("span", { className: "eyebrow", children: product.brand || 'SmartCart select' }), isLowStock && _jsxs("span", { className: "product-card__stock", children: ["Only ", stock, " left"] })] }), _jsx(Link, { className: "product-card__title", to: `/products/${product._id}`, children: _jsx("h3", { children: product.name }) }), _jsxs("div", { className: "rating-row", children: [_jsxs("span", { className: "rating-row__score", children: ["\u2605 ", Number(product.ratings || 0).toFixed(1)] }), _jsxs("span", { className: "muted", children: [product.reviews || 0, " reviews"] })] }), _jsxs("div", { className: "price-row", children: [_jsx("strong", { children: formatPrice(finalPrice) }), originalPrice > finalPrice && _jsx("del", { children: formatPrice(originalPrice) })] }), _jsxs("button", { type: "button", className: `product-card__cart ${added ? 'is-added' : ''}`, onClick: addToCart, disabled: busy || !stock, children: [_jsx("span", { className: "product-card__cart-label", children: busy ? 'Adding to bag…' : added ? 'Added to bag' : stock ? 'Add to cart' : 'Out of stock' }), _jsx("span", { className: "product-card__cart-icon", children: added ? _jsx(Check, { size: 16, strokeWidth: 2.2 }) : _jsx(ShoppingBag, { size: 16, strokeWidth: 1.9 }) }), !added && !busy && stock > 0 && _jsx(ArrowRight, { className: "product-card__cart-arrow", size: 15, strokeWidth: 2 })] }), message && _jsx("small", { className: `card-message ${added ? 'is-success' : ''}`, children: message })] })] }));
}
