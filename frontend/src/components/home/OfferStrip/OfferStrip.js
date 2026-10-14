import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowRight, Sparkles, Tag, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
const offers = [
    { icon: Tag, title: 'Extra 10% off', detail: 'on your first order' },
    { icon: Truck, title: 'Free shipping', detail: 'on orders above ₹999' },
    { icon: Sparkles, title: 'Fresh finds daily', detail: 'new picks worth discovering' },
];
export function OfferStrip() {
    return (_jsxs("section", { className: "offer-strip", id: "deals", "aria-label": "SmartCart offers", children: [_jsxs("div", { className: "offer-strip__intro", children: [_jsx("span", { className: "offer-strip__spark", children: _jsx(Sparkles, { size: 16, "aria-hidden": "true" }) }), _jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "SmartCart offers" }), _jsx("strong", { children: "Little extras, better shopping." })] })] }), _jsx("div", { className: "offer-strip__items", children: offers.map(({ icon: Icon, title, detail }) => (_jsxs("div", { className: "offer-strip__item", children: [_jsx(Icon, { size: 18, strokeWidth: 1.8, "aria-hidden": "true" }), _jsxs("span", { children: [_jsx("b", { children: title }), _jsx("small", { children: detail })] })] }, title))) }), _jsxs(Link, { className: "offer-strip__link", to: "/products?discountPercentage=20", children: ["Shop deals ", _jsx(ArrowRight, { size: 17, "aria-hidden": "true" })] })] }));
}
