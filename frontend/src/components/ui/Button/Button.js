import { jsx as _jsx } from "react/jsx-runtime";
export function Button({ children, variant = 'primary', className = '', ...props }) {
    return (_jsx("button", { className: `ui-button ui-button--${variant} ${className}`.trim(), ...props, children: children }));
}
