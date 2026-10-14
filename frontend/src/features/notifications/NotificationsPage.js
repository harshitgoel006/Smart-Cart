import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { ArrowUpRight, Bell, CheckCheck, CircleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { getJson, sendJson } from '../../services/apiClient';
import { SimpleAccountPage } from '../../components/ui/EmptyState/SimpleAccountPage';
export function NotificationsPage() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const load = () => getJson('/notifications/my-notifications?limit=30').then((data) => setItems(data.notifications || []));
    useEffect(() => { if (!user) {
        setLoading(false);
        return;
    } ; load().catch((error) => setMessage(error.message)).finally(() => setLoading(false)); }, [user]);
    const markRead = async (id) => { try {
        await sendJson(`/notifications/mark-notification-read/${id}`, 'PATCH');
        setItems((current) => current.map((item) => item._id === id ? { ...item, isRead: true } : item));
    }
    catch (error) {
        setMessage(error.message);
    } };
    const markAll = async () => { try {
        await sendJson('/notifications/mark-all-notifications-read', 'PATCH');
        setItems((current) => current.map((item) => ({ ...item, isRead: true })));
    }
    catch (error) {
        setMessage(error.message);
    } };
    if (!user)
        return _jsx(SimpleAccountPage, { title: "Your notifications are private.", text: "Sign in to see order and account updates.", link: "/login", linkText: "Sign in" });
    if (loading)
        return _jsx("main", { className: "section empty-page", children: _jsx("h1", { children: "Loading notifications..." }) });
    const unreadCount = items.filter((item) => !item.isRead).length;
    return _jsxs("main", { className: "notifications-page section", children: [_jsxs("section", { className: "notifications-hero", children: [_jsxs("div", { children: [_jsxs("span", { className: "eyebrow", children: [_jsx(Bell, { size: 14 }), " Stay in the loop"] }), _jsx("h1", { children: "Good to know." }), _jsx("p", { children: "Order updates, account activity and helpful SmartCart moments will appear here." })] }), items.length > 0 && _jsxs("button", { className: "outline-button", onClick: markAll, disabled: !unreadCount, children: [_jsx(CheckCheck, { size: 16 }), " ", unreadCount ? 'Mark all as read' : 'All caught up'] })] }), message && _jsxs("div", { className: "api-notice", children: [_jsx(CircleAlert, { size: 16 }), " ", message] }), items.length ? _jsx("div", { className: "notification-list", children: items.map((item) => _jsxs("article", { className: `notification-card ${item.isRead ? 'is-read' : ''}`, children: [_jsx("div", { className: "notification-card__icon", children: _jsx(Bell, { size: 18 }) }), _jsxs("div", { className: "notification-card__content", children: [_jsxs("div", { className: "notification-card__meta", children: [_jsx("span", { className: "eyebrow", children: item.category }), !item.isRead && _jsx("span", { className: "notification-unread", children: "New" })] }), _jsx("h3", { children: item.title }), _jsx("p", { children: item.message }), _jsx("small", { children: new Date(item.createdAt).toLocaleString('en-IN') })] }), _jsxs("div", { className: "notification-card__actions", children: [!item.isRead && _jsxs("button", { className: "outline-button", onClick: () => markRead(item._id), children: [_jsx(CheckCheck, { size: 14 }), " Mark read"] }), item.relatedEntity?.entityType === 'Order' && item.relatedEntity.entityId && _jsxs(Link, { className: "outline-button", to: `/orders/${item.relatedEntity.entityId}`, children: ["View order ", _jsx(ArrowUpRight, { size: 14 })] })] })] }, item._id)) }) : _jsxs("div", { className: "empty-page notifications-empty", children: [_jsx(Bell, { size: 32 }), _jsx("h1", { children: "All caught up." }), _jsx("p", { children: "Important SmartCart updates will appear here." }), _jsxs(Link, { className: "primary-button", to: "/products", children: ["Explore products ", _jsx(ArrowUpRight, { size: 16 })] })] })] });
}
