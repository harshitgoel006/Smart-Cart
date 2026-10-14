import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { X } from 'lucide-react';
export function AdminRejectButton({ type, busy = false, onConfirm }) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState('');
    const close = () => {
        if (busy)
            return;
        setOpen(false);
        setReason('');
    };
    return _jsxs(_Fragment, { children: [_jsx("button", { type: "button", className: type === 'product' ? 'icon-action icon-action--bad' : 'small-action small-action--danger', disabled: busy, onClick: () => setOpen(true), title: `Reject ${type}`, children: type === 'product' ? _jsx(X, { size: 15 }) : 'Reject' }), open && _jsx("div", { className: "admin-reject-backdrop", role: "presentation", onMouseDown: (event) => { if (event.target === event.currentTarget)
                    close(); }, children: _jsxs("section", { className: "admin-reject-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "admin-reject-title", children: [_jsxs("div", { className: "admin-reject-dialog__header", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Moderation decision" }), _jsxs("h2", { id: "admin-reject-title", children: ["Reject ", type] })] }), _jsx("button", { type: "button", className: "icon-action", onClick: close, "aria-label": "Close rejection dialog", children: _jsx(X, { size: 18 }) })] }), _jsxs("p", { className: "admin-helper", children: ["Add a clear reason so the ", type, " owner knows what needs to be corrected."] }), _jsxs("label", { children: ["Reason", _jsx("textarea", { autoFocus: true, value: reason, onChange: (event) => setReason(event.target.value), placeholder: `Why is this ${type} being rejected?`, rows: 4 })] }), _jsxs("div", { className: "admin-button-row admin-reject-dialog__actions", children: [_jsx("button", { type: "button", className: "outline-button", onClick: close, children: "Cancel" }), _jsxs("button", { type: "button", className: "small-action small-action--danger", disabled: !reason.trim() || busy, onClick: () => { onConfirm(reason.trim()); setOpen(false); setReason(''); }, children: ["Reject ", type] })] })] }) })] });
}
