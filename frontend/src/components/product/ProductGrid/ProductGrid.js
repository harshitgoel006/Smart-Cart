import { jsx as _jsx } from "react/jsx-runtime";
import { ProductCard } from '../ProductCard/ProductCard';
export function ProductGrid({ products }) {
    return (_jsx("div", { className: "product-grid", children: products.map((product) => _jsx(ProductCard, { product: product }, product._id)) }));
}
