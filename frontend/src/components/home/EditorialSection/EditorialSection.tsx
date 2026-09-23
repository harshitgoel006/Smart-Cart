import type { ReactNode } from 'react'

export function EditorialSection({ children }: { children: ReactNode }) {
  return <section className="editorial section">{children}</section>
}
