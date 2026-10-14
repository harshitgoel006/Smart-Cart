import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { getJson } from '../../services/apiClient';
const SiteSettingsContext = createContext({ refresh: async () => undefined });
export const useSiteSettings = () => useContext(SiteSettingsContext);
export function SiteSettingsProvider({ children }) {
    const [settings, setSettings] = useState({});
    const refresh = async () => {
        const nextSettings = await getJson('/site-settings');
        setSettings(nextSettings);
    };
    useEffect(() => { void refresh().catch(() => undefined); }, []);
    useEffect(() => {
        const theme = settings.theme;
        const featureRoot = document.documentElement;
        for (const [key, value] of Object.entries(settings.features || {})) {
            featureRoot.dataset[`feature${key.charAt(0).toUpperCase()}${key.slice(1)}`] = value === false ? 'off' : 'on';
        }
        if (theme) {
            const root = document.documentElement;
            if (theme.primaryColor) {
                root.style.setProperty('--admin-primary', theme.primaryColor);
                root.style.setProperty('--deep', theme.primaryColor);
                root.style.setProperty('--ink', theme.primaryColor);
            }
            if (theme.backgroundColor) {
                root.style.setProperty('--site-background', theme.backgroundColor);
                root.style.setProperty('--cream', theme.backgroundColor);
            }
            if (theme.accentColor) {
                root.style.setProperty('--site-accent', theme.accentColor);
                root.style.setProperty('--accent', theme.accentColor);
            }
        }
        if (settings.seo?.title)
            document.title = settings.seo.title;
        if (settings.brand?.faviconUrl) {
            const link = document.querySelector('link[rel="icon"]') || document.createElement('link');
            link.rel = 'icon';
            link.href = settings.brand.faviconUrl;
            document.head.appendChild(link);
        }
    }, [settings]);
    return _jsx(SiteSettingsContext.Provider, { value: { ...settings, refresh }, children: children });
}
