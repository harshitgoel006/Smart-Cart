import { jsx as _jsx } from "react/jsx-runtime";
export function ErrorState({ message = 'Something went wrong.' }) {
    return _jsx("div", { className: "api-notice", children: message });
}
