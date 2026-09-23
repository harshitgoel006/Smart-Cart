import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../../types'
import { formatPrice, getNumber, productImage } from '../../../utils/formatters'
import { useAuth } from '../../../app/providers/AuthProvider'
import { sendJson } from '../../../services/apiClient'

export function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth(); const [saved, setSaved] = useState(false); const [message, setMessage] = useState('')
  const originalPrice = getNumber(product.price); const finalPrice = getNumber(product.finalPrice || product.price)
  const save = async (event: React.MouseEvent) => { event.preventDefault(); event.stopPropagation(); if (!user) { setMessage('Sign in to save this product'); return }; try { await sendJson('/wishlists/items', 'POST', { productId: product._id }); setSaved(true); setMessage('Saved') } catch (error) { setMessage((error as Error).message) } }
  return <article className="product-card"><Link to={`/products/${product._id}`}><div className="product-card__image-wrap"><img src={productImage(product)} alt={product.name} loading="lazy" /><button type="button" aria-label="Save product" className={`product-card__wish ${saved ? 'is-saved' : ''}`} onClick={save}>{saved ? '♥' : '♡'}</button>{(product.discountPercentage || 0) > 0 && <span className="product-card__badge">-{product.discountPercentage}%</span>}</div><div className="product-card__content"><span className="eyebrow">{product.brand || 'SmartCart select'}</span><h3>{product.name}</h3><div className="rating-row"><span>★ {Number(product.ratings || 0).toFixed(1)}</span><span className="muted">({product.reviews || 0})</span></div><div className="price-row"><strong>{formatPrice(finalPrice)}</strong>{originalPrice > finalPrice && <del>{formatPrice(originalPrice)}</del>}</div>{message && <small className="card-message">{message}</small>}</div></Link></article>
}
