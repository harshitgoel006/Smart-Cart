import { useEffect, useState } from 'react';
import { BarChart3, RotateCcw, WalletCards } from 'lucide-react';
import { getJson } from '../../services/apiClient';
import { formatPrice } from '../../utils/formatters';

export function SellerAdvancedMetricsPanel({ startDate = '', endDate = '' }) {
  const [summary, setSummary] = useState(null);
  useEffect(() => { const query = new URLSearchParams(); if (startDate) query.set('startDate', startDate); if (endDate) query.set('endDate', `${endDate}T23:59:59`); getJson(`/orders/seller/sales-analytics${query.toString() ? `?${query}` : ''}`).then((data) => setSummary(data.summary || null)).catch(() => setSummary(null)); }, [startDate, endDate]);
  if (!summary) return null;
  return <section className="seller-metrics-grid"><article className="seller-card seller-metric-card"><BarChart3 size={18} /><small>Gross sales</small><strong>{formatPrice(summary.totalRevenue || 0)}</strong><span>{summary.totalItemsSold || 0} units across {summary.totalOrders || 0} orders</span></article><article className="seller-card seller-metric-card"><WalletCards size={18} /><small>Profit estimate</small><strong>{formatPrice(summary.profitEstimate || Number(summary.totalRevenue || 0) * 0.9)}</strong><span>After estimated 10% platform commission</span></article><article className="seller-card seller-metric-card"><RotateCcw size={18} /><small>Returns / cancellations</small><strong>{Number(summary.returnedItems || 0) + Number(summary.cancelledItems || 0)}</strong><span>{summary.returnedItems || 0} returned · {summary.cancelledItems || 0} cancelled units</span></article></section>;
}
