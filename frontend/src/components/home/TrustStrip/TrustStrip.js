import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Headphones, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
const values = [
    { icon: ShieldCheck, title: 'Secure payments', description: 'Protected checkout, every time' },
    { icon: Truck, title: 'Reliable delivery', description: 'Carefully packed and sent your way' },
    { icon: RotateCcw, title: 'Easy 7-day returns', description: 'Shop with complete confidence' },
    { icon: Headphones, title: 'Here to help', description: 'Friendly support when you need it' },
];
export function TrustStrip() {
    return (_jsx("section", { className: "value-strip trust-badges section", "aria-label": "SmartCart promises", children: values.map(({ icon: Icon, title, description }) => (_jsxs("div", { children: [_jsx("span", { className: "value-icon", children: _jsx(Icon, { size: 18, strokeWidth: 1.8 }) }), _jsxs("div", { children: [_jsx("strong", { children: title }), _jsx("small", { children: description })] })] }, title))) }));
}
