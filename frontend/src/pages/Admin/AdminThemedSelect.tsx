import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Option = { value: string; label: string }

type Props = {
  value: string
  onChange: (value: string) => void
  options: Option[]
  ariaLabel?: string
}

export function AdminThemedSelect({ value, onChange, options, ariaLabel = 'Select option' }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((option) => option.value === value)?.label || 'Select'

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div ref={ref} className="admin-themed-select">
      <button type="button" className="admin-themed-select__trigger" aria-expanded={open} aria-haspopup="listbox" onClick={() => setOpen((current) => !current)}>
        <span>{selected}</span><ChevronDown size={15} aria-hidden="true" />
      </button>
      {open && <div className="admin-themed-select__menu" role="listbox" aria-label={ariaLabel}>
        {options.map((option) => <button type="button" role="option" aria-selected={value === option.value} className={value === option.value ? 'is-selected' : ''} key={option.value} onClick={() => { onChange(option.value); setOpen(false) }}>{option.label}</button>)}
      </div>}
    </div>
  )
}
