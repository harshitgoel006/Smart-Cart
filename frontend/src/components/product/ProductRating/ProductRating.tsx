export function ProductRating({ rating, reviews }: { rating?: number; reviews?: number }) {
  return <span className="rating-row">★ {Number(rating || 0).toFixed(1)} <span className="muted">({reviews || 0})</span></span>
}
