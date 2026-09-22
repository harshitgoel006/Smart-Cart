import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthProvider'
import { getJson, sendJson } from '../shared/api'
import type { Notification } from '../shared/types'
import { SimpleAccountPage } from './SimpleAccountPage'

export function NotificationsPage() {
  const { user } = useAuth(); const [items, setItems] = useState<Notification[]>([]); const [message, setMessage] = useState(''); const [loading, setLoading] = useState(true)
  const load = () => getJson<{ notifications: Notification[] }>('/notifications/my-notifications?limit=30').then((data) => setItems(data.notifications || []))
  useEffect(() => { if (!user) { setLoading(false); return }; load().catch((error: Error) => setMessage(error.message)).finally(() => setLoading(false)) }, [user])
  const markRead = async (id: string) => { try { await sendJson(`/notifications/mark-notification-read/${id}`, 'PATCH'); setItems((current) => current.map((item) => item._id === id ? { ...item, isRead: true } : item)) } catch (error) { setMessage((error as Error).message) } }
  const markAll = async () => { try { await sendJson('/notifications/mark-all-notifications-read', 'PATCH'); setItems((current) => current.map((item) => ({ ...item, isRead: true }))) } catch (error) { setMessage((error as Error).message) } }
  if (!user) return <SimpleAccountPage title="Your notifications are private." text="Sign in to see order and account updates." link="/login" linkText="Sign in" />
  if (loading) return <main className="section empty-page"><h1>Loading notifications...</h1></main>
  return <main className="notifications-page section"><div className="catalog-heading"><div><span className="eyebrow">Stay in the loop</span><h1>Notifications</h1></div><button className="link-button" onClick={markAll}>Mark all as read</button></div>{message && <div className="api-notice">{message}</div>}{items.length ? <div className="notification-list">{items.map((item) => <article className={`notification-card ${item.isRead ? 'is-read' : ''}`} key={item._id}><div><span className="eyebrow">{item.category}</span><h3>{item.title}</h3><p>{item.message}</p><small>{new Date(item.createdAt).toLocaleString('en-IN')}</small></div>{!item.isRead && <button className="link-button" onClick={() => markRead(item._id)}>Mark read</button>}{item.relatedEntity?.entityType === 'Order' && item.relatedEntity.entityId && <Link className="text-button" to={`/orders/${item.relatedEntity.entityId}`}>View order ↗</Link>}</article>)}</div> : <div className="empty-page"><h1>All caught up.</h1><p>Important SmartCart updates will appear here.</p></div>}</main>
}
