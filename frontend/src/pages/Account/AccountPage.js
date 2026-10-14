import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Bell, Check, LogOut, MapPin, Package, ShoppingBag, ShieldCheck, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { sendForm, sendJson } from '../../services/apiClient';
import { SimpleAccountPage } from '../../components/ui/EmptyState/SimpleAccountPage';
import { SavedAddressActions } from './SavedAddressActions';
import { useSiteSettings } from '../../app/providers/SiteSettingsProvider';
const blankAddress = { label: '', street: '', city: '', state: '', pincode: '', country: 'India', isDefault: false };
export function AccountPage() {
    const { user, logout, loading, refreshUser } = useAuth();
    const settings = useSiteSettings();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const [profile, setProfile] = useState({ fullname: user?.fullname || '', username: user?.username || '', phone: user?.phone || '', email: user?.email || '' });
    const [address, setAddress] = useState(blankAddress);
    const [password, setPassword] = useState({ oldPassword: '', newPassword: '' });
    const emailVerificationPending = false;
    const emailOtp = '';
    const setEmailOtp = (_value) => undefined;
    const verifyEmail = (event) => event.preventDefault();
    useEffect(() => {
        if (user) {
            setProfile({ fullname: user.fullname || '', username: user.username || '', phone: user.phone || '', email: user.email || '' });
        }
    }, [user]);
    if (loading)
        return _jsx("main", { className: "section empty-page", children: _jsx("h1", { children: "Loading account..." }) });
    if (!user)
        return _jsx(SimpleAccountPage, { title: "Your account", text: "Sign in to manage your profile, addresses and orders.", link: "/login", linkText: "Sign in" });
    const startAction = () => { setBusy(true); setError(''); setMessage(''); };
    const updateProfile = async (event) => { event.preventDefault(); startAction(); try {
        await sendJson('/users/update-account', 'PATCH', profile);
        await refreshUser();
        setMessage('Profile details saved.');
    }
    catch (reason) {
        setError(reason.message);
    }
    finally {
        setBusy(false);
    } };
    const uploadAvatar = async (event) => { const file = event.target.files?.[0]; if (!file)
        return; startAction(); try {
        const form = new FormData();
        form.append('avatar', file);
        await sendForm('/users/update-avatar', form, 'PATCH');
        await refreshUser();
        setMessage('Profile image updated.');
    }
    catch (reason) {
        setError(reason.message);
    }
    finally {
        setBusy(false);
    } };
    const saveAddress = async (event) => { event.preventDefault(); startAction(); try {
        await sendJson('/users/update-address', 'PATCH', address);
        await refreshUser();
        setAddress(blankAddress);
        setMessage('Address saved.');
    }
    catch (reason) {
        setError(reason.message);
    }
    finally {
        setBusy(false);
    } };
    const changePassword = async (event) => { event.preventDefault(); startAction(); try {
        await sendJson('/users/change-password', 'POST', password);
        setPassword({ oldPassword: '', newPassword: '' });
        setMessage('Password changed successfully.');
    }
    catch (reason) {
        setError(reason.message);
    }
    finally {
        setBusy(false);
    } };
    const updateProfileField = (key, value) => { if (key === 'email' || key === 'phone')
        return; setProfile((current) => ({ ...current, [key]: value })); };
    const updateAddressField = (key, value) => setAddress((current) => ({ ...current, [key]: value }));
    const displayName = user.fullname || user.username || 'there';
    return _jsxs("main", { className: "account-page section", children: [_jsxs("section", { className: "account-hero", children: [_jsx("div", { className: "account-avatar", children: user.avatar ? _jsx("img", { src: user.avatar, alt: "Profile" }) : _jsx(UserRound, { size: 34 }) }), _jsxs("div", { className: "account-hero__copy", children: [_jsx("span", { className: "eyebrow", children: "Your SmartCart account" }), _jsxs("h1", { children: ["Hello, ", displayName, "."] }), _jsxs("p", { children: [user.email, " ", _jsx("span", { children: "\u00B7" }), " ", user.role === 'seller' ? 'Seller account' : 'Customer account'] })] }), _jsxs("label", { className: "account-avatar__upload", children: ["Change photo", _jsx("input", { type: "file", accept: "image/png,image/jpeg,image/webp", onChange: uploadAvatar, disabled: busy })] })] }), message && _jsxs("div", { className: "inline-message account-notice", children: [_jsx(Check, { size: 16 }), message] }), error && _jsx("div", { className: "form-error account-notice", children: error }), _jsxs("nav", { className: "account-quick-links", "aria-label": "Account shortcuts", children: [_jsxs(Link, { to: "/orders", children: [_jsx(Package, { size: 17 }), " Orders"] }), settings.features?.wishlist !== false && _jsxs(Link, { to: "/wishlist", children: [_jsx(UserRound, { size: 17 }), " Wishlist"] }), _jsxs(Link, { to: "/cart", children: [_jsx(ShoppingBag, { size: 17 }), " Your bag"] }), _jsxs(Link, { to: "/notifications", children: [_jsx(Bell, { size: 17 }), " Notifications"] }), _jsxs("button", { onClick: logout, children: [_jsx(LogOut, { size: 17 }), " Sign out"] })] }), _jsxs("div", { className: "account-content-grid", children: [_jsxs("section", { className: "account-section", children: [_jsxs("div", { className: "account-section__heading", children: [_jsx("span", { className: "account-section__icon", children: _jsx(UserRound, { size: 17 }) }), _jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Profile" }), _jsx("h2", { children: "Personal details" })] })] }), _jsxs("form", { className: "account-form", onSubmit: updateProfile, children: [_jsxs("div", { className: "account-form__row", children: [_jsxs("label", { children: ["Full name", _jsx("input", { value: profile.fullname, onChange: (event) => updateProfileField('fullname', event.target.value) })] }), _jsxs("label", { children: ["Username", _jsx("input", { value: profile.username, onChange: (event) => updateProfileField('username', event.target.value) })] })] }), _jsxs("div", { className: "account-form__row", children: [_jsxs("label", { children: ["Phone", _jsx("input", { value: profile.phone, onChange: (event) => updateProfileField('phone', event.target.value) })] }), _jsxs("label", { children: ["Email", _jsx("input", { type: "email", value: profile.email, onChange: (event) => updateProfileField('email', event.target.value) })] })] }), _jsxs("button", { className: "primary-button", disabled: busy, children: ["Save details ", _jsx("span", { children: "\u2197" })] })] }), emailVerificationPending && _jsxs("form", { className: "email-verify-form", onSubmit: verifyEmail, children: [_jsxs("p", { children: ["We sent a 6-digit code to ", _jsx("strong", { children: profile.email }), "."] }), _jsxs("div", { children: [_jsx("input", { inputMode: "numeric", maxLength: 6, required: true, value: emailOtp, onChange: (event) => setEmailOtp(event.target.value), placeholder: "Verification code" }), _jsx("button", { className: "ghost-dark-button", disabled: busy, children: "Verify email" })] })] })] }), _jsxs("section", { className: "account-section", children: [_jsxs("div", { className: "account-section__heading", children: [_jsx("span", { className: "account-section__icon", children: _jsx(ShieldCheck, { size: 17 }) }), _jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Security" }), _jsx("h2", { children: "Password" })] })] }), _jsx("p", { className: "account-section__hint", children: "Keep your account protected with a strong, private password." }), _jsxs("form", { className: "account-form", onSubmit: changePassword, children: [_jsxs("label", { children: ["Current password", _jsx("input", { type: "password", required: true, value: password.oldPassword, onChange: (event) => setPassword({ ...password, oldPassword: event.target.value }) })] }), _jsxs("label", { children: ["New password", _jsx("input", { type: "password", minLength: 6, required: true, value: password.newPassword, onChange: (event) => setPassword({ ...password, newPassword: event.target.value }) })] }), _jsxs("button", { className: "primary-button", disabled: busy, children: ["Update password ", _jsx("span", { children: "\u2197" })] })] })] })] }), _jsxs("section", { className: "account-section account-addresses", children: [_jsxs("div", { className: "account-section__heading", children: [_jsx("span", { className: "account-section__icon", children: _jsx(MapPin, { size: 17 }) }), _jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Delivery book" }), _jsx("h2", { children: "Saved addresses" })] })] }), user.addresses?.length ? _jsx("div", { className: "saved-addresses", children: user.addresses.map((item) => _jsxs("div", { className: "saved-address", children: [_jsx("strong", { children: item.label }), item.isDefault && _jsx("span", { className: "address-default", children: "Default" }), _jsxs("span", { children: [item.street, ", ", item.city, ", ", item.state, " - ", item.pincode] })] }, `${item.label}-${item.pincode}`)) }) : _jsx("p", { className: "account-section__hint", children: "Add an address to make checkout quicker next time." }), _jsxs("form", { className: "account-form address-form", onSubmit: saveAddress, children: [_jsxs("div", { className: "account-form__row", children: [_jsxs("label", { children: ["Label", _jsx("input", { required: true, value: address.label, onChange: (event) => updateAddressField('label', event.target.value), placeholder: "Home or work" })] }), _jsxs("label", { children: ["Street address", _jsx("input", { required: true, value: address.street, onChange: (event) => updateAddressField('street', event.target.value) })] })] }), _jsxs("div", { className: "account-form__row", children: [_jsxs("label", { children: ["City", _jsx("input", { required: true, value: address.city, onChange: (event) => updateAddressField('city', event.target.value) })] }), _jsxs("label", { children: ["State", _jsx("input", { required: true, value: address.state, onChange: (event) => updateAddressField('state', event.target.value) })] }), _jsxs("label", { children: ["PIN code", _jsx("input", { required: true, value: address.pincode, onChange: (event) => updateAddressField('pincode', event.target.value) })] })] }), _jsxs("label", { className: "check-label", children: [_jsx("input", { type: "checkbox", checked: !!address.isDefault, onChange: (event) => updateAddressField('isDefault', event.target.checked) }), " Make this the default address"] }), _jsxs("button", { className: "primary-button", disabled: busy, children: ["Save address ", _jsx("span", { children: "\u2197" })] })] })] }), _jsx(SavedAddressActions, { user: user, refreshUser: refreshUser, onMessage: setMessage, onError: setError })] });
}
