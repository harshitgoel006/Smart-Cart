import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
const brands = [
    { name: 'Nike', logo: 'https://cdn.simpleicons.org/nike/2d2118', note: 'Move freely' },
    { name: 'Sony', logo: 'https://cdn.simpleicons.org/sony/2d2118', note: 'Made for sound' },
    { name: 'Lakmé', logo: 'https://cdn.simpleicons.org/lakme/2d2118', note: 'Beauty, everyday' },
    { name: 'IKEA', logo: 'https://cdn.simpleicons.org/ikea/2d2118', note: 'The home edit' },
    { name: 'boAt', logo: 'https://cdn.simpleicons.org/boat/2d2118', note: 'In your element' },
    { name: 'Titan', logo: 'https://cdn.simpleicons.org/titan/2d2118', note: 'Timeless details' },
    { name: 'Adidas', logo: 'https://cdn.simpleicons.org/adidas/2d2118', note: 'Impossible is nothing' },
    { name: 'Mamaearth', logo: 'https://cdn.simpleicons.org/mamaearth/2d2118', note: 'Goodness inside' },
];
export function BrandsShowcase() {
    return (_jsxs("section", { className: "brands-showcase section", "aria-labelledby": "brands-heading", children: [_jsxs("div", { className: "brands-showcase__header", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Brands worth knowing" }), _jsx("h2", { id: "brands-heading", children: "Good things, from names you trust." }), _jsx("p", { children: "Explore familiar favourites and discover your next everyday essential." })] }), _jsxs(Link, { className: "section-link", to: "/products", children: ["Explore brands ", _jsx(ArrowRight, { size: 16, strokeWidth: 1.8 })] })] }), _jsx("div", { className: "brands-showcase__rail", children: brands.map((brand) => (_jsxs(Link, { className: "brand-tile", to: `/products?brand=${encodeURIComponent(brand.name)}`, "aria-label": `Shop ${brand.name}`, children: [_jsxs("span", { className: "brand-tile__logo-wrap", children: [_jsx("img", { className: "brand-tile__logo", src: brand.logo, alt: `${brand.name} logo`, loading: "lazy", onError: (event) => {
                                        event.currentTarget.style.display = 'none';
                                        const fallback = event.currentTarget.nextElementSibling;
                                        if (fallback instanceof HTMLElement)
                                            fallback.style.display = 'block';
                                    } }), _jsx("strong", { className: "brand-tile__fallback", children: brand.name })] }), _jsx("span", { children: brand.note })] }, brand.name))) })] }));
}
