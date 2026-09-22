import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { getJson, sendJson } from '../../shared/api'
import type { AuthUser } from '../../shared/types'

type AuthContextValue = { user: AuthUser | null; loading: boolean; login: (email: string, password: string) => Promise<void>; logout: () => Promise<void>; refreshUser: () => Promise<void> }
const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider'); return value }
export function AuthProvider({ children }: { children: ReactNode }) { const [user, setUser] = useState<AuthUser | null>(null); const [loading, setLoading] = useState(true); const refreshUser = async () => { const current = await getJson<AuthUser>('/users/get-user'); setUser(current) }; useEffect(() => { if (!sessionStorage.getItem('smartcart.accessToken')) { setLoading(false); return }; refreshUser().catch(() => sessionStorage.removeItem('smartcart.accessToken')).finally(() => setLoading(false)) }, []); const login = async (email: string, password: string) => { const data = await sendJson<{ user: AuthUser; accessToken: string }>('/users/login', 'POST', { email, password }); sessionStorage.setItem('smartcart.accessToken', data.accessToken); setUser(data.user) }; const logout = async () => { try { await sendJson('/users/logout', 'POST') } finally { sessionStorage.removeItem('smartcart.accessToken'); setUser(null) } }; return <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>{children}</AuthContext.Provider> }
