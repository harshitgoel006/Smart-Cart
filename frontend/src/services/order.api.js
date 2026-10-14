import { getBlob, getJson, sendJson } from './apiClient';
export const orderApi = {
    getOrders: () => getJson('/orders/orders?limit=20'),
    getOrder: (orderId) => getJson(`/orders/orders/${orderId}`),
    cancelOrder: (orderId) => sendJson(`/orders/orders/${orderId}/cancel`, 'POST'),
    downloadInvoice: (orderId) => getBlob(`/orders/orders/${orderId}/invoice`),
};
