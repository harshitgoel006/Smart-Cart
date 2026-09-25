import { ArrowUpRight, Camera, Mail, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <div className="site-footer__brand">
          <Link className="brand-badge-wrapper footer-brand" to="/">
            <span className="brand-logo-box"><ShoppingBag size={20} className="brand-logo-icon" /></span>
            <span className="brand-copy">
              <strong>Smart<span>Cart</span></strong>
              <small>Shop Smarter. Live Better.</small>
            </span>
          </Link>
          <p>Curated everyday shopping, made a little smarter.</p>
          <a className="site-footer__email" href="mailto:smartcart025@gmail.com">
            <Mail size={14} /> smartcart025@gmail.com
          </a>
        </div>

        <div className="site-footer__column">
          <span className="site-footer__label">Explore</span>
          <Link to="/products">All products</Link>
          <Link to="/products?sort=newest">New arrivals</Link>
          <Link to="/products?sort=ratingHighToLow">Top rated</Link>
          <Link to="/products?discountPercentage=20">Deals</Link>
        </div>

        <div className="site-footer__column">
          <span className="site-footer__label">SmartCart</span>
          <Link to="/categories">Categories</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Your bag</Link>
          <a href="mailto:smartcart025@gmail.com">Contact us</a>
        </div>

        <div className="site-footer__newsletter">
          <span className="site-footer__label">Stay in the know</span>
          <h2>Good finds, straight to your inbox.</h2>
          <a className="site-footer__join" href="mailto:smartcart025@gmail.com?subject=Join%20the%20SmartCart%20edit">
            Join the edit <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      <div className="site-footer__bottom">
        <small>© 2026 SmartCart. Made for better everyday choices.</small>
        <div className="site-footer__meta">
          <span>Secure shopping, thoughtful choices.</span>
          <a href="https://instagram.com" aria-label="SmartCart on Instagram"><Camera size={16} /></a>
        </div>
      </div>
    </footer>
  )
}
