import { getJson, sendJson } from './apiClient'
import type {
  AiAssistantResponse,
  AiComparisonResponse,
  AiOrderStatus,
  AiReviewSummary,
  AiSearchResponse,
  AiProductSuggestion,
} from '../types'

export const aiApi = {
  assist: (message: string) =>
    sendJson<AiAssistantResponse>('/ai/assistant', 'POST', { message }),
  search: (message: string) =>
    sendJson<AiSearchResponse>('/ai/search', 'POST', { message }),
  recommendations: (seedProductIds: string[] = [], limit = 8) =>
    getJson<AiProductSuggestion[]>(
      `/ai/recommendations?limit=${limit}&seedProductIds=${seedProductIds.join(',')}`,
    ),
  personalizedRecommendations: (limit = 8) =>
    getJson<AiProductSuggestion[]>(`/ai/recommendations/me?limit=${limit}`),
  compare: (productIds: string[]) =>
    sendJson<AiComparisonResponse>('/ai/compare', 'POST', { productIds }),
  cartSuggestions: (productIds: string[]) =>
    sendJson<AiProductSuggestion[]>('/ai/cart-suggestions', 'POST', { productIds }),
  reviewSummary: (productId: string) =>
    getJson<AiReviewSummary>(`/ai/reviews/${productId}/summary`),
  orderStatus: (orderId: string) =>
    getJson<AiOrderStatus>(`/ai/orders/${orderId}/status`),
}
