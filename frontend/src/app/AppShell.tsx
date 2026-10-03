import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './providers/AuthProvider'
import { Footer } from '../components/layout/Footer/Footer'
import { Header } from '../components/layout/Header/Header'
import { AiShoppingAssistant } from '../components/ai/AiShoppingAssistant/AiShoppingAssistant'
import { TrustStrip } from '../components/home/TrustStrip/TrustStrip'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const isAdminArea = pathname.startsWith('/admin')
  const isSellerArea = pathname.startsWith('/seller')

  if (user?.role === 'seller' && !isSellerArea) {
    return <Navigate to="/seller" replace />
  }

  return (
    <div className="app-shell">
      <Header />
      {children}
      {!isAdminArea && !isSellerArea && <TrustStrip />}
      {!isAdminArea && !isSellerArea && <Footer />}
      {!isAdminArea && !isSellerArea && <AiShoppingAssistant />}
    </div>
  )
}
