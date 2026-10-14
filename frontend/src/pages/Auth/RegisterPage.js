import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { sendForm, sendJson } from '../../services/apiClient';
export function RegisterPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('customer');
    const [roleOpen, setRoleOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [form, setForm] = useState({ fullname: '', username: '', phone: '', password: '' });
    const [avatar, setAvatar] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
    const sendOtp = async () => { setBusy(true); setError(''); try {
        await sendJson('/users/send-otp', 'POST', { email, role });
        setStep(2);
        setMessage('Verification code sent to your email.');
    }
    catch (reason) {
        setError(reason.message);
    }
    finally {
        setBusy(false);
    } };
    const verifyOtp = async () => { setBusy(true); setError(''); try {
        await sendJson('/users/verify-otp', 'POST', { email, otp });
        setStep(3);
        setMessage('Email verified. Complete your profile.');
    }
    catch (reason) {
        setError(reason.message);
    }
    finally {
        setBusy(false);
    } };
    const register = async (event) => { event.preventDefault(); if (!avatar) {
        setError('Please choose a profile image.');
        return;
    } ; setBusy(true); setError(''); const data = new FormData(); Object.entries({ ...form, email, role }).forEach(([key, value]) => data.append(key, value)); data.append('avatar', avatar); try {
        await sendForm('/users/register', data);
        navigate('/login');
    }
    catch (reason) {
        setError(reason.message);
    }
    finally {
        setBusy(false);
    } };
    return _jsx("main", { className: "auth-page section", children: _jsxs("div", { className: "auth-card", children: [_jsxs("span", { className: "eyebrow", children: ["Step ", step, " of 3"] }), _jsx("h1", { children: "Join the smarter way to shop." }), _jsx("p", { children: message || 'Create a SmartCart account in a few simple steps.' }), step === 1 && _jsxs("div", { className: "auth-form", children: [_jsxs("label", { children: ["Email", _jsx("input", { type: "email", required: true, value: email, onChange: (event) => setEmail(event.target.value) })] }), _jsxs("label", { children: ["Account type", _jsxs("div", { className: "auth-select", children: [_jsxs("button", { type: "button", className: "auth-select__trigger", onClick: () => setRoleOpen((current) => !current), "aria-expanded": roleOpen, children: [role === 'customer' ? 'Customer' : 'Seller', _jsx(ChevronDown, { size: 17, className: roleOpen ? 'is-open' : '' })] }), roleOpen && _jsxs("div", { className: "auth-select__menu", children: [_jsx("button", { type: "button", className: role === 'customer' ? 'is-active' : '', onClick: () => { setRole('customer'); setRoleOpen(false); }, children: "Customer" }), _jsx("button", { type: "button", className: role === 'seller' ? 'is-active' : '', onClick: () => { setRole('seller'); setRoleOpen(false); }, children: "Seller" })] })] })] }), _jsxs("button", { className: "primary-button", onClick: sendOtp, disabled: busy, children: [busy ? 'Sending...' : 'Send verification code', " ", _jsx("span", { children: "\u2197" })] })] }), step === 2 && _jsxs("div", { className: "auth-form", children: [_jsxs("label", { children: ["Verification code", _jsx("input", { inputMode: "numeric", required: true, value: otp, onChange: (event) => setOtp(event.target.value) })] }), _jsxs("button", { className: "primary-button", onClick: verifyOtp, disabled: busy, children: [busy ? 'Verifying...' : 'Verify email', " ", _jsx("span", { children: "\u2197" })] }), _jsx("button", { className: "link-button", onClick: () => setStep(1), children: "Use another email" })] }), step === 3 && _jsxs("form", { className: "auth-form", onSubmit: register, children: [_jsxs("label", { children: ["Full name", _jsx("input", { required: true, value: form.fullname, onChange: (event) => update('fullname', event.target.value) })] }), _jsxs("label", { children: ["Username", _jsx("input", { required: true, value: form.username, onChange: (event) => update('username', event.target.value) })] }), _jsxs("label", { children: ["Phone", _jsx("input", { required: true, inputMode: "numeric", value: form.phone, onChange: (event) => update('phone', event.target.value) })] }), _jsxs("label", { children: ["Password", _jsx("input", { required: true, type: "password", minLength: 6, value: form.password, onChange: (event) => update('password', event.target.value) })] }), _jsxs("label", { children: ["Profile image", _jsx("input", { required: true, type: "file", accept: "image/png,image/jpeg,image/webp", onChange: (event) => setAvatar(event.target.files?.[0] || null) })] }), _jsxs("button", { className: "primary-button", disabled: busy, children: [busy ? 'Creating account...' : 'Create account', " ", _jsx("span", { children: "\u2197" })] })] }), error && _jsx("div", { className: "form-error", children: error }), _jsxs("small", { children: ["Already have an account? ", _jsx(Link, { to: "/login", children: "Sign in" })] })] }) });
}
