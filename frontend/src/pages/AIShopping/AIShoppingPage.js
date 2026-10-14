import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, MessageCircle, Plus, Send, Trash2, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { aiApi } from '../../services/ai.api';
// v2 clears results created by the earlier loose OR-based recommendation search.
const STORAGE_KEY = 'smartcart.ai.chats.v2';
const MAX_CHATS = 10;
const CHAT_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
const suggestedPrompts = [
    'Find gifts under ₹2000',
    'Show me everyday essentials',
    'Help me upgrade my setup',
    'Find something for the weekend',
];
const welcomeMessage = {
    id: 'welcome',
    role: 'assistant',
    text: 'Hi, I am SmartCart AI. Tell me what you are looking for and I will find the right picks for you.',
};
const createChat = () => ({
    id: crypto.randomUUID(),
    title: 'New shopping chat',
    updatedAt: new Date().toISOString(),
    messages: [welcomeMessage],
});
const loadChats = () => {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return Array.isArray(stored)
            ? stored.filter((chat) => Date.now() - new Date(chat.updatedAt).getTime() <= CHAT_RETENTION_MS).slice(0, MAX_CHATS)
            : [];
    }
    catch {
        return [];
    }
};
export function AIShoppingPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [chats, setChats] = useState(loadChats);
    const [activeId, setActiveId] = useState('');
    const [message, setMessage] = useState(searchParams.get('prompt') || '');
    const [loading, setLoading] = useState(false);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [error, setError] = useState('');
    useEffect(() => {
        aiApi.recommendations([], 6).then(setFeaturedProducts).catch(() => setFeaturedProducts([]));
    }, []);
    useEffect(() => {
        if (!chats.length) {
            const chat = createChat();
            setChats([chat]);
            setActiveId(chat.id);
            return;
        }
        setActiveId((current) => current || chats[0].id);
    }, [chats]);
    useEffect(() => {
        if (chats.length)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(chats.slice(0, MAX_CHATS)));
    }, [chats]);
    const activeChat = useMemo(() => chats.find((chat) => chat.id === activeId) || chats[0], [activeId, chats]);
    const updateActiveChat = (updater) => {
        if (!activeChat)
            return;
        setChats((current) => current.map((chat) => (chat.id === activeChat.id ? updater(chat) : chat)));
    };
    const startNewChat = () => {
        const chat = createChat();
        setChats((current) => [chat, ...current].slice(0, MAX_CHATS));
        setActiveId(chat.id);
        setMessage('');
        setError('');
    };
    const deleteChat = (id) => {
        const remaining = chats.filter((chat) => chat.id !== id);
        if (!remaining.length) {
            const chat = createChat();
            setChats([chat]);
            setActiveId(chat.id);
            return;
        }
        setChats(remaining);
        if (id === activeId)
            setActiveId(remaining[0].id);
    };
    const submitMessage = async (event) => {
        event.preventDefault();
        const trimmed = message.trim();
        if (!trimmed || loading || !activeChat)
            return;
        updateActiveChat((chat) => ({
            ...chat,
            title: chat.messages.length <= 1 ? trimmed.slice(0, 34) : chat.title,
            updatedAt: new Date().toISOString(),
            messages: [...chat.messages, { id: crypto.randomUUID(), role: 'user', text: trimmed }],
        }));
        setMessage('');
        setError('');
        setLoading(true);
        try {
            const response = await aiApi.assist(trimmed);
            updateActiveChat((chat) => ({
                ...chat,
                updatedAt: new Date().toISOString(),
                messages: [...chat.messages, { id: crypto.randomUUID(), role: 'assistant', text: response.reply, products: response.products }],
            }));
        }
        catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Assistant is unavailable right now.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("main", { className: "ai-shopping-page", children: _jsxs("section", { className: "ai-shopping__shell", children: [_jsxs("aside", { className: "ai-shopping__sidebar", children: [_jsxs("div", { className: "ai-shopping__side-top", children: [_jsxs("div", { className: "ai-shopping__brand", children: [_jsx("span", { children: _jsx(MessageCircle, { size: 16 }) }), " SmartCart AI"] }), _jsxs("button", { type: "button", className: "ai-shopping__new", onClick: startNewChat, children: [_jsx(Plus, { size: 16 }), " New chat"] })] }), _jsx("p", { className: "ai-shopping__history-label", children: "Recent chats" }), _jsx("div", { className: "ai-shopping__history", children: chats.map((chat) => (_jsxs("div", { className: `ai-shopping__history-item ${chat.id === activeId ? 'is-active' : ''}`, children: [_jsxs("button", { type: "button", onClick: () => setActiveId(chat.id), children: [_jsx("strong", { children: chat.title }), _jsx("small", { children: new Date(chat.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) })] }), _jsx("button", { type: "button", className: "ai-shopping__delete", onClick: () => deleteChat(chat.id), "aria-label": `Delete ${chat.title}`, children: _jsx(Trash2, { size: 14 }) })] }, chat.id))) }), _jsx("p", { className: "ai-shopping__retention", children: "Your latest 10 chats are saved on this device for 30 days." })] }), _jsxs("section", { className: "ai-shopping__conversation", children: [_jsxs("header", { className: "ai-shopping__header", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "SmartCart intelligence" }), _jsx("h1", { children: "Shop smarter, together." }), _jsx("p", { children: "Tell me your budget, style or what you need. I will narrow down the right products." })] }), _jsx("button", { type: "button", onClick: () => navigate('/'), "aria-label": "Close AI shopping", children: _jsx(X, { size: 20 }) })] }), _jsxs("div", { className: "ai-shopping__messages", children: [activeChat?.messages.map((chatMessage) => (_jsxs("div", { className: `ai-shopping__message ai-shopping__message--${chatMessage.role}`, children: [_jsx("p", { children: chatMessage.text }), chatMessage.products?.length ? _jsx("div", { className: "ai-shopping__products", children: chatMessage.products.map((product) => _jsxs("button", { type: "button", onClick: () => navigate(`/products/${product.id}`), children: [product.image ? _jsx("img", { src: product.image, alt: "" }) : _jsx("span", { className: "ai-shopping__product-placeholder" }), _jsxs("span", { children: [_jsx("strong", { children: product.name }), _jsxs("small", { children: [product.brand || 'SmartCart pick', " \u00B7 \u20B9", product.price] })] }), _jsx(ArrowUpRight, { size: 15 })] }, product.id)) }) : null] }, chatMessage.id))), activeChat?.messages.length === 1 && (_jsxs("div", { className: "ai-shopping__quick-start", children: [_jsxs("div", { className: "ai-shopping__quick-copy", children: [_jsx("strong", { children: "Not sure where to start?" }), _jsx("span", { children: "Try one of these prompts or ask in your own words." })] }), _jsx("div", { className: "ai-shopping__prompts", children: suggestedPrompts.map((prompt) => (_jsxs("button", { type: "button", onClick: () => setMessage(prompt), children: [prompt, _jsx(ArrowUpRight, { size: 14 })] }, prompt))) }), featuredProducts.length ? (_jsxs("div", { className: "ai-shopping__featured", children: [_jsxs("div", { className: "ai-shopping__featured-heading", children: [_jsx("strong", { children: "Popular picks for you" }), _jsx("span", { children: "Fresh from SmartCart" })] }), _jsx("div", { className: "ai-shopping__products ai-shopping__products--featured", children: featuredProducts.map((product) => (_jsxs("button", { type: "button", onClick: () => navigate(`/products/${product.id}`), children: [product.image ? _jsx("img", { src: product.image, alt: "" }) : _jsx("span", { className: "ai-shopping__product-placeholder" }), _jsxs("span", { children: [_jsx("strong", { children: product.name }), _jsxs("small", { children: [product.brand || 'SmartCart pick', " \u00B7 \u20B9", product.price] })] }), _jsx(ArrowUpRight, { size: 15 })] }, product.id))) })] })) : null] })), loading && _jsx("div", { className: "ai-shopping__message ai-shopping__message--assistant", children: _jsx("p", { children: "Finding the right picks..." }) }), error && _jsx("p", { className: "ai-shopping__error", children: error })] }), _jsxs("form", { className: "ai-shopping__composer", onSubmit: submitMessage, children: [_jsx("input", { value: message, onChange: (event) => setMessage(event.target.value), placeholder: "Ask for a product, budget or idea...", "aria-label": "Ask SmartCart AI" }), _jsx("button", { type: "submit", disabled: !message.trim() || loading, "aria-label": "Send message", children: _jsx(Send, { size: 17 }) })] })] })] }) }));
}
