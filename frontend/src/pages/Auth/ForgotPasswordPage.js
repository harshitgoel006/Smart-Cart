import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendJson } from '../../services/apiClient';
export function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const requestOtp = async (event) => { event.preventDefault(); setBusy(true); setError(''); try {
        await sendJson('/users/send-reset-otp', 'POST', { email });
        setMessage('If an account exists, a verification code has been sent to your email.');
        setStep(2);
    }
    catch (reason) {
        setError(reason.message);
    }
    finally {
        setBusy(false);
    } };
    const verifyOtp = async (event) => { event.preventDefault(); setBusy(true); setError(''); try {
        await sendJson('/users/verify-reset-otp', 'POST', { email, otp });
        setStep(3);
        setMessage('Code verified. Choose a new password.');
    }
    catch (reason) {
        setError(reason.message);
    }
    finally {
        setBusy(false);
    } };
    const resetPassword = async (event) => { event.preventDefault(); setBusy(true); setError(''); try {
        await sendJson('/users/reset-password', 'POST', { email, otp, newPassword });
        setMessage('Password reset successfully. You can sign in now.');
        setTimeout(() => navigate('/login'), 900);
    }
    catch (reason) {
        setError(reason.message);
    }
    finally {
        setBusy(false);
    } };
    return _jsx("main", { className: "auth-page section", children: _jsxs("div", { className: "auth-card", children: [_jsxs("span", { className: "eyebrow", children: ["Account recovery \u00B7 Step ", step, " of 3"] }), _jsx("h1", { children: "Get back into your account." }), _jsx("p", { children: message || 'We will send a one-time code to verify your email.' }), step === 1 && _jsxs("form", { className: "auth-form", onSubmit: requestOtp, children: [_jsxs("label", { children: ["Email", _jsx("input", { type: "email", required: true, value: email, onChange: (event) => setEmail(event.target.value) })] }), _jsxs("button", { className: "primary-button", disabled: busy, children: [busy ? 'Sending...' : 'Send recovery code', " ", _jsx("span", { children: "\u2197" })] })] }), step === 2 && _jsxs("form", { className: "auth-form", onSubmit: verifyOtp, children: [_jsxs("label", { children: ["Verification code", _jsx("input", { inputMode: "numeric", required: true, minLength: 6, maxLength: 6, value: otp, onChange: (event) => setOtp(event.target.value) })] }), _jsxs("button", { className: "primary-button", disabled: busy, children: [busy ? 'Checking...' : 'Verify code', " ", _jsx("span", { children: "\u2197" })] }), _jsx("button", { type: "button", className: "link-button", onClick: () => setStep(1), children: "Use another email" })] }), step === 3 && _jsxs("form", { className: "auth-form", onSubmit: resetPassword, children: [_jsxs("label", { children: ["New password", _jsx("input", { type: "password", required: true, minLength: 6, value: newPassword, onChange: (event) => setNewPassword(event.target.value) })] }), _jsxs("button", { className: "primary-button", disabled: busy, children: [busy ? 'Updating...' : 'Reset password', " ", _jsx("span", { children: "\u2197" })] })] }), error && _jsx("div", { className: "form-error", children: error }), _jsx("small", { children: _jsx(Link, { to: "/login", children: "Back to sign in" }) })] }) });
}
