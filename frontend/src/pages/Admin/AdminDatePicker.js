import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
function parseDate(value) {
    if (!value)
        return new Date();
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
}
function formatValue(date) {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}
function isSameDay(left, right) {
    return left.toDateString() === right.toDateString();
}
export function AdminDatePicker({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const [month, setMonth] = useState(() => parseDate(value));
    const pickerRef = useRef(null);
    const selectedDate = value ? parseDate(value) : null;
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cells = Array.from({ length: firstDay + daysInMonth }, (_, index) => index < firstDay ? null : new Date(month.getFullYear(), month.getMonth(), index - firstDay + 1));
    useEffect(() => {
        const closeOnOutsideClick = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target))
                setOpen(false);
        };
        document.addEventListener('mousedown', closeOnOutsideClick);
        return () => document.removeEventListener('mousedown', closeOnOutsideClick);
    }, []);
    return (_jsxs("div", { ref: pickerRef, className: "admin-date-picker", children: [_jsxs("button", { type: "button", className: "admin-date-picker__trigger", "aria-expanded": open, onClick: () => setOpen((isOpen) => !isOpen), children: [_jsx("span", { children: selectedDate ? selectedDate.toLocaleDateString('en-GB') : 'dd-mm-yyyy' }), _jsx(CalendarDays, { size: 16, "aria-hidden": "true" })] }), open && _jsxs("div", { className: "admin-date-picker__menu", children: [_jsxs("div", { className: "admin-date-picker__header", children: [_jsx("button", { type: "button", onClick: () => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1)), "aria-label": "Previous month", children: _jsx(ChevronLeft, { size: 16 }) }), _jsx("strong", { children: month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }), _jsx("button", { type: "button", onClick: () => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1)), "aria-label": "Next month", children: _jsx(ChevronRight, { size: 16 }) })] }), _jsx("div", { className: "admin-date-picker__week", children: weekDays.map((day) => _jsx("span", { children: day }, day)) }), _jsx("div", { className: "admin-date-picker__days", children: cells.map((date, index) => date ? _jsx("button", { type: "button", className: selectedDate && isSameDay(date, selectedDate) ? 'is-selected' : undefined, onClick: () => { onChange(formatValue(date)); setOpen(false); }, children: date.getDate() }, index) : _jsx("span", {}, index)) }), _jsxs("div", { className: "admin-date-picker__footer", children: [_jsx("button", { type: "button", onClick: () => { onChange(''); setOpen(false); }, children: "Clear" }), _jsx("button", { type: "button", onClick: () => { const today = new Date(); onChange(formatValue(today)); setMonth(today); setOpen(false); }, children: "Today" })] })] })] }));
}
