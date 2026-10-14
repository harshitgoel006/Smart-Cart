import { getJson, sendJson } from './apiClient';
export const cartApi = {
    getCart: () => getJson('/carts'),
    updateItem: (itemId, quantity) => sendJson(`/carts/update/${itemId}`, 'PUT', { quantity }),
    removeItem: (itemId) => sendJson(`/carts/remove/${itemId}`, 'DELETE'),
};
