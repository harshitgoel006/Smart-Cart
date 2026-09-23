import { API_BASE } from '../constants'

function authHeaders(): Record<string, string> {
  const token = sessionStorage.getItem('smartcart.accessToken')

  return token ? { Authorization: `Bearer ${token}` } : {}
}

function canRefresh(path: string): boolean {
  const excludedPaths = [
    '/users/login',
    '/users/refresh-token',
    '/users/send-reset-otp',
    '/users/verify-reset-otp',
    '/users/reset-password',
  ]

  return !excludedPaths.some((excludedPath) => path.startsWith(excludedPath))
}

let refreshPromise: Promise<boolean> | null = null

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE}/users/refresh-token`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(async (response) => {
        if (!response.ok) return false

        const body = await response.json()
        const token = body.data?.accessToken

        if (!token) return false

        sessionStorage.setItem('smartcart.accessToken', token)
        return true
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

async function request(
  path: string,
  init: RequestInit,
  retry = true,
): Promise<Response> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...authHeaders(),
      ...(init.headers || {}),
    },
  })

  if (
    response.status === 401 &&
    retry &&
    canRefresh(path) &&
    (await refreshAccessToken())
  ) {
    return request(path, init, false)
  }

  return response
}

async function parseResponse<T>(
  response: Response,
  fallbackMessage: string,
): Promise<T> {
  const body = await response.json().catch(() => ({}))

  if (!response.ok || body.success === false) {
    throw new Error(getSafeErrorMessage(response.status, body.message, fallbackMessage))
  }

  return (body.data ?? body) as T
}

function getSafeErrorMessage(
  status: number,
  rawMessage: unknown,
  fallbackMessage: string,
): string {
  const message = typeof rawMessage === 'string' ? rawMessage : ''
  const containsInternalDetails = /E11000|duplicate key|Mongo|Mongoose|collection:|index:|CastError|ValidationError|stack/i.test(message)

  if (containsInternalDetails) {
    return 'Something went wrong while completing your request. Please try again.'
  }

  if (status === 401) return 'Please sign in to continue.'
  if (status === 403) return 'You do not have permission to perform this action.'
  if (status === 404) return 'The requested item could not be found.'
  if (status === 409) return 'This action could not be completed right now. Please try again.'
  if (status >= 500) return 'SmartCart is having trouble right now. Please try again shortly.'

  return message || fallbackMessage
}

export async function getJson<T>(path: string): Promise<T> {
  const response = await request(path, {})
  return parseResponse<T>(response, 'Unable to load SmartCart data')
}

export async function sendJson<T>(
  path: string,
  method: string,
  payload?: unknown,
): Promise<T> {
  const response = await request(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: payload ? JSON.stringify(payload) : undefined,
  })

  return parseResponse<T>(response, 'Request could not be completed')
}

export async function sendForm<T>(
  path: string,
  formData: FormData,
  method = 'POST',
): Promise<T> {
  const response = await request(path, { method, body: formData })
  return parseResponse<T>(response, 'Request could not be completed')
}

export async function getBlob(path: string): Promise<Blob> {
  const response = await request(path, {})

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(getSafeErrorMessage(response.status, body.message, 'Download failed'))
  }

  return response.blob()
}
