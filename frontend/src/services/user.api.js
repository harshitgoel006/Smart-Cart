import { sendJson } from './apiClient';
export const userApi = {
    getCurrentUser: () => sendJson('/users/get-user', 'GET'),
    updateAccount: (payload) => sendJson('/users/update-account', 'PATCH', payload),
    updateAddress: (address) => sendJson('/users/update-address', 'PATCH', address),
    changePassword: (oldPassword, newPassword) => sendJson('/users/change-password', 'POST', { oldPassword, newPassword }),
};
