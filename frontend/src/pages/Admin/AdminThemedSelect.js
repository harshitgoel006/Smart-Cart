import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
export function AdminThemedSelect({ value, onChange, options, ariaLabel = 'Select option' }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const selected = options.find((option) => option.value === value)?.label || 'Select';
    useEffect(() => {
        const close = (event) => {
            if (ref.current && !ref.current.contains(event.target))
                setOpen(false);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);
    return (_jsxs("div", { ref: ref, className: "admin-themed-select", children: [_jsxs("button", { type: "button", className: "admin-themed-select__trigger", "aria-expanded": open, "aria-haspopup": "listbox", onClick: () => setOpen((current) => !current), children: [_jsx("span", { children: selected }), _jsx(ChevronDown, { size: 15, "aria-hidden": "true" })] }), open && _jsx("div", { className: "admin-themed-select__menu", role: "listbox", "aria-label": ariaLabel, children: options.map((option) => _jsx("button", { type: "button", role: "option", "aria-selected": value === option.value, className: value === option.value ? 'is-selected' : '', onClick: () => { onChange(option.value); setOpen(false); }, children: option.label }, option.value)) })] }));
}
