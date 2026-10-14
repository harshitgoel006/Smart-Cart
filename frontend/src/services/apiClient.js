import { API_BASE } from '../constants';
function authHeaders() {
    const token = sessionStorage.getItem('smartcart.accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
}
function canRefresh(path) {
    const excludedPaths = [
        '/users/login',
        '/users/refresh-token',
        '/users/send-reset-otp',
        '/users/verify-reset-otp',
        '/users/reset-password',
    ];
    return !excludedPaths.some((excludedPath) => path.startsWith(excludedPath));
}
let refreshPromise = null;
async function refreshAccessToken() {
    if (!refreshPromise) {
        refreshPromise = fetch(`${API_BASE}/users/refresh-token`, {
            method: 'POST',
            credentials: 'include',
        })
            .then(async (response) => {
            if (!response.ok)
                return false;
            const body = await response.json();
            const token = body.data?.accessToken;
            if (!token)
                return false;
            sessionStorage.setItem('smartcart.accessToken', token);
            return true;
        })
            .catch(() => false)
            .finally(() => {
            refreshPromise = null;
        });
    }
    return refreshPromise;
}
async function request(path, init, retry = true) {
    const response = await fetch(`${API_BASE}${path}`, {
        ...init,
        credentials: 'include',
        headers: {
            ...authHeaders(),
            ...(init.headers || {}),
        },
    });
    if (response.status === 401 &&
        retry &&
        canRefresh(path) &&
        (await refreshAccessToken())) {
        return request(path, init, false);
    }
    return response;
}
async function parseResponse(response, fallbackMessage) {
    const body = await response.json().catch(() => ({}));
    if (!response.ok || body.success === false) {
        throw new Error(getSafeErrorMessage(response.status, body.message, body.errors, fallbackMessage));
    }
    return (body.data ?? body);
}
function getSafeErrorMessage(status, rawMessage, rawErrors, fallbackMessage) {
    const message = typeof rawMessage === 'string' ? rawMessage : '';
    const fieldErrors = rawErrors && typeof rawErrors === 'object'
        ? Object.entries(rawErrors)
            .filter(([, value]) => typeof value === 'string' && value.trim())
            .map(([field, value]) => `${field}: ${value}`)
            .join(' · ')
        : '';
    const containsInternalDetails = /E11000|duplicate key|Mongo|Mongoose|collection:|index:|CastError|ValidationError|stack/i.test(message);
    if (status >= 500)
        return 'SmartCart is having trouble right now. Please try again shortly.';
    if (containsInternalDetails) {
        return 'Something went wrong while completing your request. Please try again.';
    }
    if (message)
        return fieldErrors ? `${message}: ${fieldErrors}` : message;
    if (fieldErrors)
        return fieldErrors;
    if (status === 401)
        return 'Please sign in to continue.';
    if (status === 403)
        return 'You do not have permission to perform this action.';
    if (status === 404)
        return 'The requested item could not be found.';
    if (status === 409)
        return 'This action could not be completed right now. Please try again.';
    return fallbackMessage;
}
export async function getJson(path) {
    const response = await request(path, {});
    return parseResponse(response, 'Unable to load SmartCart data');
}
export async function sendJson(path, method, payload) {
    const response = await request(path, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: payload ? JSON.stringify(payload) : undefined,
    });
    return parseResponse(response, 'Request could not be completed');
}
export async function sendForm(path, formData, method = 'POST') {
    const normalizedPath = path === '/upload/single' ? '/uploads/single' : path;
    const response = await request(normalizedPath, { method, body: formData });
    return parseResponse(response, 'Request could not be completed');
}
export async function getBlob(path) {
    const response = await request(path, {});
    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(getSafeErrorMessage(response.status, body.message, body.errors, 'Download failed'));
    }
    return response.blob();
}
