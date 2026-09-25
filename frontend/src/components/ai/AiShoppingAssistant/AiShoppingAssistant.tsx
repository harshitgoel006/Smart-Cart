import { Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function AiShoppingAssistant() {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      className="ai-assistant__trigger"
      onClick={() => navigate('/ai-shopping')}
      aria-label="Open SmartCart AI assistant"
    >
      <Sparkles size={17} strokeWidth={1.8} />
      <strong>Ask AI</strong>
    </button>
  )
}
