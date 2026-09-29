import { ArrowLeft, KeyRound, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthProvider'
import { SimpleAccountPage } from '../../components/ui/EmptyState/SimpleAccountPage'

export function AdminProfilePage() {
  const { user, loading } = useAuth()

  if (loading) return <main className="admin-profile-page admin-state"><p>Loading admin profile...</p></main>
  if (!user || user.role !== 'admin') return <SimpleAccountPage title="Admin access required" text="Sign in with an administrator account to continue." link="/login" linkText="Sign in" />

  return <main className="admin-profile-page">
    <div className="admin-profile-page__topbar"><Link className="outline-button" to="/admin"><ArrowLeft size={15} /> Back to control room</Link><span className="admin-profile-page__badge"><ShieldCheck size={15} /> Administrator</span></div>
    <section className="admin-profile-hero"><div className="admin-profile-avatar">{user.avatar ? <img src={user.avatar} alt="Admin profile" /> : <UserRound size={38} />}</div><div><span className="eyebrow">SmartCart administration</span><h1>{user.fullname || user.username || 'Admin profile'}</h1><p>Manage your administrator identity and workspace access.</p></div></section>
    <section className="admin-profile-grid"><article className="admin-profile-card"><div className="admin-profile-card__icon"><UserRound size={18} /></div><span className="eyebrow">Identity</span><h2>Profile details</h2><dl><div><dt>Full name</dt><dd>{user.fullname || 'Not set'}</dd></div><div><dt>Username</dt><dd>{user.username || 'Not set'}</dd></div><div><dt>Phone</dt><dd>{user.phone || 'Not set'}</dd></div></dl></article><article className="admin-profile-card"><div className="admin-profile-card__icon"><Mail size={18} /></div><span className="eyebrow">Account email</span><h2>{user.email}</h2><p>Your administrator email is used for sign-in and account recovery.</p></article><article className="admin-profile-card"><div className="admin-profile-card__icon"><KeyRound size={18} /></div><span className="eyebrow">Access</span><h2>Administrator role</h2><p>This account has access to the SmartCart control room and protected admin tools.</p><Link className="primary-button" to="/admin">Open control room <ArrowLeft size={15} className="admin-profile-forward" /></Link></article></section>
  </main>
}

