import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const options = [
  ['pending', 'Pending'],
  ['confirmed', 'Confirmed'],
  ['shipped', 'Shipped'],
  ['delivered', 'Delivered'],
  ['cancelled', 'Cancelled'],
] as const

type AdminStatusPickerProps = {
  value: string
  onChange: (value: string) => void
}

export function AdminStatusPicker({ value, onChange }: AdminStatusPickerProps) {
  const [open, setOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const label = options.find(([optionValue]) => optionValue === value)?.[1] ?? 'Select status'

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  return (
    <div ref={pickerRef} className="admin-status-picker">
      <button
        type="button"
        className="admin-status-picker__trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <span>{label}</span>
        <ChevronDown size={15} aria-hidden="true" />
      </button>

      {open && (
        <div className="admin-status-picker__menu" role="listbox" aria-label="Order status">
          {options.map(([optionValue, optionLabel]) => (
            <button
              key={optionValue}
              type="button"
              role="option"
              aria-selected={value === optionValue}
              className={value === optionValue ? 'is-selected' : undefined}
              onClick={() => {
                onChange(optionValue)
                setOpen(false)
              }}
            >
              {optionLabel}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
