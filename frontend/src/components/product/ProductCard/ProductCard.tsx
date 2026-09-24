import { useState, type MouseEvent } from 'react'
import { ArrowRight, ArrowUpRight, Check, Heart, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../../../types'
import { formatPrice, getNumber, productImage } from '../../../utils/formatters'
import { useAuth } from '../../../app/providers/AuthProvider'
import { sendJson } from '../../../services/apiClient'

export function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [added, setAdded] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const originalPrice = getNumber(product.price)
  const finalPrice = getNumber(product.finalPrice || product.price)
  const stock = Number(product.stock || 0)
  const isLowStock = stock > 0 && stock <= 5

  const save = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!user) {
      setMessage('Sign in to save this product')
      return
    }

    try {
      await sendJson('/wishlists/items', 'POST', { productId: product._id })
      setSaved(true)
      setMessage('Saved to wishlist')
    } catch (error) {
      setMessage((error as Error).message)
    }
  }

  const addToCart = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!user) {
      setMessage('Sign in to add items to your bag')
      return
    }

    setBusy(true)
    setMessage('')

    try {
      await sendJson('/carts/add', 'POST', { productId: product._id, quantity: 1 })
      setAdded(true)
      setMessage('Added to your bag')
    } catch (error) {
      setMessage((error as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <Link className="product-card__image-link" to={`/products/${product._id}`}>
          <img src={productImage(product)} alt={product.name} loading="lazy" />
        </Link>
        <span className="product-card__image-glow" aria-hidden="true" />
        <Link className="product-card__quick-view" to={`/products/${product._id}`}>
          View details <ArrowUpRight size={14} strokeWidth={2} />
        </Link>
        <button
          type="button"
          aria-label={saved ? 'Saved to wishlist' : 'Save product'}
          className={`product-card__wish ${saved ? 'is-saved' : ''}`}
          onClick={save}
        >
          <Heart size={17} strokeWidth={1.8} fill={saved ? 'currentColor' : 'none'} />
        </button>
        {(product.discountPercentage || 0) > 0 && (
          <span className="product-card__badge">-{product.discountPercentage}%</span>
        )}
      </div>

      <div className="product-card__content">
        <div className="product-card__meta">
          <span className="eyebrow">{product.brand || 'SmartCart select'}</span>
          {isLowStock && <span className="product-card__stock">Only {stock} left</span>}
        </div>
        <Link className="product-card__title" to={`/products/${product._id}`}>
          <h3>{product.name}</h3>
        </Link>
        <div className="rating-row">
          <span className="rating-row__score">★ {Number(product.ratings || 0).toFixed(1)}</span>
          <span className="muted">{product.reviews || 0} reviews</span>
        </div>
        <div className="price-row">
          <strong>{formatPrice(finalPrice)}</strong>
          {originalPrice > finalPrice && <del>{formatPrice(originalPrice)}</del>}
        </div>
        <button
          type="button"
          className={`product-card__cart ${added ? 'is-added' : ''}`}
          onClick={addToCart}
          disabled={busy || !stock}
        >
          <span className="product-card__cart-label">
            {busy ? 'Adding to bag…' : added ? 'Added to bag' : stock ? 'Add to cart' : 'Out of stock'}
          </span>
          <span className="product-card__cart-icon">
            {added ? <Check size={16} strokeWidth={2.2} /> : <ShoppingBag size={16} strokeWidth={1.9} />}
          </span>
          {!added && !busy && stock > 0 && <ArrowRight className="product-card__cart-arrow" size={15} strokeWidth={2} />}
        </button>
        {message && <small className={`card-message ${added ? 'is-success' : ''}`}>{message}</small>}
      </div>
    </article>
  )
}
