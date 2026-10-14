import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function EmptyState({ title, description, action }) {
    return (_jsxs("div", { className: "section-empty", children: [_jsx("h3", { children: title }), description && _jsx("p", { children: description }), action] }));
}
