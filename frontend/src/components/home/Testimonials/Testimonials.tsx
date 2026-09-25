import { Quote, Star } from 'lucide-react'

const testimonials = [
  {
    quote: 'The whole experience feels thoughtful—from finding something I liked to getting it delivered.',
    name: 'Ananya Mehta',
    detail: 'Verified shopper · New Delhi',
  },
  {
    quote: 'I came for one everyday essential and ended up discovering three things I genuinely needed.',
    name: 'Rohan Kapoor',
    detail: 'Verified shopper · Bengaluru',
  },
  {
    quote: 'Clean, simple and easy to browse. The recommendations actually felt useful, not random.',
    name: 'Priya Sharma',
    detail: 'Verified shopper · Mumbai',
  },
]

export function Testimonials() {
  return (
    <section className="testimonials section" aria-labelledby="testimonials-heading">
      <div className="testimonials__intro">
        <span className="eyebrow">Kind words</span>
        <h2 id="testimonials-heading">Good finds are better shared.</h2>
        <p>Real thoughts from shoppers building a more considered everyday.</p>
      </div>

      <div className="testimonials__grid">
        {testimonials.map((testimonial) => (
          <article className="testimonial-card" key={testimonial.name}>
            <div className="testimonial-card__top">
              <span className="testimonial-card__quote"><Quote size={18} strokeWidth={1.8} /></span>
              <span className="testimonial-card__stars" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, index) => <Star size={13} fill="currentColor" key={index} />)}
              </span>
            </div>
            <blockquote>“{testimonial.quote}”</blockquote>
            <footer>
              <strong>{testimonial.name}</strong>
              <span>{testimonial.detail}</span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  )
}
