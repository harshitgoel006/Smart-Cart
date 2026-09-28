import { useEffect, useState } from 'react'
import { ArrowUpRight, Bell, CheckCheck, CircleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthProvider'
import { getJson, sendJson } from '../../services/apiClient'
import type { Notification } from '../../types'
import { SimpleAccountPage } from '../../components/ui/EmptyState/SimpleAccountPage'

export function NotificationsPage() {
  const { user } = useAuth(); const [items, setItems] = useState<Notification[]>([]); const [message, setMessage] = useState(''); const [loading, setLoading] = useState(true)
  const load = () => getJson<{ notifications: Notification[] }>('/notifications/my-notifications?limit=30').then((data) => setItems(data.notifications || []))
  useEffect(() => { if (!user) { setLoading(false); return }; load().catch((error: Error) => setMessage(error.message)).finally(() => setLoading(false)) }, [user])
  const markRead = async (id: string) => { try { await sendJson(`/notifications/mark-notification-read/${id}`, 'PATCH'); setItems((current) => current.map((item) => item._id === id ? { ...item, isRead: true } : item)) } catch (error) { setMessage((error as Error).message) } }
  const markAll = async () => { try { await sendJson('/notifications/mark-all-notifications-read', 'PATCH'); setItems((current) => current.map((item) => ({ ...item, isRead: true }))) } catch (error) { setMessage((error as Error).message) } }
  if (!user) return <SimpleAccountPage title="Your notifications are private." text="Sign in to see order and account updates." link="/login" linkText="Sign in" />
  if (loading) return <main className="section empty-page"><h1>Loading notifications...</h1></main>
  const unreadCount = items.filter((item) => !item.isRead).length
  return <main className="notifications-page section"><section className="notifications-hero"><div><span className="eyebrow"><Bell size={14} /> Stay in the loop</span><h1>Good to know.</h1><p>Order updates, account activity and helpful SmartCart moments will appear here.</p></div>{items.length > 0 && <button className="outline-button" onClick={markAll} disabled={!unreadCount}><CheckCheck size={16} /> {unreadCount ? 'Mark all as read' : 'All caught up'}</button>}</section>{message && <div className="api-notice"><CircleAlert size={16} /> {message}</div>}{items.length ? <div className="notification-list">{items.map((item) => <article className={`notification-card ${item.isRead ? 'is-read' : ''}`} key={item._id}><div className="notification-card__icon"><Bell size={18} /></div><div className="notification-card__content"><div className="notification-card__meta"><span className="eyebrow">{item.category}</span>{!item.isRead && <span className="notification-unread">New</span>}</div><h3>{item.title}</h3><p>{item.message}</p><small>{new Date(item.createdAt).toLocaleString('en-IN')}</small></div><div className="notification-card__actions">{!item.isRead && <button className="outline-button" onClick={() => markRead(item._id)}><CheckCheck size={14} /> Mark read</button>}{item.relatedEntity?.entityType === 'Order' && item.relatedEntity.entityId && <Link className="outline-button" to={`/orders/${item.relatedEntity.entityId}`}>View order <ArrowUpRight size={14} /></Link>}</div></article>)}</div> : <div className="empty-page notifications-empty"><Bell size={32} /><h1>All caught up.</h1><p>Important SmartCart updates will appear here.</p><Link className="primary-button" to="/products">Explore products <ArrowUpRight size={16} /></Link></div>}</main>
}
