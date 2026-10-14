import { sendForm, sendJson } from './apiClient';
export const authApi = {
    login: (email, password) => sendJson('/users/login', 'POST', {
        email,
        password,
    }),
    register: (formData) => sendForm('/users/register', formData),
    getCurrentUser: () => sendJson('/users/get-user', 'GET'),
};
