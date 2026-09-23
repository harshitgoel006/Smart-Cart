import type { ReactNode } from 'react'
import { Footer } from '../components/layout/Footer/Footer'
import { Header } from '../components/layout/Header/Header'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
