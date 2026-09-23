import type { ReactNode } from 'react'
import { Footer } from '../components/layout/Footer/Footer'
import { Header } from '../components/layout/Header/Header'
import { AiShoppingAssistant } from '../components/ai/AiShoppingAssistant/AiShoppingAssistant'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <Header />
      {children}
      <Footer />
      <AiShoppingAssistant />
    </div>
  )
}
