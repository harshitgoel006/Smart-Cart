import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useSiteSettings } from '../../../app/providers/SiteSettingsProvider';
import { aiApi } from '../../../services/ai.api';
import { ProductCard } from '../../product/ProductCard/ProductCard';
const filters = [
    { id: 'for-you', label: 'For you' },
    { id: 'popular', label: 'Popular now' },
    { id: 'value', label: 'Best value' },
];
function toProduct(suggestion) {
    return {
        _id: suggestion.id,
        name: suggestion.name,
        brand: suggestion.brand,
        finalPrice: suggestion.price,
        price: suggestion.originalPrice,
        discountPercentage: suggestion.discountPercentage,
        ratings: suggestion.rating,
        stock: suggestion.stock,
        images: suggestion.image ? [{ url: suggestion.image }] : [],
    };
}
export function AiRecommendations({ fallbackProducts }) {
    const { user } = useAuth();
    const settings = useSiteSettings();
    const [suggestions, setSuggestions] = useState([]);
    const [activeFilter, setActiveFilter] = useState('for-you');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [message, setMessage] = useState('');
    const loadRecommendations = useCallback(async (isRefresh = false) => {
        setMessage('');
        if (isRefresh)
            setRefreshing(true);
        else
            setLoading(true);
        try {
            const result = user
                ? await aiApi.personalizedRecommendations(8)
                : await aiApi.recommendations([], 8);
            setSuggestions(Array.isArray(result) ? result : []);
        }
        catch {
            setSuggestions([]);
            setMessage('Showing popular picks while we refresh your recommendations.');
        }
        finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user]);
    useEffect(() => {
        void loadRecommendations();
    }, [loadRecommendations]);
    const visibleProducts = useMemo(() => {
        const aiProducts = suggestions.map(toProduct);
        const baseProducts = aiProducts.length ? aiProducts : fallbackProducts;
        if (activeFilter === 'popular') {
            return fallbackProducts.length ? fallbackProducts.slice(0, 4) : baseProducts.slice(0, 4);
        }
        if (activeFilter === 'value') {
            return [...baseProducts]
                .sort((left, right) => (right.discountPercentage || 0) - (left.discountPercentage || 0))
                .slice(0, 4);
        }
        return baseProducts.slice(0, 4);
    }, [activeFilter, fallbackProducts, suggestions]);
    if (settings.features?.aiRecommendations === false)
        return null;
    return (_jsxs("section", { className: "section product-section product-section--featured ai-recommendation-section", id: "ai-recommendations", children: [_jsxs("div", { className: "category-showcase__intro", children: [_jsxs("div", { className: "category-showcase__heading", children: [_jsxs("span", { className: "eyebrow", children: [_jsx(Sparkles, { size: 13, strokeWidth: 2 }), " Smart picks"] }), _jsx("h2", { children: "Picked for you." }), _jsx("p", { children: user ? 'Recommendations shaped by your shopping journey, preferences, and the things you keep coming back to.' : 'A smarter edit of products worth discovering, chosen around the way you shop.' })] }), _jsxs(Link, { className: "section-link", to: "/products", children: ["Explore all ", _jsx(ArrowRight, { size: 16, strokeWidth: 1.8 })] })] }), _jsxs("div", { className: "ai-recommendation-section__toolbar", children: [_jsx("div", { className: "ai-recommendation-section__filters", role: "tablist", "aria-label": "Recommendation filters", children: filters.map((filter) => (_jsx("button", { type: "button", role: "tab", "aria-selected": activeFilter === filter.id, className: activeFilter === filter.id ? 'is-active' : '', onClick: () => setActiveFilter(filter.id), children: filter.label }, filter.id))) }), _jsxs("button", { className: "ai-recommendation-section__refresh", type: "button", onClick: () => void loadRecommendations(true), disabled: refreshing, children: [_jsx(RefreshCw, { size: 14, className: refreshing ? 'is-spinning' : '' }), refreshing ? 'Refreshing' : 'Refresh picks'] })] }), loading ? (_jsx("div", { className: "product-grid", children: Array.from({ length: 4 }).map((_, index) => _jsx("div", { className: "product-skeleton" }, index)) })) : visibleProducts.length ? (_jsx("div", { className: "product-grid", children: visibleProducts.map((product) => _jsx(ProductCard, { product: product }, product._id)) })) : (_jsx("div", { className: "section-empty", children: "Your recommendations will appear here as you explore SmartCart." })), message && _jsx("p", { className: "ai-recommendation-section__message", children: message })] }));
}
