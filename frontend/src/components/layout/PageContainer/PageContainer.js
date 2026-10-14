import { jsx as _jsx } from "react/jsx-runtime";
export function PageContainer({ children, className = '' }) {
    return _jsx("main", { className: `section ${className}`.trim(), children: children });
}
