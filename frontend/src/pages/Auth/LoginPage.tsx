import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useAuth } from '../../app/providers/AuthProvider'
import { SimpleAccountPage } from '../../components/ui/EmptyState/SimpleAccountPage'

export function LoginPage() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) return <SimpleAccountPage title="You are already signed in." text="Your SmartCart session is active." link="/account" linkText="View account" />

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try { await login(email, password); navigate('/account') }
    catch (reason) { setError((reason as Error).message) }
    finally { setSubmitting(false) }
  }

  return (
    <main className="auth-page section">
      <div className="auth-card">
        <div className="auth-card__brand"><span className="auth-card__logo"><ShoppingBag size={22} /></span><span>Smart<strong>Cart</strong></span></div>
        <h1>Welcome back.</h1>
        <p>Sign in to access your bag, wishlist and order history.</p>
        <form onSubmit={submit}>
          <label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label>Password<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <div className="auth-helper"><Link to="/forgot-password">Forgot password?</Link></div>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-button" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'} <span>↗</span></button>
        </form>
        <small>New to SmartCart? <Link to="/register">Create an account</Link></small>
      </div>
    </main>
  )
}
