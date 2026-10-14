import { jsxs as _jsxs } from "react/jsx-runtime";
export function ProductRating({ rating, reviews }) {
    return _jsxs("span", { className: "rating-row", children: ["\u2605 ", Number(rating || 0).toFixed(1), " ", _jsxs("span", { className: "muted", children: ["(", reviews || 0, ")"] })] });
}
