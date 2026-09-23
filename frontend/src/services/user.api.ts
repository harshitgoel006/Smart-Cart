import { sendJson } from './apiClient'
import type { Address, AuthUser } from '../types'

export const userApi = {
  getCurrentUser: () => sendJson<AuthUser>('/users/get-user', 'GET'),
  updateAccount: (payload: Partial<AuthUser>) =>
    sendJson<AuthUser>('/users/update-account', 'PATCH', payload),
  updateAddress: (address: Address) =>
    sendJson<Address[]>('/users/update-address', 'PATCH', address),
  changePassword: (oldPassword: string, newPassword: string) =>
    sendJson('/users/change-password', 'POST', { oldPassword, newPassword }),
}
