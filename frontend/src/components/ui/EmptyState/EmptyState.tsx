import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="section-empty">
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  )
}
