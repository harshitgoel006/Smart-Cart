import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { aiApi } from '../../services/ai.api';
export function ProductAiTools({ product, related }) {
    const [summary, setSummary] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [comparison, setComparison] = useState(null);
    const [comparisonLoading, setComparisonLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    useEffect(() => {
        let active = true;
        setSummaryLoading(true);
        aiApi.reviewSummary(product._id).then((data) => { if (active)
            setSummary(data); }).catch(() => { if (active)
            setSummary(null); }).finally(() => { if (active)
            setSummaryLoading(false); });
        aiApi.recommendations([product._id], 4).then((data) => { if (active)
            setRecommendations(data); }).catch(() => { if (active)
            setRecommendations([]); });
        return () => { active = false; };
    }, [product._id]);
    const compareProduct = related[0];
    const compare = async () => { if (!compareProduct)
        return; setComparisonLoading(true); try {
        setComparison(await aiApi.compare([product._id, compareProduct._id]));
    }
    catch {
        setComparison(null);
    }
    finally {
        setComparisonLoading(false);
    } };
    return _jsxs("section", { className: "product-ai-tools section", "aria-label": "SmartCart AI product insights", children: [_jsxs("div", { className: "product-ai-tools__heading", children: [_jsxs("div", { children: [_jsxs("span", { className: "eyebrow", children: [_jsx(Sparkles, { size: 13 }), " SmartCart intelligence"] }), _jsx("h2", { children: "Shop with a little more confidence." })] }), _jsx("span", { className: "product-ai-tools__note", children: "AI-assisted insights" })] }), _jsxs("div", { className: "product-ai-tools__grid", children: [_jsxs("article", { className: "product-ai-card", children: [_jsx("span", { className: "product-ai-card__label", children: "Review digest" }), _jsx("h3", { children: "What shoppers are saying" }), summaryLoading ? _jsx("p", { className: "muted", children: "Reading verified reviews..." }) : summary ? _jsxs(_Fragment, { children: [_jsxs("div", { className: "product-ai-card__rating", children: [_jsx("strong", { children: summary.averageRating.toFixed(1) }), _jsxs("span", { children: ["\u2605 \u00B7 ", summary.reviewCount, " reviews"] })] }), _jsx("p", { children: summary.summary })] }) : _jsx("p", { className: "muted", children: "A review summary will appear as shoppers share more feedback." })] }), _jsxs("article", { className: "product-ai-card product-ai-card--compare", children: [_jsx("span", { className: "product-ai-card__label", children: "Smart comparison" }), _jsx("h3", { children: "Compare before you choose" }), _jsx("p", { children: compareProduct ? `See how ${product.name} compares with ${compareProduct.name}.` : 'More products from this collection will unlock a comparison.' }), _jsxs("button", { type: "button", className: "product-ai-card__button", onClick: compare, disabled: !compareProduct || comparisonLoading, children: [comparisonLoading ? 'Comparing...' : 'Compare picks', " ", _jsx(ArrowRight, { size: 15 })] }), comparison && _jsxs("div", { className: "product-ai-card__result", children: [_jsx("strong", { children: "AI take" }), _jsx("p", { children: comparison.summary })] })] })] }), recommendations.length > 0 && _jsxs("div", { className: "product-ai-recommendations", children: [_jsxs("div", { children: [_jsx("span", { className: "product-ai-card__label", children: "Picked for this product" }), _jsx("h3", { children: "Smart picks you may also like" })] }), _jsx("div", { className: "product-ai-recommendations__list", children: recommendations.map((item) => _jsxs(Link, { to: `/products/${item.id}`, children: [item.image ? _jsx("img", { src: item.image, alt: "" }) : _jsx("span", { className: "product-ai-recommendations__placeholder" }), _jsxs("span", { children: [_jsx("strong", { children: item.name }), _jsxs("small", { children: [item.brand || 'SmartCart pick', item.price ? ` · ${item.price}` : ''] })] }), _jsx(ArrowRight, { size: 14 })] }, item.id)) })] })] });
}
