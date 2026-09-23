import { sendForm, sendJson } from './apiClient'
import type { AuthUser } from '../types'

export const authApi = {
  login: (email: string, password: string) =>
    sendJson<{ user: AuthUser; accessToken: string }>('/users/login', 'POST', {
      email,
      password,
    }),
  register: (formData: FormData) => sendForm('/users/register', formData),
  getCurrentUser: () => sendJson<AuthUser>('/users/get-user', 'GET'),
}
