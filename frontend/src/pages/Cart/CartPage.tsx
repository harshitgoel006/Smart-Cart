import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthProvider'
import { getJson, sendJson } from '../../services/apiClient'
import { aiApi } from '../../services/ai.api'
import type { AiProductSuggestion, Cart } from '../../types'
import { formatPrice, productImage } from '../../utils/formatters'
import { SimpleAccountPage } from '../../components/ui/EmptyState/SimpleAccountPage'
import { useSiteSettings } from '../../app/providers/SiteSettingsProvider'

type AvailableCoupon = {
  code: string
  description?: string
  discountType: 'percent' | 'flat'
  discountValue: number
  minOrderValue?: number
  expiryDate?: string
}

function notifyCartUpdated() {
  window.dispatchEvent(new CustomEvent('smartcart:cart-updated'))
}

function CartAiSuggestions({ suggestions }: { suggestions: AiProductSuggestion[] }) {
  if (!suggestions.length) return null

  return (
    <section className="cart-ai-section" aria-labelledby="cart-ai-heading">
      <div className="cart-ai-section__heading">
        <div>
          <span className="eyebrow">Picked for your basket</span>
          <h2 id="cart-ai-heading">Smart picks to complete your order</h2>
        </div>
        <span className="cart-ai-section__note">AI-curated for you</span>
      </div>
      <div className="cart-ai-grid">
        {suggestions.map((suggestion) => (
          <Link className="cart-ai-card" to={`/products/${suggestion.id}`} key={suggestion.id}>
            <div className="cart-ai-card__image">
              <img src={suggestion.image || productImage({ _id: suggestion.id, name: suggestion.name })} alt={suggestion.name} />
            </div>
            <div className="cart-ai-card__copy">
              <span>{suggestion.brand || 'SmartCart pick'}</span>
              <h3>{suggestion.name}</h3>
              {suggestion.price ? <strong>{formatPrice(suggestion.price)}</strong> : null}
            </div>
            <span className="cart-ai-card__arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function CartPage() {
  const { user } = useAuth()
  const settings = useSiteSettings()
  const [cart, setCart] = useState<Cart | null>(null)
  const [coupon, setCoupon] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState('')
  const [suggestions, setSuggestions] = useState<AiProductSuggestion[]>([])
  const [availableCoupons, setAvailableCoupons] = useState<AvailableCoupon[]>([])

  const refresh = async () => {
    try {
      const nextCart = await getJson<Cart>('/carts')
      setCart(nextCart)
      notifyCartUpdated()
      if (nextCart.items?.length) {
        const productIds = nextCart.items.map((item) => item.product?._id).filter(Boolean) as string[]
        try {
          setSuggestions(await aiApi.cartSuggestions(productIds))
        } catch {
          setSuggestions([])
        }
      } else {
        setSuggestions([])
      }
    } catch (error) {
      setMessage((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) void refresh()
    else setLoading(false)
  }, [user])

  useEffect(() => {
    if (!user) return
    void getJson<{ coupons: AvailableCoupon[] }>('/carts/coupon/available')
      .then((result) => setAvailableCoupons(result.coupons || []))
      .catch(() => setAvailableCoupons([]))
  }, [user])

  const updateQuantity = async (itemId: string, quantity: number) => {
    setBusy(itemId)
    setMessage('')
    try {
      const nextCart = await sendJson<Cart>(`/carts/update/${itemId}`, 'PUT', { quantity })
      setCart(nextCart)
      notifyCartUpdated()
    } catch (error) {
      setMessage((error as Error).message)
    } finally {
      setBusy('')
    }
  }

  const removeItem = async (itemId: string) => {
    setBusy(itemId)
    setMessage('')
    try {
      const nextCart = await sendJson<Cart>(`/carts/remove/${itemId}`, 'DELETE')
      setCart(nextCart)
      notifyCartUpdated()
      if (!nextCart.items.length) setSuggestions([])
    } catch (error) {
      setMessage((error as Error).message)
    } finally {
      setBusy('')
    }
  }

  const clear = async () => {
    setBusy('clear')
    setMessage('')
    try {
      setCart(await sendJson<Cart>('/carts/clear', 'DELETE'))
      setSuggestions([])
      notifyCartUpdated()
    } catch (error) {
      setMessage((error as Error).message)
    } finally {
      setBusy('')
    }
  }

  const applyCoupon = async (event: FormEvent) => {
    event.preventDefault()
    if (!coupon.trim()) return
    setBusy('coupon')
    setMessage('')
    try {
      setCart(await sendJson<Cart>('/carts/apply-coupon', 'POST', { couponCode: coupon.trim() }))
      setMessage('Coupon applied successfully.')
    } catch (error) {
      setMessage((error as Error).message)
    } finally {
      setBusy('')
    }
  }

  if (!user) return <SimpleAccountPage title="Your bag is private." text="Sign in to see your saved bag and continue checkout." link="/login" linkText="Sign in" />
  if (loading) return <main className="section empty-page"><h1>Loading your bag...</h1></main>

  const hasItems = Boolean(cart?.items?.length)

  return (
    <main className="cart-page section">
      <div className="catalog-heading">
        <div>
          <span className="eyebrow">Your edit</span>
          <h1>Your bag</h1>
          <p className="cart-page__intro">Thoughtful picks, ready when you are.</p>
        </div>
        {hasItems ? <button className="link-button" onClick={() => void clear()} disabled={Boolean(busy)}>Clear bag</button> : null}
      </div>

      {message ? <div className="api-notice">{message}</div> : null}

      {hasItems && cart ? (
        <>
          <div className="cart-layout">
            <div className="cart-items-column">
              <div className="cart-items-heading"><span>{cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}</span><span>Price</span></div>
              {cart.items.map((item) => (
                <article className="cart-item" key={item._id}>
                  <img src={productImage(item.product || { _id: '', name: '' })} alt={item.product?.name || 'Product'} />
                  <div className="cart-item__info">
                    <span className="eyebrow">{item.product?.brand || 'SmartCart'}</span>
                    <h3>{item.product?.name || 'Product'}</h3>
                    <strong>{formatPrice(item.lineTotalSnapshot || item.unitPriceSnapshot)}</strong>
                    <div className="cart-item__actions">
                    <div className="quantity" aria-label={`Quantity ${item.quantity}`}>
                      <button aria-label="Decrease quantity" disabled={Boolean(busy) || item.quantity <= 1} onClick={() => void updateQuantity(item._id, Math.max(1, item.quantity - 1))}>−</button>
                      <span>{item.quantity}</span>
                      <button aria-label="Increase quantity" disabled={Boolean(busy)} onClick={() => void updateQuantity(item._id, item.quantity + 1)}>＋</button>
                    </div>
                    <button className="link-button cart-remove" disabled={Boolean(busy)} onClick={() => void removeItem(item._id)}>Remove</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className={`cart-summary ${settings.features?.coupons === false ? 'cart-summary--coupons-hidden' : ''}`}>
              <span className="eyebrow">Order summary</span>
              <h2>{formatPrice(cart.finalAmount)}</h2>
              <p><span>Subtotal</span><b>{formatPrice(cart.subtotal)}</b></p>
              <p><span>Discount</span><b>-{formatPrice(cart.discountAmount)}</b></p>
              <form className="cart-coupon" onSubmit={applyCoupon}>
                <input aria-label="Coupon code" placeholder="Coupon code" value={coupon} onChange={(event) => setCoupon(event.target.value)} />
                <button className="ghost-dark-button" disabled={Boolean(busy)}>{busy === 'coupon' ? '...' : 'Apply'}</button>
              </form>
              {availableCoupons.length ? <div className="cart-available-coupons"><span className="eyebrow">Available offers</span>{availableCoupons.slice(0, 3).map((offer) => <button type="button" key={offer.code} onClick={() => setCoupon(offer.code)}><span><strong>{offer.code}</strong><small>{offer.description || `${offer.discountType === 'percent' ? `${offer.discountValue}% off` : `₹${offer.discountValue} off`}${offer.minOrderValue ? ` on orders above ₹${offer.minOrderValue}` : ''}`}</small></span><b>Use</b></button>)}</div> : null}\n              <Link className="primary-button" to="/checkout">Continue to checkout <span>↗</span></Link>
              <small className="cart-summary__hint">Secure checkout · Easy 7-day returns</small>
            </aside>
          </div>
          <CartAiSuggestions suggestions={suggestions} />
        </>
      ) : (
        <div className="empty-page cart-empty-state">
          <span className="eyebrow">Nothing here yet</span>
          <h1>Your bag is waiting.</h1>
          <p>Add something considered to get started.</p>
          <Link className="primary-button" to="/products">Explore products <span>↗</span></Link>
        </div>
      )}
    </main>
  )
}
