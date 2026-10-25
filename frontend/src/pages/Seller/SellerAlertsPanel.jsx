import { useEffect, useState } from 'react';
import { Bell, TriangleAlert, Clock3 } from 'lucide-react';
import { getJson, sendJson } from '../../services/apiClient';

export function SellerAlertsPanel() {
  const [alerts, setAlerts] = useState(null);
  useEffect(() => { sendJson('/notifications/seller/alerts/sync', 'POST').catch(() => null).finally(() => { getJson('/notifications/seller/alerts').then(setAlerts).catch(() => setAlerts(null)); }); }, []);
  if (!alerts) return null;
  const cards = [
    { label: 'Low stock', count: alerts.counts.lowStock, icon: TriangleAlert, text: alerts.lowStock.slice(0, 3).map((item) => `${item.name} (${item.stock})`).join(' · ') },
    { label: 'Pending orders', count: alerts.counts.pendingOrders, icon: Clock3, text: alerts.pendingOrders.slice(0, 3).map((item) => `#${String(item.orderId).slice(-8).toUpperCase()} · ${item.status}`).join(' · ') },
    { label: 'Awaiting approval', count: alerts.counts.pendingProducts, icon: Bell, text: alerts.pendingProducts.slice(0, 3).map((item) => item.name).join(' · ') },
  ];
  return <section className="seller-alerts-grid" aria-label="Seller alerts">{cards.map(({ label, count, icon: Icon, text }) => <article className={`seller-alert-card ${count ? 'has-alert' : ''}`} key={label}><Icon size={18} /><div><span>{label}</span><strong>{count}</strong><small>{count ? text : 'Nothing needs attention right now.'}</small></div></article>)}</section>;
}
