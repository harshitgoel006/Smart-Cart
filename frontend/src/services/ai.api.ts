import { sendJson } from './apiClient'
import type { AiAssistantResponse } from '../types'

export const aiApi = {
  assist: (message: string) =>
    sendJson<AiAssistantResponse>('/ai/assistant', 'POST', { message }),
}
