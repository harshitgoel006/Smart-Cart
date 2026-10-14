import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/globals.css';
import { AppRoutes } from './routes';
import { AppShell } from './AppShell';
import { AuthProvider } from './providers/AuthProvider';
import { SiteSettingsProvider } from './providers/SiteSettingsProvider';
function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        const previousRestoration = window.history.scrollRestoration;
        window.history.scrollRestoration = 'manual';
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        return () => {
            window.history.scrollRestoration = previousRestoration;
        };
    }, [pathname]);
    return null;
}
function App() {
    return (_jsxs(BrowserRouter, { children: [_jsx(ScrollToTop, {}), _jsx(AuthProvider, { children: _jsx(SiteSettingsProvider, { children: _jsx(AppShell, { children: _jsx(AppRoutes, {}) }) }) })] }));
}
export default App;
