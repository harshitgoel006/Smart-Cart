import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowUpRight, MessageCircle, Plus, Send, Trash2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { aiApi } from '../../services/ai.api'
import type { AiAssistantResponse, AiProductSuggestion } from '../../types'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
  products?: AiProductSuggestion[]
}

type SavedChat = {
  id: string
  title: string
  updatedAt: string
  messages: ChatMessage[]
}

const STORAGE_KEY = 'smartcart.ai.chats'
const MAX_CHATS = 10
const CHAT_RETENTION_MS = 30 * 24 * 60 * 60 * 1000
const suggestedPrompts = [
  'Find gifts under ₹2000',
  'Show me everyday essentials',
  'Help me upgrade my setup',
  'Find something for the weekend',
]
const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Hi, I am SmartCart AI. Tell me what you are looking for and I will find the right picks for you.',
}

const createChat = (): SavedChat => ({
  id: crypto.randomUUID(),
  title: 'New shopping chat',
  updatedAt: new Date().toISOString(),
  messages: [welcomeMessage],
})

const loadChats = (): SavedChat[] => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as SavedChat[]
    return Array.isArray(stored)
      ? stored.filter((chat) => Date.now() - new Date(chat.updatedAt).getTime() <= CHAT_RETENTION_MS).slice(0, MAX_CHATS)
      : []
  } catch {
    return []
  }
}

