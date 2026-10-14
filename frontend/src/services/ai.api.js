import { getJson, sendJson } from './apiClient';
export const aiApi = {
    assist: (message) => sendJson('/ai/assistant', 'POST', { message }),
    search: (message) => sendJson('/ai/search', 'POST', { message }),
    recommendations: (seedProductIds = [], limit = 8) => getJson(`/ai/recommendations?limit=${limit}&seedProductIds=${seedProductIds.join(',')}`),
    personalizedRecommendations: (limit = 8) => getJson(`/ai/recommendations/me?limit=${limit}`),
    compare: (productIds) => sendJson('/ai/compare', 'POST', { productIds }),
    cartSuggestions: (productIds) => sendJson('/ai/cart-suggestions', 'POST', { productIds }),
    reviewSummary: (productId) => getJson(`/ai/reviews/${productId}/summary`),
    orderStatus: (orderId) => getJson(`/ai/orders/${orderId}/status`),
};
