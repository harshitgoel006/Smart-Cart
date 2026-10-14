import { jsx as _jsx } from "react/jsx-runtime";
export function Loader({ label = 'Loading...' }) {
    return _jsx("div", { className: "ui-loader", role: "status", children: label });
}
