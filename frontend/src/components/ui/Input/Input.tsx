import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

export function Input({ label, id, ...props }: InputProps) {
  return (
    <label className="ui-input">
      {label && <span>{label}</span>}
      <input id={id} {...props} />
    </label>
  )
}
