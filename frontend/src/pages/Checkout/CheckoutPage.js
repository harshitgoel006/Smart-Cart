import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { getJson, sendJson } from '../../services/apiClient';
import { formatPrice } from '../../utils/formatters';
import { SimpleAccountPage } from '../../components/ui/EmptyState/SimpleAccountPage';
import { useSiteSettings } from '../../app/providers/SiteSettingsProvider';
export function CheckoutPage() {
    const { user } = useAuth();
    const settings = useSiteSettings();
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [selected, setSelected] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [couponCode, setCouponCode] = useState('');
    const [cart, setCart] = useState(null);
    const [newAddress, setNewAddress] = useState({ label: 'Home', street: '', city: '', state: '', pincode: '', country: 'India', isDefault: false });
    const [addingAddress, setAddingAddress] = useState(false);
    const [message, setMessage] = useState('');
    const [busy, setBusy] = useState(false);
    void settings;
    useEffect(() => { if (!user)
        return; Promise.all([getJson('/users/get-user'), getJson('/carts')]).then(([currentUser, currentCart]) => { const saved = currentUser.addresses || []; setAddresses(saved); const defaultIndex = saved.findIndex((address) => address.isDefault); setSelected(defaultIndex >= 0 ? defaultIndex : 0); setCart(currentCart); }).catch((error) => setMessage(error.message)); }, [user]);
    if (!user)
        return _jsx(SimpleAccountPage, { title: "Sign in before checkout.", text: "Your bag and address details are protected.", link: "/login", linkText: "Sign in" });
    const updateAddress = (key, value) => setNewAddress((current) => ({ ...current, [key]: value }));
    const saveAddress = async () => { setBusy(true); setMessage(''); try {
        const updated = await sendJson('/users/update-address', 'PATCH', newAddress);
        const next = Array.isArray(updated) ? updated : updated.addresses || [];
        setAddresses(next);
        const defaultIndex = next.findIndex((address) => address.isDefault);
        setSelected(defaultIndex >= 0 ? defaultIndex : Math.max(0, next.length - 1));
        setAddingAddress(false);
        setNewAddress({ label: 'Home', street: '', city: '', state: '', pincode: '', country: 'India', isDefault: false });
    }
    catch (error) {
        setMessage(error.message);
    }
    finally {
        setBusy(false);
    } };
    const placeOrder = async () => { const address = addresses[selected]; if (!address) {
        setMessage('Please select a saved address or add a new one.');
        return;
    } ; const shippingAddress = { fullName: user.fullname || user.username || 'SmartCart customer', mobile: user.phone || '', addressLine: address.street, city: address.city, state: address.state, pincode: address.pincode, country: address.country || 'India' }; setBusy(true); setMessage(''); try {
        const order = await sendJson('/orders/orders', 'POST', { shippingAddress, paymentMethod, couponCode: couponCode.trim() || undefined, fromCart: true });
        if (paymentMethod === 'ONLINE') {
            const payment = await sendJson('/payments/initiate', 'POST', { orderId: order._id });
            await sendJson('/payments/complete', 'POST', { paymentId: payment._id, status: 'success' });
        }
        ;
        navigate(`/orders/${order._id}`);
    }
    catch (error) {
        setMessage(error.message);
    }
    finally {
        setBusy(false);
    } };
    return _jsxs("main", { className: "checkout-page section", children: [_jsx("div", { className: "catalog-heading", children: _jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "Almost there" }), _jsx("h1", { children: "Checkout" }), _jsx("p", { children: "Choose where we should deliver your order." })] }) }), _jsxs("div", { className: "checkout-layout", children: [_jsxs("section", { className: "checkout-card", children: [_jsxs("div", { className: "checkout-card__heading", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "01 / Delivery" }), _jsx("h2", { children: "Shipping address" })] }), _jsx("button", { className: "link-button", onClick: () => setAddingAddress(!addingAddress), children: addingAddress ? 'Cancel' : '+ Add new' })] }), addingAddress ? _jsxs("div", { className: "address-form", children: [_jsxs("label", { children: ["Label", _jsx("input", { value: newAddress.label, onChange: (event) => updateAddress('label', event.target.value) })] }), _jsxs("label", { children: ["Address", _jsx("input", { value: newAddress.street, onChange: (event) => updateAddress('street', event.target.value) })] }), _jsxs("div", { className: "form-row", children: [_jsxs("label", { children: ["City", _jsx("input", { value: newAddress.city, onChange: (event) => updateAddress('city', event.target.value) })] }), _jsxs("label", { children: ["State", _jsx("input", { value: newAddress.state, onChange: (event) => updateAddress('state', event.target.value) })] })] }), _jsxs("label", { children: ["PIN code", _jsx("input", { inputMode: "numeric", value: newAddress.pincode, onChange: (event) => updateAddress('pincode', event.target.value) })] }), _jsxs("label", { className: "check-label", children: [_jsx("input", { type: "checkbox", checked: !!newAddress.isDefault, onChange: (event) => updateAddress('isDefault', event.target.checked) }), " Make default"] }), _jsx("button", { className: "primary-button", onClick: saveAddress, disabled: busy, children: "Save address" })] }) : addresses.length ? _jsx("div", { className: "address-list", children: addresses.map((address, index) => _jsxs("button", { type: "button", className: `address-option ${selected === index ? 'selected' : ''}`, onClick: () => setSelected(index), children: [_jsx("span", { children: selected === index ? '●' : '○' }), _jsxs("div", { children: [_jsxs("strong", { children: [address.label, address.isDefault ? ' · Default' : ''] }), _jsxs("p", { children: [address.street, ", ", address.city, ", ", address.state, " - ", address.pincode] })] })] }, `${address.label}-${address.pincode}`)) }) : _jsx("div", { className: "section-empty", children: "No saved addresses found. Use \u201CAdd new\u201D to save one." }), _jsx("div", { className: "checkout-card__heading checkout-divider", children: _jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "02 / Payment" }), _jsx("h2", { children: "Payment method" })] }) }), _jsxs("div", { className: "payment-options", children: [_jsxs("button", { type: "button", className: paymentMethod === 'COD' ? 'selected' : '', onClick: () => setPaymentMethod('COD'), children: [_jsx("strong", { children: "Cash on delivery" }), _jsx("small", { children: "Pay when your order arrives" })] }), _jsxs("button", { type: "button", className: paymentMethod === 'ONLINE' ? 'selected' : '', onClick: () => setPaymentMethod('ONLINE'), children: [_jsx("strong", { children: "Online payment" }), _jsx("small", { children: "Complete with SmartCart demo payment" })] })] })] }), _jsxs("aside", { className: "checkout-summary", children: [_jsx("span", { className: "eyebrow", children: "Order summary" }), _jsx("h2", { children: formatPrice(cart?.finalAmount) }), _jsxs("p", { children: ["Subtotal ", _jsx("b", { children: formatPrice(cart?.subtotal) })] }), _jsxs("p", { children: ["Discount ", _jsxs("b", { children: ["-", formatPrice(cart?.discountAmount)] })] }), _jsxs("label", { className: "coupon-field", children: ["Coupon code", _jsx("input", { placeholder: "Enter code", value: couponCode, onChange: (event) => setCouponCode(event.target.value) })] }), message && _jsx("div", { className: "form-error", children: message }), _jsxs("button", { className: "primary-button", onClick: placeOrder, disabled: busy || !cart?.items?.length || !addresses.length, children: [busy ? 'Placing order...' : 'Place order', " ", _jsx("span", { children: "\u2197" })] }), _jsx(Link, { className: "back-link", to: "/cart", children: "\u2190 Back to bag" })] })] })] });
}
