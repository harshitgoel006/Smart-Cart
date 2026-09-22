import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Product, ProductQuestion, Review } from '../shared/types'
import { getJson, sendJson } from '../shared/api'
import { formatPrice, getNumber, productImage } from '../shared/formatters'
import { ProductSection } from '../components/ProductSection'
import { useAuth } from '../features/auth/AuthProvider'

export function ProductDetailPage() {
  const productId = useParams().id || ''
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [questions, setQuestions] = useState<ProductQuestion[]>([])
  const [selectedImage, setSelectedImage] = useState('')
  const [question, setQuestion] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [reviewSending, setReviewSending] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      getJson<Product>(`/products/product/${productId}`),
      getJson<Product[]>(`/products/product/${productId}/related?limit=4`),
      getJson<{ reviews: Review[] }>(`/products/product/${productId}/reviews?limit=8`),
      getJson<{ qna: ProductQuestion[] }>(`/products/product/${productId}/qna?limit=8`),
    ]).then(([data, relatedData, reviewData, qnaData]) => {
      if (cancelled) return
      setProduct(data); setSelectedImage(productImage(data)); setRelated(Array.isArray(relatedData) ? relatedData : [])
      setReviews(reviewData.reviews || []); setQuestions(qnaData.qna || [])
    }).catch((error: Error) => setMessage(error.message)).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [productId])

  if (loading) return <main className="detail-page section"><div className="product-skeleton detail-skeleton" /></main>
  if (!product) return <main className="section empty-page"><h1>Product unavailable</h1><p>{message}</p><Link className="primary-button" to="/products">Back to products</Link></main>

  const images = product.images?.map((image) => image.url).filter(Boolean) as string[] || [productImage(product)]
  const price = getNumber(product.finalPrice || product.price)
  const addToCart = async () => { try { await sendJson('/carts/add', 'POST', { productId: product._id, quantity: 1 }); setMessage('Added to your bag') } catch (error) { setMessage((error as Error).message) } }
  const askQuestion = async (event: React.FormEvent) => { event.preventDefault(); if (!question.trim()) return; setSending(true); setMessage(''); try { await sendJson(`/products/product/${product._id}/qna`, 'POST', { question }); setQuestions((current) => [{ _id: `pending-${Date.now()}`, question, status: 'pending', createdAt: new Date().toISOString(), user: { fullname: user?.fullname || 'You' } }, ...current]); setQuestion(''); setMessage('Your question has been sent to the seller.') } catch (error) { setMessage((error as Error).message) } finally { setSending(false) } }
  const submitReview = async (event: React.FormEvent) => { event.preventDefault(); setReviewSending(true); setMessage(''); try { await sendJson(`/products/product/${product._id}/reviews`, 'POST', { rating: reviewRating, title: reviewTitle, comment: reviewComment }); setReviewTitle(''); setReviewComment(''); setMessage('Review submitted for approval.') } catch (error) { setMessage((error as Error).message) } finally { setReviewSending(false) } }

  return <main className="detail-page section"><div className="detail-layout"><div className="gallery"><div className="gallery-main"><img src={selectedImage || productImage(product)} alt={product.name} /></div><div className="gallery-thumbs">{images.map((image) => <button className={selectedImage === image ? 'selected' : ''} onClick={() => setSelectedImage(image)} key={image}><img src={image} alt="" /></button>)}</div></div><div className="detail-copy"><span className="eyebrow">{product.brand || 'SmartCart selection'}</span><h1>{product.name}</h1><div className="detail-rating">★ {Number(product.ratings || 0).toFixed(1)} <span>({product.reviews || 0} reviews)</span></div><div className="detail-price">{formatPrice(price)} {getNumber(product.price) > price && <del>{formatPrice(product.price)}</del>}</div><p>{product.description}</p><div className="stock-note">{(product.stock || 0) > 0 ? `In stock - ${product.stock} available` : 'Currently out of stock'}</div><button className="primary-button detail-add" onClick={addToCart} disabled={!product.stock}>Add to bag <span>↗</span></button>{message && <div className="inline-message">{message}</div>}<div className="detail-promises"><span>Free delivery over Rs 999</span><span>Easy 7-day returns</span><span>Secure checkout</span></div></div></div><section className="detail-feedback"><div className="feedback-column"><div className="section-heading"><div><span className="eyebrow">Verified voices</span><h2>Reviews</h2></div></div>{user && <form className="review-form" onSubmit={submitReview}><div className="review-stars">{[1, 2, 3, 4, 5].map((star) => <button type="button" className={star <= reviewRating ? 'selected' : ''} onClick={() => setReviewRating(star)} key={star}>★</button>)}</div><input value={reviewTitle} onChange={(event) => setReviewTitle(event.target.value)} placeholder="Review title" /><textarea value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} placeholder="What did you think?" required minLength={5} /><button className="primary-button" disabled={reviewSending}>{reviewSending ? 'Submitting...' : 'Submit review'} <span>↗</span></button></form>}{reviews.length ? reviews.map((review) => <article className="feedback-card" key={review._id}><div className="feedback-card__top"><strong>{'*'.repeat(review.rating)}</strong><small>{review.user?.fullname || review.user?.username || 'SmartCart customer'}</small></div>{review.title && <h3>{review.title}</h3>}<p>{review.comment || 'A thoughtful purchase.'}</p>{review.isVerifiedPurchase && <span className="eyebrow">Verified purchase</span>}</article>) : <div className="section-empty">No reviews yet. Be the first to share your experience after delivery.</div>}</div><div className="feedback-column"><div className="section-heading"><div><span className="eyebrow">Ask the seller</span><h2>Questions</h2></div></div>{user ? <form className="question-form" onSubmit={askQuestion}><textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about size, material, delivery or care" minLength={5} required /><button className="primary-button" disabled={sending}>{sending ? 'Sending...' : 'Ask question'} <span>↗</span></button></form> : <p className="muted">Sign in to ask the seller a question.</p>}{questions.length ? questions.map((item) => <article className="feedback-card" key={item._id}><strong>Q. {item.question}</strong>{item.answer ? <p><b>A.</b> {item.answer}</p> : <small>Awaiting seller response</small>}</article>) : <div className="section-empty">No questions yet.</div>}</div></section>{related.length > 0 && <ProductSection title="You may also like" subtitle="More considered finds from this collection." products={related} loading={false} />}</main>
}
