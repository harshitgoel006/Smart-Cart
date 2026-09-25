import { ArrowRight, Sparkles, Tag, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

const offers = [
  { icon: Tag, title: 'Extra 10% off', detail: 'on your first order' },
  { icon: Truck, title: 'Free shipping', detail: 'on orders above ₹999' },
  { icon: Sparkles, title: 'Fresh finds daily', detail: 'new picks worth discovering' },
]

export function OfferStrip() {
  return (
    <section className="offer-strip" id="deals" aria-label="SmartCart offers">
      <div className="offer-strip__intro">
        <span className="offer-strip__spark"><Sparkles size={16} aria-hidden="true" /></span>
        <div>
          <span className="eyebrow">SmartCart offers</span>
          <strong>Little extras, better shopping.</strong>
        </div>
      </div>

      <div className="offer-strip__items">
        {offers.map(({ icon: Icon, title, detail }) => (
          <div className="offer-strip__item" key={title}>
            <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
            <span><b>{title}</b><small>{detail}</small></span>
          </div>
        ))}
      </div>

      <Link className="offer-strip__link" to="/products?discountPercentage=20">
        Shop deals <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </section>
  )
}
