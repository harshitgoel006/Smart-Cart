import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { aiApi } from '../../../services/ai.api'
import type { AiAssistantResponse } from '../../../types'

type ChatMessage = {
  role: 'user' | 'assistant'
  text: string
  response?: AiAssistantResponse
}

const welcomeMessage: ChatMessage = {
  role: 'assistant',
  text: 'Hi, I am SmartCart AI. Tell me what you are looking for and I will find it for you.',
}

export function AiShoppingAssistant() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submitMessage = async (event: FormEvent) => {
    event.preventDefault()

    const trimmedMessage = message.trim()

    if (!trimmedMessage || loading) {
      return
    }

    setMessage('')
    setError('')
    setMessages((current) => [...current, { role: 'user', text: trimmedMessage }])
    setLoading(true)

    try {
      const response = await aiApi.assist(trimmedMessage)

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: response.reply,
          response,
        },
      ])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Assistant is unavailable right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {open && (
        <aside className="ai-assistant" aria-label="SmartCart AI assistant">
          <div className="ai-assistant__header">
            <div>
              <span className="eyebrow">SmartCart intelligence</span>
              <h2>Shop smarter</h2>
            </div>
            <button type="button" className="ai-assistant__close" onClick={() => setOpen(false)} aria-label="Close assistant">
              ×
            </button>
          </div>

          <div className="ai-assistant__messages">
            {messages.map((chatMessage, index) => (
              <div className={`ai-message ai-message--${chatMessage.role}`} key={`${chatMessage.role}-${index}`}>
                <p>{chatMessage.text}</p>

                {chatMessage.response?.products.length ? (
                  <div className="ai-suggestions">
                    {chatMessage.response.products.map((product) => (
                      <button
                        type="button"
                        className="ai-suggestion"
                        key={product.id}
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        {product.image && <img src={product.image} alt="" />}
                        <span>
                          <strong>{product.name}</strong>
                          <small>{product.brand} · ₹{product.price}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            {loading && <div className="ai-message ai-message--assistant"><p>Finding the right picks…</p></div>}
            {error && <div className="ai-assistant__error">{error}</div>}
          </div>

          <form className="ai-assistant__form" onSubmit={submitMessage}>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask for a product, budget or idea…"
              aria-label="Ask SmartCart AI"
            />
            <button type="submit" disabled={loading || !message.trim()} aria-label="Send message">
              ↗
            </button>
          </form>
        </aside>
      )}

      <button type="button" className="ai-assistant__trigger" onClick={() => setOpen((current) => !current)} aria-label="Open SmartCart AI assistant">
        <span>✦</span>
        <strong>Ask AI</strong>
      </button>
    </>
  )
}
