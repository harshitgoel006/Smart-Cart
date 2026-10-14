import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Quote, Star } from 'lucide-react';
const testimonials = [
    {
        quote: 'The whole experience feels thoughtful—from finding something I liked to getting it delivered.',
        name: 'Ananya Mehta',
        detail: 'Verified shopper · New Delhi',
    },
    {
        quote: 'I came for one everyday essential and ended up discovering three things I genuinely needed.',
        name: 'Rohan Kapoor',
        detail: 'Verified shopper · Bengaluru',
    },
    {
        quote: 'Clean, simple and easy to browse. The recommendations actually felt useful, not random.',
        name: 'Priya Sharma',
        detail: 'Verified shopper · Mumbai',
    },
];
export function Testimonials() {
    return (_jsxs("section", { className: "testimonials section", "aria-labelledby": "testimonials-heading", children: [_jsxs("div", { className: "testimonials__intro", children: [_jsx("span", { className: "eyebrow", children: "Kind words" }), _jsx("h2", { id: "testimonials-heading", children: "Good finds are better shared." }), _jsx("p", { children: "Real thoughts from shoppers building a more considered everyday." })] }), _jsx("div", { className: "testimonials__grid", children: testimonials.map((testimonial) => (_jsxs("article", { className: "testimonial-card", children: [_jsxs("div", { className: "testimonial-card__top", children: [_jsx("span", { className: "testimonial-card__quote", children: _jsx(Quote, { size: 18, strokeWidth: 1.8 }) }), _jsx("span", { className: "testimonial-card__stars", "aria-label": "5 out of 5 stars", children: Array.from({ length: 5 }).map((_, index) => _jsx(Star, { size: 13, fill: "currentColor" }, index)) })] }), _jsxs("blockquote", { children: ["\u201C", testimonial.quote, "\u201D"] }), _jsxs("footer", { children: [_jsx("strong", { children: testimonial.name }), _jsx("span", { children: testimonial.detail })] })] }, testimonial.name))) })] }));
}
