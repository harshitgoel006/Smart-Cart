import { getBlob, getJson, sendJson } from './apiClient'
import type { OrderDetail, OrderSummary } from '../types'

export const orderApi = {
  getOrders: () => getJson<{ orders: OrderSummary[] }>('/orders/orders?limit=20'),
  getOrder: (orderId: string) => getJson<OrderDetail>(`/orders/orders/${orderId}`),
  cancelOrder: (orderId: string) => sendJson(`/orders/orders/${orderId}/cancel`, 'POST'),
  downloadInvoice: (orderId: string) => getBlob(`/orders/orders/${orderId}/invoice`),
}
