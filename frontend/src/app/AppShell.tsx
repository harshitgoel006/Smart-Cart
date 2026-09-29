import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Footer } from '../components/layout/Footer/Footer'
import { Header } from '../components/layout/Header/Header'
import { AiShoppingAssistant } from '../components/ai/AiShoppingAssistant/AiShoppingAssistant'
import { TrustStrip } from '../components/home/TrustStrip/TrustStrip'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { pathname } = useLocation()
  const isAdminArea = pathname.startsWith('/admin')

  return (
    <div className="app-shell">
      <Header />
      {children}
      {!isAdminArea && <TrustStrip />}
      {!isAdminArea && <Footer />}
      {!isAdminArea && <AiShoppingAssistant />}
    </div>
  )
}
