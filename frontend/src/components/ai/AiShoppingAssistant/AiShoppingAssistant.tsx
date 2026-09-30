import { Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSiteSettings } from '../../../app/providers/SiteSettingsProvider'

export function AiShoppingAssistant() {
  const navigate = useNavigate()
  const settings = useSiteSettings()

  if (settings.features?.askAi === false) return null

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
