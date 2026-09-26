import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { sendJson } from '../../services/apiClient'
import type { Address, AuthUser } from '../../types'

type Props = { user: AuthUser; refreshUser: () => Promise<unknown>; onMessage: (message: string) => void; onError: (message: string) => void }

export function SavedAddressActions({ user, refreshUser, onMessage, onError }: Props) {
  const [busy, setBusy] = useState('')
  const [editing, setEditing] = useState<Address | null>(null)
  const remove = async (label: string) => {
    if (!window.confirm(`Delete the ${label} address?`)) return
    setBusy(label)
    try { await sendJson('/users/delete-address', 'DELETE', { label }); await refreshUser(); onMessage('Address deleted.') } catch (reason) { onError((reason as Error).message) } finally { setBusy('') }
  }
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); if (!editing) return
    setBusy(editing.label)
    try { await sendJson('/users/update-address', 'PATCH', editing); await refreshUser(); setEditing(null); onMessage('Address updated.') } catch (reason) { onError((reason as Error).message) } finally { setBusy('') }
  }
  if (!user.addresses?.length) return null
  return <section className="saved-address-actions account-section"><div className="saved-address-actions__heading"><div><span className="eyebrow">Address controls</span><h3>Manage saved addresses</h3></div><span>{user.addresses.length} saved</span></div>
    {user.addresses.map((address) => <div className="saved-address-actions__row" key={`${address.label}-${address.pincode}`}><span>{address.label}</span><div><button type="button" className="address-action-button" onClick={() => setEditing(address)}><Pencil size={13} /> Edit</button><button type="button" className="address-action-button address-action-button--danger" disabled={busy === address.label} onClick={() => remove(address.label)}><Trash2 size={13} /> Delete</button></div></div>)}
    {editing && <form className="saved-address-actions__edit" onSubmit={save}><strong>Edit {editing.label} address</strong><input value={editing.street} onChange={(event) => setEditing({ ...editing, street: event.target.value })} placeholder="Street address" required /><div><input value={editing.city} onChange={(event) => setEditing({ ...editing, city: event.target.value })} placeholder="City" required /><input value={editing.state} onChange={(event) => setEditing({ ...editing, state: event.target.value })} placeholder="State" required /><input value={editing.pincode} onChange={(event) => setEditing({ ...editing, pincode: event.target.value })} placeholder="PIN code" required /></div><label className="check-label"><input type="checkbox" checked={!!editing.isDefault} onChange={(event) => setEditing({ ...editing, isDefault: event.target.checked })} /> Make this the default address</label><div><button type="submit" className="ghost-dark-button" disabled={!!busy}>Save changes</button><button type="button" className="link-button" onClick={() => setEditing(null)}>Cancel</button></div></form>}
  </section>
}
