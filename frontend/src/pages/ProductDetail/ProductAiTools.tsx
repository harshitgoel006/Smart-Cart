import { useEffect, useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { aiApi } from '../../services/ai.api'
import type { AiComparisonResponse, AiProductSuggestion, AiReviewSummary, Product } from '../../types'

export function ProductAiTools({ product, related }: { product: Product; related: Product[] }) {
  const [summary, setSummary] = useState<AiReviewSummary | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [comparison, setComparison] = useState<AiComparisonResponse | null>(null)
  const [comparisonLoading, setComparisonLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<AiProductSuggestion[]>([])
  useEffect(() => {
    let active = true
    setSummaryLoading(true)
    aiApi.reviewSummary(product._id).then((data) => { if (active) setSummary(data) }).catch(() => { if (active) setSummary(null) }).finally(() => { if (active) setSummaryLoading(false) })
    aiApi.recommendations([product._id], 4).then((data) => { if (active) setRecommendations(data) }).catch(() => { if (active) setRecommendations([]) })
    return () => { active = false }
  }, [product._id])
  const compareProduct = related[0]
  const compare = async () => { if (!compareProduct) return; setComparisonLoading(true); try { setComparison(await aiApi.compare([product._id, compareProduct._id])) } catch { setComparison(null) } finally { setComparisonLoading(false) } }
  return <section className="product-ai-tools section" aria-label="SmartCart AI product insights"><div className="product-ai-tools__heading"><div><span className="eyebrow"><Sparkles size={13} /> SmartCart intelligence</span><h2>Shop with a little more confidence.</h2></div><span className="product-ai-tools__note">AI-assisted insights</span></div><div className="product-ai-tools__grid"><article className="product-ai-card"><span className="product-ai-card__label">Review digest</span><h3>What shoppers are saying</h3>{summaryLoading ? <p className="muted">Reading verified reviews...</p> : summary ? <><div className="product-ai-card__rating"><strong>{summary.averageRating.toFixed(1)}</strong><span>★ · {summary.reviewCount} reviews</span></div><p>{summary.summary}</p></> : <p className="muted">A review summary will appear as shoppers share more feedback.</p>}</article><article className="product-ai-card product-ai-card--compare"><span className="product-ai-card__label">Smart comparison</span><h3>Compare before you choose</h3><p>{compareProduct ? `See how ${product.name} compares with ${compareProduct.name}.` : 'More products from this collection will unlock a comparison.'}</p><button type="button" className="product-ai-card__button" onClick={compare} disabled={!compareProduct || comparisonLoading}>{comparisonLoading ? 'Comparing...' : 'Compare picks'} <ArrowRight size={15} /></button>{comparison && <div className="product-ai-card__result"><strong>AI take</strong><p>{comparison.summary}</p></div>}</article></div>{recommendations.length > 0 && <div className="product-ai-recommendations"><div><span className="product-ai-card__label">Picked for this product</span><h3>Smart picks you may also like</h3></div><div className="product-ai-recommendations__list">{recommendations.map((item) => <Link to={`/products/${item.id}`} key={item.id}>{item.image ? <img src={item.image} alt="" /> : <span className="product-ai-recommendations__placeholder" />}<span><strong>{item.name}</strong><small>{item.brand || 'SmartCart pick'}{item.price ? ` · ${item.price}` : ''}</small></span><ArrowRight size={14} /></Link>)}</div></div>}</section>
}
