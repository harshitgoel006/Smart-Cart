import { useState } from 'react';
import { Truck } from 'lucide-react';
import { sendJson } from '../../services/apiClient';

export function SellerShippingPanel({ orders = [], onSaved }) {
  const [selected, setSelected] = useState(orders[0]?.itemId || '');
  const order = orders.find((item) => item.itemId === selected);
  const [form, setForm] = useState({ courierName: '', trackingNumber: '', estimatedDelivery: '' });
  const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  const save = async (event) => { event.preventDefault(); if (!order) return; setBusy(true); setMessage(''); try { await sendJson('/orders/seller/orders/update-tracking', 'PATCH', { orderId: order.orderId, itemId: order.itemId, tracking: form }); setMessage('Shipping details saved.'); onSaved?.(); } catch (error) { setMessage(error.message); } finally { setBusy(false); } };
  return <section className="seller-card"><div className="seller-card__heading"><div><span className="eyebrow"><Truck size={14} /> Shipping setup</span><h2>Courier & delivery promise</h2></div></div>{message && <p className="api-notice">{message}</p>}<form className="seller-form" onSubmit={save}><label>Order<select value={selected} onChange={(event) => setSelected(event.target.value)}><option value="">Choose an order</option>{orders.map((item) => <option value={item.itemId} key={item.itemId}>#{String(item.orderId).slice(-8).toUpperCase()} · {item.product?.name || 'Order item'}</option>)}</select></label><div className="seller-form-grid"><label>Courier<input required value={form.courierName} onChange={(event) => setForm({ ...form, courierName: event.target.value })} placeholder="Delhivery, BlueDart" /></label><label>Tracking number<input required value={form.trackingNumber} onChange={(event) => setForm({ ...form, trackingNumber: event.target.value })} /></label><label>Estimated delivery<input type="date" value={form.estimatedDelivery} onChange={(event) => setForm({ ...form, estimatedDelivery: event.target.value })} /></label></div><button className="primary-button" disabled={busy || !order}>Save shipping details</button></form></section>;
}
