import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { getJson, sendJson } from '../../services/apiClient';
const AuthContext = createContext(null);
export function useAuth() {
    const value = useContext(AuthContext);
    if (!value) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return value;
}
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const refreshUser = async () => {
        const currentUser = await getJson('/users/get-user');
        setUser(currentUser);
    };
    useEffect(() => {
        if (!sessionStorage.getItem('smartcart.accessToken')) {
            setLoading(false);
            return;
        }
        refreshUser()
            .catch(() => sessionStorage.removeItem('smartcart.accessToken'))
            .finally(() => setLoading(false));
    }, []);
    const login = async (email, password) => {
        const data = await sendJson('/users/login', 'POST', { email, password });
        sessionStorage.setItem('smartcart.accessToken', data.accessToken);
        setUser(data.user);
        return data.user;
    };
    const logout = async () => {
        try {
            await sendJson('/users/logout', 'POST');
        }
        finally {
            sessionStorage.removeItem('smartcart.accessToken');
            setUser(null);
        }
    };
    return (_jsx(AuthContext.Provider, { value: { user, loading, login, logout, refreshUser }, children: children }));
}
