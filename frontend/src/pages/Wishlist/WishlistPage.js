import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { getJson, sendJson } from '../../services/apiClient';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';
import { SimpleAccountPage } from '../../components/ui/EmptyState/SimpleAccountPage';
function notifyWishlistUpdated() {
    window.dispatchEvent(new CustomEvent('smartcart:wishlist-updated'));
}
function notifyCartUpdated() {
    window.dispatchEvent(new CustomEvent('smartcart:cart-updated'));
}
export function WishlistPage() {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState('');
    const refresh = async () => {
        try {
            setWishlist(await getJson('/wishlists'));
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
    const remove = async (productId, itemId) => {
        setBusy(itemId);
        setMessage('');
        try {
            await sendJson(`/wishlists/items/${itemId}`, 'DELETE', { productId });
            setWishlist((current) => current ? { ...current, items: current.items.filter((item) => item._id !== itemId) } : current);
            notifyWishlistUpdated();
        }
        catch (error) {
            setMessage(error.message);
        }
        finally {
            setBusy('');
        }
    };
    const moveToCart = async (productId, itemId) => {
        setBusy(itemId);
        setMessage('');
        try {
            await sendJson(`/wishlists/items/${itemId}/move-to-cart`, 'POST', { productId });
            setWishlist((current) => current ? { ...current, items: current.items.filter((item) => item._id !== itemId) } : current);
            notifyWishlistUpdated();
            notifyCartUpdated();
            setMessage('Item moved to your bag.');
        }
        catch (error) {
            setMessage(error.message);
        }
        finally {
            setBusy('');
        }
    };
    const clearWishlist = async () => {
        setBusy('clear');
        setMessage('');
        try {
            await sendJson('/wishlists/clear', 'DELETE');
            setWishlist((current) => current ? { ...current, items: [] } : current);
            notifyWishlistUpdated();
        }
        catch (error) {
            setMessage(error.message);
        }
        finally {
            setBusy('');
        }
    };
    if (!user)
        return _jsx(SimpleAccountPage, { title: "Your wishlist is private.", text: "Sign in to save pieces you want to return to.", link: "/login", linkText: "Sign in" });
    if (loading)
        return _jsx("main", { className: "section empty-page", children: _jsx("h1", { children: "Loading your wishlist..." }) });
    return (_jsxs("main", { className: "wishlist-page section", children: [_jsxs("div", { className: "catalog-heading wishlist-page__heading", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Saved for later" }), _jsx("h1", { children: "Your wishlist" }), _jsx("p", { children: "Keep the pieces you love close." })] }), wishlist?.items?.length ? _jsx("button", { className: "wishlist-clear", disabled: Boolean(busy), onClick: () => void clearWishlist(), children: "Clear wishlist" }) : null] }), message ? _jsx("div", { className: "inline-message", children: message }) : null, wishlist?.items?.length ? (_jsx("div", { className: "wishlist-grid", children: wishlist.items.map((item) => item.product ? (_jsxs("article", { className: "wishlist-item", children: [_jsx(ProductCard, { product: item.product }), _jsxs("div", { className: "wishlist-actions", children: [_jsxs("button", { className: "wishlist-action wishlist-action--primary", disabled: Boolean(busy), onClick: () => void moveToCart(item.product?._id || '', item._id), children: ["Move to bag ", _jsx("span", { children: "\u2197" })] }), _jsx("button", { className: "wishlist-action wishlist-action--remove", disabled: Boolean(busy), onClick: () => void remove(item.product?._id || '', item._id), children: "Remove" })] })] }, item._id)) : null) })) : (_jsxs("div", { className: "empty-page", children: [_jsx("h1", { children: "Nothing saved yet." }), _jsx("p", { children: "Keep your favourite finds close." }), _jsx(Link, { className: "primary-button", to: "/products", children: "Browse products" })] }))] }));
}
