import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthProvider'
import { getJson, sendJson } from '../../services/apiClient'
import type { Wishlist } from '../../types'
import { ProductCard } from '../../components/product/ProductCard/ProductCard'
import { SimpleAccountPage } from '../../components/ui/EmptyState/SimpleAccountPage'

function notifyWishlistUpdated() {
  window.dispatchEvent(new CustomEvent('smartcart:wishlist-updated'))
}

function notifyCartUpdated() {
  window.dispatchEvent(new CustomEvent('smartcart:cart-updated'))
}

export function WishlistPage() {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState<Wishlist | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState('')

  const refresh = async () => {
    try {
      setWishlist(await getJson<Wishlist>('/wishlists'))
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

  const remove = async (productId: string, itemId: string) => {
    setBusy(itemId)
    setMessage('')
    try {
      await sendJson(`/wishlists/items/${itemId}`, 'DELETE', { productId })
      setWishlist((current) => current ? { ...current, items: current.items.filter((item) => item._id !== itemId) } : current)
      notifyWishlistUpdated()
    } catch (error) {
      setMessage((error as Error).message)
    } finally {
      setBusy('')
    }
  }

  const moveToCart = async (productId: string, itemId: string) => {
    setBusy(itemId)
    setMessage('')
    try {
      await sendJson(`/wishlists/items/${itemId}/move-to-cart`, 'POST', { productId })
      setWishlist((current) => current ? { ...current, items: current.items.filter((item) => item._id !== itemId) } : current)
      notifyWishlistUpdated()
      notifyCartUpdated()
      setMessage('Item moved to your bag.')
    } catch (error) {
      setMessage((error as Error).message)
    } finally {
      setBusy('')
    }
  }

  const clearWishlist = async () => {
    setBusy('clear')
    setMessage('')
    try {
      await sendJson('/wishlists/clear', 'DELETE')
      setWishlist((current) => current ? { ...current, items: [] } : current)
      notifyWishlistUpdated()
    } catch (error) {
      setMessage((error as Error).message)
    } finally {
      setBusy('')
    }
  }

  if (!user) return <SimpleAccountPage title="Your wishlist is private." text="Sign in to save pieces you want to return to." link="/login" linkText="Sign in" />
  if (loading) return <main className="section empty-page"><h1>Loading your wishlist...</h1></main>

  return (
    <main className="wishlist-page section">
      <div className="catalog-heading wishlist-page__heading">
        <div>
          <span className="eyebrow">Saved for later</span>
          <h1>Your wishlist</h1>
          <p>Keep the pieces you love close.</p>
        </div>
        {wishlist?.items?.length ? <button className="wishlist-clear" disabled={Boolean(busy)} onClick={() => void clearWishlist()}>Clear wishlist</button> : null}
      </div>
      {message ? <div className="inline-message">{message}</div> : null}
      {wishlist?.items?.length ? (
        <div className="wishlist-grid">
          {wishlist.items.map((item) => item.product ? (
            <article className="wishlist-item" key={item._id}>
              <ProductCard product={item.product} />
              <div className="wishlist-actions">
                <button className="wishlist-action wishlist-action--primary" disabled={Boolean(busy)} onClick={() => void moveToCart(item.product?._id || '', item._id)}>Move to bag <span>↗</span></button>
                <button className="wishlist-action wishlist-action--remove" disabled={Boolean(busy)} onClick={() => void remove(item.product?._id || '', item._id)}>Remove</button>
              </div>
            </article>
          ) : null)}
        </div>
      ) : (
        <div className="empty-page">
          <h1>Nothing saved yet.</h1>
          <p>Keep your favourite finds close.</p>
          <Link className="primary-button" to="/products">Browse products</Link>
        </div>
      )}
    </main>
  )
}
