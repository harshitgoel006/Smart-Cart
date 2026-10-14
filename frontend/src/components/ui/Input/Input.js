import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Input({ label, id, ...props }) {
    return (_jsxs("label", { className: "ui-input", children: [label && _jsx("span", { children: label }), _jsx("input", { id: id, ...props })] }));
}
