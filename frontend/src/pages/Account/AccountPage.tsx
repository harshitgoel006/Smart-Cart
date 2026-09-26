import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Bell, Check, LogOut, MapPin, Package, ShoppingBag, ShieldCheck, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthProvider'
import { sendForm, sendJson } from '../../services/apiClient'
import type { Address } from '../../types'
import { SimpleAccountPage } from '../../components/ui/EmptyState/SimpleAccountPage'
import { SavedAddressActions } from './SavedAddressActions'

const blankAddress: Address = { label: '', street: '', city: '', state: '', pincode: '', country: 'India', isDefault: false }

export function AccountPage() {
  const { user, logout, loading, refreshUser } = useAuth()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [profile, setProfile] = useState({ fullname: user?.fullname || '', username: user?.username || '', phone: user?.phone || '', email: user?.email || '' })
  const [address, setAddress] = useState<Address>(blankAddress)
  const [password, setPassword] = useState({ oldPassword: '', newPassword: '' })
  const emailVerificationPending = false
  const emailOtp = ''
  const setEmailOtp = (_value: string) => undefined
  const verifyEmail = (event: FormEvent) => event.preventDefault()

  useEffect(() => {
    if (user) {
      setProfile({ fullname: user.fullname || '', username: user.username || '', phone: user.phone || '', email: user.email || '' })
    }
  }, [user])

  if (loading) return <main className="section empty-page"><h1>Loading account...</h1></main>
  if (!user) return <SimpleAccountPage title="Your account" text="Sign in to manage your profile, addresses and orders." link="/login" linkText="Sign in" />

  const startAction = () => { setBusy(true); setError(''); setMessage('') }
  const updateProfile = async (event: FormEvent) => { event.preventDefault(); startAction(); try { await sendJson('/users/update-account', 'PATCH', profile); await refreshUser(); setMessage('Profile details saved.') } catch (reason) { setError((reason as Error).message) } finally { setBusy(false) } }
  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; startAction(); try { const form = new FormData(); form.append('avatar', file); await sendForm('/users/update-avatar', form, 'PATCH'); await refreshUser(); setMessage('Profile image updated.') } catch (reason) { setError((reason as Error).message) } finally { setBusy(false) } }
  const saveAddress = async (event: FormEvent) => { event.preventDefault(); startAction(); try { await sendJson('/users/update-address', 'PATCH', address); await refreshUser(); setAddress(blankAddress); setMessage('Address saved.') } catch (reason) { setError((reason as Error).message) } finally { setBusy(false) } }
  const changePassword = async (event: FormEvent) => { event.preventDefault(); startAction(); try { await sendJson('/users/change-password', 'POST', password); setPassword({ oldPassword: '', newPassword: '' }); setMessage('Password changed successfully.') } catch (reason) { setError((reason as Error).message) } finally { setBusy(false) } }
  const updateProfileField = (key: keyof typeof profile, value: string) => { if (key === 'email' || key === 'phone') return; setProfile((current) => ({ ...current, [key]: value })) }
  const updateAddressField = (key: keyof Address, value: string | boolean) => setAddress((current) => ({ ...current, [key]: value }))
  const displayName = user.fullname || user.username || 'there'

  return <main className="account-page section">
    <section className="account-hero">
      <div className="account-avatar">{user.avatar ? <img src={user.avatar} alt="Profile" /> : <UserRound size={34} />}</div>
      <div className="account-hero__copy"><span className="eyebrow">Your SmartCart account</span><h1>Hello, {displayName}.</h1><p>{user.email} <span>·</span> {user.role === 'seller' ? 'Seller account' : 'Customer account'}</p></div>
      <label className="account-avatar__upload">Change photo<input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadAvatar} disabled={busy} /></label>
    </section>
    {message && <div className="inline-message account-notice"><Check size={16} />{message}</div>}
    {error && <div className="form-error account-notice">{error}</div>}
    <nav className="account-quick-links" aria-label="Account shortcuts"><Link to="/orders"><Package size={17} /> Orders</Link><Link to="/wishlist"><UserRound size={17} /> Wishlist</Link><Link to="/cart"><ShoppingBag size={17} /> Your bag</Link><Link to="/notifications"><Bell size={17} /> Notifications</Link><button onClick={logout}><LogOut size={17} /> Sign out</button></nav>
    <div className="account-content-grid">
      <section className="account-section"><div className="account-section__heading"><span className="account-section__icon"><UserRound size={17} /></span><div><span className="eyebrow">Profile</span><h2>Personal details</h2></div></div><form className="account-form" onSubmit={updateProfile}><div className="account-form__row"><label>Full name<input value={profile.fullname} onChange={(event) => updateProfileField('fullname', event.target.value)} /></label><label>Username<input value={profile.username} onChange={(event) => updateProfileField('username', event.target.value)} /></label></div><div className="account-form__row"><label>Phone<input value={profile.phone} onChange={(event) => updateProfileField('phone', event.target.value)} /></label><label>Email<input type="email" value={profile.email} onChange={(event) => updateProfileField('email', event.target.value)} /></label></div><button className="primary-button" disabled={busy}>Save details <span>↗</span></button></form>{emailVerificationPending && <form className="email-verify-form" onSubmit={verifyEmail}><p>We sent a 6-digit code to <strong>{profile.email}</strong>.</p><div><input inputMode="numeric" maxLength={6} required value={emailOtp} onChange={(event) => setEmailOtp(event.target.value)} placeholder="Verification code" /><button className="ghost-dark-button" disabled={busy}>Verify email</button></div></form>}</section>
      <section className="account-section"><div className="account-section__heading"><span className="account-section__icon"><ShieldCheck size={17} /></span><div><span className="eyebrow">Security</span><h2>Password</h2></div></div><p className="account-section__hint">Keep your account protected with a strong, private password.</p><form className="account-form" onSubmit={changePassword}><label>Current password<input type="password" required value={password.oldPassword} onChange={(event) => setPassword({ ...password, oldPassword: event.target.value })} /></label><label>New password<input type="password" minLength={6} required value={password.newPassword} onChange={(event) => setPassword({ ...password, newPassword: event.target.value })} /></label><button className="primary-button" disabled={busy}>Update password <span>↗</span></button></form></section>
    </div>
    <section className="account-section account-addresses"><div className="account-section__heading"><span className="account-section__icon"><MapPin size={17} /></span><div><span className="eyebrow">Delivery book</span><h2>Saved addresses</h2></div></div>{user.addresses?.length ? <div className="saved-addresses">{user.addresses.map((item) => <div className="saved-address" key={`${item.label}-${item.pincode}`}><strong>{item.label}</strong>{item.isDefault && <span className="address-default">Default</span>}<span>{item.street}, {item.city}, {item.state} - {item.pincode}</span></div>)}</div> : <p className="account-section__hint">Add an address to make checkout quicker next time.</p>}<form className="account-form address-form" onSubmit={saveAddress}><div className="account-form__row"><label>Label<input required value={address.label} onChange={(event) => updateAddressField('label', event.target.value)} placeholder="Home or work" /></label><label>Street address<input required value={address.street} onChange={(event) => updateAddressField('street', event.target.value)} /></label></div><div className="account-form__row"><label>City<input required value={address.city} onChange={(event) => updateAddressField('city', event.target.value)} /></label><label>State<input required value={address.state} onChange={(event) => updateAddressField('state', event.target.value)} /></label><label>PIN code<input required value={address.pincode} onChange={(event) => updateAddressField('pincode', event.target.value)} /></label></div><label className="check-label"><input type="checkbox" checked={!!address.isDefault} onChange={(event) => updateAddressField('isDefault', event.target.checked)} /> Make this the default address</label><button className="primary-button" disabled={busy}>Save address <span>↗</span></button></form></section>
    <SavedAddressActions user={user} refreshUser={refreshUser} onMessage={setMessage} onError={setError} />
  </main>
}
