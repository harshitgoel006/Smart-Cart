import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
export function SimpleAccountPage({ title, text, link, linkText }) { return _jsxs("main", { className: "section empty-page", children: [_jsx("span", { className: "eyebrow", children: "SmartCart" }), _jsx("h1", { children: title }), _jsx("p", { children: text }), _jsxs(Link, { className: "primary-button", to: link, children: [linkText, " ", _jsx("span", { children: "\u2197" })] })] }); }
