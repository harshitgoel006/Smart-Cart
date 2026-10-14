import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../../app/providers/AuthProvider';
import { SimpleAccountPage } from '../../components/ui/EmptyState/SimpleAccountPage';
export function LoginPage() {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    if (user) {
        const destination = user.role === 'admin' ? '/admin' : user.role === 'seller' ? '/seller' : '/account';
        const destinationLabel = user.role === 'admin' ? 'Open admin workspace' : user.role === 'seller' ? 'Open seller workspace' : 'View account';
        return _jsx(SimpleAccountPage, { title: "You are already signed in.", text: "Your SmartCart session is active.", link: destination, linkText: destinationLabel });
    }
    const submit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const loggedInUser = await login(email, password);
            const destination = loggedInUser.role === 'admin' ? '/admin' : loggedInUser.role === 'seller' ? '/seller' : '/';
            navigate(destination, { replace: true });
        }
        catch (reason) {
            setError(reason.message);
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsx("main", { className: "auth-page section", children: _jsxs("div", { className: "auth-card", children: [_jsxs("div", { className: "auth-card__brand", children: [_jsx("span", { className: "auth-card__logo", children: _jsx(ShoppingBag, { size: 22 }) }), _jsxs("span", { children: ["Smart", _jsx("strong", { children: "Cart" })] })] }), _jsx("h1", { children: "Welcome back." }), _jsx("p", { children: "Sign in to access your bag, wishlist and order history." }), _jsxs("form", { onSubmit: submit, children: [_jsxs("label", { children: ["Email", _jsx("input", { type: "email", required: true, value: email, onChange: (event) => setEmail(event.target.value) })] }), _jsxs("label", { children: ["Password", _jsx("input", { type: "password", required: true, value: password, onChange: (event) => setPassword(event.target.value) })] }), _jsx("div", { className: "auth-helper", children: _jsx(Link, { to: "/forgot-password", children: "Forgot password?" }) }), error && _jsx("div", { className: "form-error", children: error }), _jsxs("button", { className: "primary-button", disabled: submitting, children: [submitting ? 'Signing in...' : 'Sign in', " ", _jsx("span", { children: "\u2197" })] })] }), _jsxs("small", { children: ["New to SmartCart? ", _jsx(Link, { to: "/register", children: "Create an account" })] })] }) }));
}
