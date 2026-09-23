import { getJson, sendJson } from './apiClient'
import type { Cart } from '../types'

export const cartApi = {
  getCart: () => getJson<Cart>('/carts'),
  updateItem: (itemId: string, quantity: number) =>
    sendJson<Cart>(`/carts/update/${itemId}`, 'PUT', { quantity }),
  removeItem: (itemId: string) => sendJson<Cart>(`/carts/remove/${itemId}`, 'DELETE'),
}
