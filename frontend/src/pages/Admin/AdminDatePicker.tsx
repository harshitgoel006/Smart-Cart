import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function parseDate(value: string) {
  if (!value) return new Date()
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatValue(date: Date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')
}

function isSameDay(left: Date, right: Date) {
  return left.toDateString() === right.toDateString()
}

export function AdminDatePicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(() => parseDate(value))
  const pickerRef = useRef<HTMLDivElement>(null)
  const selectedDate = value ? parseDate(value) : null
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay()
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, index) => index < firstDay ? null : new Date(month.getFullYear(), month.getMonth(), index - firstDay + 1))

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  return (
    <div ref={pickerRef} className="admin-date-picker">
      <button type="button" className="admin-date-picker__trigger" aria-expanded={open} onClick={() => setOpen((isOpen) => !isOpen)}>
        <span>{selectedDate ? selectedDate.toLocaleDateString('en-GB') : 'dd-mm-yyyy'}</span>
        <CalendarDays size={16} aria-hidden="true" />
      </button>
      {open && <div className="admin-date-picker__menu">
        <div className="admin-date-picker__header">
          <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Previous month"><ChevronLeft size={16} /></button>
          <strong>{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</strong>
          <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Next month"><ChevronRight size={16} /></button>
        </div>
        <div className="admin-date-picker__week">{weekDays.map((day) => <span key={day}>{day}</span>)}</div>
        <div className="admin-date-picker__days">{cells.map((date, index) => date ? <button key={index} type="button" className={selectedDate && isSameDay(date, selectedDate) ? 'is-selected' : undefined} onClick={() => { onChange(formatValue(date)); setOpen(false) }}>{date.getDate()}</button> : <span key={index} />)}</div>
        <div className="admin-date-picker__footer"><button type="button" onClick={() => { onChange(''); setOpen(false) }}>Clear</button><button type="button" onClick={() => { const today = new Date(); onChange(formatValue(today)); setMonth(today); setOpen(false) }}>Today</button></div>
      </div>}
    </div>
  )
}
