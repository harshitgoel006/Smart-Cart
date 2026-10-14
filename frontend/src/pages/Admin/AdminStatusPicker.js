import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
const options = [
    ['pending', 'Pending'],
    ['confirmed', 'Confirmed'],
    ['shipped', 'Shipped'],
    ['delivered', 'Delivered'],
    ['cancelled', 'Cancelled'],
];
export function AdminStatusPicker({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const pickerRef = useRef(null);
    const label = options.find(([optionValue]) => optionValue === value)?.[1] ?? 'Select status';
    useEffect(() => {
        const closeOnOutsideClick = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', closeOnOutsideClick);
        return () => document.removeEventListener('mousedown', closeOnOutsideClick);
    }, []);
    return (_jsxs("div", { ref: pickerRef, className: "admin-status-picker", children: [_jsxs("button", { type: "button", className: "admin-status-picker__trigger", "aria-expanded": open, "aria-haspopup": "listbox", onClick: () => setOpen((isOpen) => !isOpen), children: [_jsx("span", { children: label }), _jsx(ChevronDown, { size: 15, "aria-hidden": "true" })] }), open && (_jsx("div", { className: "admin-status-picker__menu", role: "listbox", "aria-label": "Order status", children: options.map(([optionValue, optionLabel]) => (_jsx("button", { type: "button", role: "option", "aria-selected": value === optionValue, className: value === optionValue ? 'is-selected' : undefined, onClick: () => {
                        onChange(optionValue);
                        setOpen(false);
                    }, children: optionLabel }, optionValue))) }))] }));
}