export function AIShoppingPage() {
  const navigate = useNavigate()
  const [chats, setChats] = useState<SavedChat[]>(loadChats)
  const [activeId, setActiveId] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [featuredProducts, setFeaturedProducts] = useState<AiProductSuggestion[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    aiApi.recommendations([], 6).then(setFeaturedProducts).catch(() => setFeaturedProducts([]))
  }, [])

  useEffect(() => {
    if (!chats.length) {
      const chat = createChat()
      setChats([chat])
      setActiveId(chat.id)
      return
    }
    setActiveId((current) => current || chats[0].id)
  }, [chats])

  useEffect(() => {
    if (chats.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(chats.slice(0, MAX_CHATS)))
  }, [chats])

  const activeChat = useMemo(() => chats.find((chat) => chat.id === activeId) || chats[0], [activeId, chats])

  const updateActiveChat = (updater: (chat: SavedChat) => SavedChat) => {
    if (!activeChat) return
    setChats((current) => current.map((chat) => (chat.id === activeChat.id ? updater(chat) : chat)))
  }

  const startNewChat = () => {
    const chat = createChat()
    setChats((current) => [chat, ...current].slice(0, MAX_CHATS))
    setActiveId(chat.id)
    setMessage('')
    setError('')
  }

  const deleteChat = (id: string) => {
    const remaining = chats.filter((chat) => chat.id !== id)
    if (!remaining.length) {
      const chat = createChat()
      setChats([chat])
      setActiveId(chat.id)
      return
    }
    setChats(remaining)
    if (id === activeId) setActiveId(remaining[0].id)
  }

  const submitMessage = async (event: FormEvent) => {
    event.preventDefault()
    const trimmed = message.trim()
    if (!trimmed || loading || !activeChat) return

    updateActiveChat((chat) => ({
      ...chat,
      title: chat.messages.length <= 1 ? trimmed.slice(0, 34) : chat.title,
      updatedAt: new Date().toISOString(),
      messages: [...chat.messages, { id: crypto.randomUUID(), role: 'user', text: trimmed }],
    }))
    setMessage('')
    setError('')
    setLoading(true)

    try {
      const response: AiAssistantResponse = await aiApi.assist(trimmed)
      updateActiveChat((chat) => ({
        ...chat,
        updatedAt: new Date().toISOString(),
        messages: [...chat.messages, { id: crypto.randomUUID(), role: 'assistant', text: response.reply, products: response.products }],
      }))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Assistant is unavailable right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="ai-shopping-page">
      <section className="ai-shopping__shell">
        <aside className="ai-shopping__sidebar">
          <div className="ai-shopping__side-top">
            <div className="ai-shopping__brand"><span><MessageCircle size={16} /></span> SmartCart AI</div>
            <button type="button" className="ai-shopping__new" onClick={startNewChat}><Plus size={16} /> New chat</button>
          </div>
          <p className="ai-shopping__history-label">Recent chats</p>
          <div className="ai-shopping__history">
            {chats.map((chat) => (
              <div className={`ai-shopping__history-item ${chat.id === activeId ? 'is-active' : ''}`} key={chat.id}>
                <button type="button" onClick={() => setActiveId(chat.id)}><strong>{chat.title}</strong><small>{new Date(chat.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</small></button>
                <button type="button" className="ai-shopping__delete" onClick={() => deleteChat(chat.id)} aria-label={`Delete ${chat.title}`}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
          <p className="ai-shopping__retention">Your latest 10 chats are saved on this device for 30 days.</p>
        </aside>

        <section className="ai-shopping__conversation">
          <header className="ai-shopping__header">
            <div><span className="eyebrow">SmartCart intelligence</span><h1>Shop smarter, together.</h1><p>Tell me your budget, style or what you need. I will narrow down the right products.</p></div>
            <button type="button" onClick={() => navigate('/')} aria-label="Close AI shopping"><X size={20} /></button>
          </header>
          <div className="ai-shopping__messages">
            {activeChat?.messages.map((chatMessage) => (
              <div className={`ai-shopping__message ai-shopping__message--${chatMessage.role}`} key={chatMessage.id}>
                <p>{chatMessage.text}</p>
                {chatMessage.products?.length ? <div className="ai-shopping__products">{chatMessage.products.map((product) => <button type="button" key={product.id} onClick={() => navigate(`/products/${product.id}`)}>{product.image ? <img src={product.image} alt="" /> : <span className="ai-shopping__product-placeholder" />}<span><strong>{product.name}</strong><small>{product.brand || 'SmartCart pick'} · ₹{product.price}</small></span><ArrowUpRight size={15} /></button>)}</div> : null}
              </div>
            ))}
            {activeChat?.messages.length === 1 && (
              <div className="ai-shopping__quick-start">
                <div className="ai-shopping__quick-copy">
                  <strong>Not sure where to start?</strong>
                  <span>Try one of these prompts or ask in your own words.</span>
                </div>
                <div className="ai-shopping__prompts">
                  {suggestedPrompts.map((prompt) => (
                    <button type="button" key={prompt} onClick={() => setMessage(prompt)}>{prompt}<ArrowUpRight size={14} /></button>
                  ))}
                </div>
                {featuredProducts.length ? (
                  <div className="ai-shopping__featured">
                    <div className="ai-shopping__featured-heading"><strong>Popular picks for you</strong><span>Fresh from SmartCart</span></div>
                    <div className="ai-shopping__products ai-shopping__products--featured">
                      {featuredProducts.map((product) => (
                        <button type="button" key={product.id} onClick={() => navigate(`/products/${product.id}`)}>
                          {product.image ? <img src={product.image} alt="" /> : <span className="ai-shopping__product-placeholder" />}
                          <span><strong>{product.name}</strong><small>{product.brand || 'SmartCart pick'} · ₹{product.price}</small></span>
                          <ArrowUpRight size={15} />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
            {loading && <div className="ai-shopping__message ai-shopping__message--assistant"><p>Finding the right picks...</p></div>}
            {error && <p className="ai-shopping__error">{error}</p>}
          </div>
          <form className="ai-shopping__composer" onSubmit={submitMessage}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask for a product, budget or idea..." aria-label="Ask SmartCart AI" /><button type="submit" disabled={!message.trim() || loading} aria-label="Send message"><Send size={17} /></button></form>
        </section>
      </section>
    </main>
  )
}
