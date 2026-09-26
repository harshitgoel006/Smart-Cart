import { useState } from 'react'
import type { FormEvent } from 'react'
import { ChevronDown } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { sendForm, sendJson } from '../../services/apiClient'

export function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('customer')
  const [roleOpen, setRoleOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [form, setForm] = useState({ fullname: '', username: '', phone: '', password: '' })
  const [avatar, setAvatar] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const sendOtp = async () => { setBusy(true); setError(''); try { await sendJson('/users/send-otp', 'POST', { email, role }); setStep(2); setMessage('Verification code sent to your email.') } catch (reason) { setError((reason as Error).message) } finally { setBusy(false) } }
  const verifyOtp = async () => { setBusy(true); setError(''); try { await sendJson('/users/verify-otp', 'POST', { email, otp }); setStep(3); setMessage('Email verified. Complete your profile.') } catch (reason) { setError((reason as Error).message) } finally { setBusy(false) } }
  const register = async (event: FormEvent) => { event.preventDefault(); if (!avatar) { setError('Please choose a profile image.'); return }; setBusy(true); setError(''); const data = new FormData(); Object.entries({ ...form, email, role }).forEach(([key, value]) => data.append(key, value)); data.append('avatar', avatar); try { await sendForm('/users/register', data); navigate('/login') } catch (reason) { setError((reason as Error).message) } finally { setBusy(false) } }

  return <main className="auth-page section"><div className="auth-card"><span className="eyebrow">Step {step} of 3</span><h1>Join the smarter way to shop.</h1><p>{message || 'Create a SmartCart account in a few simple steps.'}</p>{step === 1 && <div className="auth-form"><label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Account type<div className="auth-select"><button type="button" className="auth-select__trigger" onClick={() => setRoleOpen((current) => !current)} aria-expanded={roleOpen}>{role === 'customer' ? 'Customer' : 'Seller'}<ChevronDown size={17} className={roleOpen ? 'is-open' : ''} /></button>{roleOpen && <div className="auth-select__menu"><button type="button" className={role === 'customer' ? 'is-active' : ''} onClick={() => { setRole('customer'); setRoleOpen(false) }}>Customer</button><button type="button" className={role === 'seller' ? 'is-active' : ''} onClick={() => { setRole('seller'); setRoleOpen(false) }}>Seller</button></div>}</div></label><button className="primary-button" onClick={sendOtp} disabled={busy}>{busy ? 'Sending...' : 'Send verification code'} <span>↗</span></button></div>}{step === 2 && <div className="auth-form"><label>Verification code<input inputMode="numeric" required value={otp} onChange={(event) => setOtp(event.target.value)} /></label><button className="primary-button" onClick={verifyOtp} disabled={busy}>{busy ? 'Verifying...' : 'Verify email'} <span>↗</span></button><button className="link-button" onClick={() => setStep(1)}>Use another email</button></div>}{step === 3 && <form className="auth-form" onSubmit={register}><label>Full name<input required value={form.fullname} onChange={(event) => update('fullname', event.target.value)} /></label><label>Username<input required value={form.username} onChange={(event) => update('username', event.target.value)} /></label><label>Phone<input required inputMode="numeric" value={form.phone} onChange={(event) => update('phone', event.target.value)} /></label><label>Password<input required type="password" minLength={6} value={form.password} onChange={(event) => update('password', event.target.value)} /></label><label>Profile image<input required type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setAvatar(event.target.files?.[0] || null)} /></label><button className="primary-button" disabled={busy}>{busy ? 'Creating account...' : 'Create account'} <span>↗</span></button></form>}{error && <div className="form-error">{error}</div>}<small>Already have an account? <Link to="/login">Sign in</Link></small></div></main>
}
