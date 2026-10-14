import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { sendJson } from '../../services/apiClient';
export function SavedAddressActions({ user, refreshUser, onMessage, onError }) {
    const [busy, setBusy] = useState('');
    const [editing, setEditing] = useState(null);
    const remove = async (label) => {
        if (!window.confirm(`Delete the ${label} address?`))
            return;
        setBusy(label);
        try {
            await sendJson('/users/delete-address', 'DELETE', { label });
            await refreshUser();
            onMessage('Address deleted.');
        }
        catch (reason) {
            onError(reason.message);
        }
        finally {
            setBusy('');
        }
    };
    const save = async (event) => {
        event.preventDefault();
        if (!editing)
            return;
        setBusy(editing.label);
        try {
            await sendJson('/users/update-address', 'PATCH', editing);
            await refreshUser();
            setEditing(null);
            onMessage('Address updated.');
        }
        catch (reason) {
            onError(reason.message);
        }
        finally {
            setBusy('');
        }
    };
    if (!user.addresses?.length)
        return null;
    return _jsxs("section", { className: "saved-address-actions account-section", children: [_jsxs("div", { className: "saved-address-actions__heading", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Address controls" }), _jsx("h3", { children: "Manage saved addresses" })] }), _jsxs("span", { children: [user.addresses.length, " saved"] })] }), user.addresses.map((address) => _jsxs("div", { className: "saved-address-actions__row", children: [_jsx("span", { children: address.label }), _jsxs("div", { children: [_jsxs("button", { type: "button", className: "address-action-button", onClick: () => setEditing(address), children: [_jsx(Pencil, { size: 13 }), " Edit"] }), _jsxs("button", { type: "button", className: "address-action-button address-action-button--danger", disabled: busy === address.label, onClick: () => remove(address.label), children: [_jsx(Trash2, { size: 13 }), " Delete"] })] })] }, `${address.label}-${address.pincode}`)), editing && _jsxs("form", { className: "saved-address-actions__edit", onSubmit: save, children: [_jsxs("strong", { children: ["Edit ", editing.label, " address"] }), _jsx("input", { value: editing.street, onChange: (event) => setEditing({ ...editing, street: event.target.value }), placeholder: "Street address", required: true }), _jsxs("div", { children: [_jsx("input", { value: editing.city, onChange: (event) => setEditing({ ...editing, city: event.target.value }), placeholder: "City", required: true }), _jsx("input", { value: editing.state, onChange: (event) => setEditing({ ...editing, state: event.target.value }), placeholder: "State", required: true }), _jsx("input", { value: editing.pincode, onChange: (event) => setEditing({ ...editing, pincode: event.target.value }), placeholder: "PIN code", required: true })] }), _jsxs("label", { className: "check-label", children: [_jsx("input", { type: "checkbox", checked: !!editing.isDefault, onChange: (event) => setEditing({ ...editing, isDefault: event.target.checked }) }), " Make this the default address"] }), _jsxs("div", { children: [_jsx("button", { type: "submit", className: "ghost-dark-button", disabled: !!busy, children: "Save changes" }), _jsx("button", { type: "button", className: "link-button", onClick: () => setEditing(null), children: "Cancel" })] })] })] });
}
