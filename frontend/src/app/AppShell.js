import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './providers/AuthProvider';
import { Footer } from '../components/layout/Footer/Footer';
import { Header } from '../components/layout/Header/Header';
import { AiShoppingAssistant } from '../components/ai/AiShoppingAssistant/AiShoppingAssistant';
import { TrustStrip } from '../components/home/TrustStrip/TrustStrip';

export function AppShell({ children }) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const isAdminArea = pathname.startsWith('/admin');
  const isSellerArea = pathname.startsWith('/seller');
  if (user?.role === 'seller' && !isSellerArea) return _jsx(Navigate, { to: '/seller', replace: true });
  return _jsxs('div', { className: 'app-shell', children: [
    _jsx(Header, {}),
    isSellerArea && _jsxs('div', { className: 'seller-quick-nav', children: [_jsx(Link, { to: '/seller', children: 'Dashboard' }), _jsx(Link, { to: '/seller/tools', children: 'Advanced tools' }), _jsx(Link, { className: pathname === '/seller/insights' ? 'is-active' : '', to: '/seller/insights', children: 'Insights' }), _jsx(Link, { to: '/seller/notifications', children: 'Notifications' })] }),
    children,
    !isAdminArea && !isSellerArea && _jsx(TrustStrip, {}),
    !isAdminArea && !isSellerArea && _jsx(Footer, {}),
    !isAdminArea && !isSellerArea && _jsx(AiShoppingAssistant, {})
  ] });
}
