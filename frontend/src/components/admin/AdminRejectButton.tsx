import { useState } from 'react'
import { X } from 'lucide-react'

type Props = {
  type: 'product' | 'category'
  busy?: boolean
  onConfirm: (reason: string) => void
}

export function AdminRejectButton({ type, busy = false, onConfirm }: Props) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')

  const close = () => {
    if (busy) return
    setOpen(false)
    setReason('')
  }

  return <>
    <button type="button" className={type === 'product' ? 'icon-action icon-action--bad' : 'small-action small-action--danger'} disabled={busy} onClick={() => setOpen(true)} title={`Reject ${type}`}>
      {type === 'product' ? <X size={15} /> : 'Reject'}
    </button>
    {open && <div className="admin-reject-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}>
      <section className="admin-reject-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-reject-title">
        <div className="admin-reject-dialog__header">
          <div><span className="eyebrow">Moderation decision</span><h2 id="admin-reject-title">Reject {type}</h2></div>
          <button type="button" className="icon-action" onClick={close} aria-label="Close rejection dialog"><X size={18} /></button>
        </div>
        <p className="admin-helper">Add a clear reason so the {type} owner knows what needs to be corrected.</p>
        <label>Reason<textarea autoFocus value={reason} onChange={(event) => setReason(event.target.value)} placeholder={`Why is this ${type} being rejected?`} rows={4} /></label>
        <div className="admin-button-row admin-reject-dialog__actions"><button type="button" className="outline-button" onClick={close}>Cancel</button><button type="button" className="small-action small-action--danger" disabled={!reason.trim() || busy} onClick={() => { onConfirm(reason.trim()); setOpen(false); setReason('') }}>Reject {type}</button></div>
      </section>
    </div>}
  </>
}
