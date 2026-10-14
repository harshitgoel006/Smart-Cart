import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSiteSettings } from '../../../app/providers/SiteSettingsProvider';
export function AiShoppingAssistant() {
    const navigate = useNavigate();
    const settings = useSiteSettings();
    if (settings.features?.askAi === false)
        return null;
    return (_jsxs("button", { type: "button", className: "ai-assistant__trigger", onClick: () => navigate('/ai-shopping'), "aria-label": "Open SmartCart AI assistant", children: [_jsx(Sparkles, { size: 17, strokeWidth: 1.8 }), _jsx("strong", { children: "Ask AI" })] }));
}
