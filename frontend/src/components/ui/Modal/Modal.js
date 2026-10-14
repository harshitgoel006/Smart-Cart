import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Modal({ open, title, children, onClose }) {
    if (!open)
        return null;
    return (_jsxs("div", { className: "ui-modal", role: "dialog", "aria-modal": "true", "aria-label": title, children: [_jsx("div", { className: "ui-modal__backdrop", onClick: onClose }), _jsxs("div", { className: "ui-modal__content", children: [_jsxs("div", { className: "ui-modal__header", children: [_jsx("h2", { children: title }), _jsx("button", { type: "button", onClick: onClose, "aria-label": "Close", children: "\u00D7" })] }), children] })] }));
}
