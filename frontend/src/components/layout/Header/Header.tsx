import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../app/providers/AuthProvider'
import { getJson } from '../../../services/apiClient'
import type { Cart } from '../../../types'

export function Header() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      setCartCount(0)
      setWishlistCount(0)
      return
    }

    Promise.all([
      getJson<Cart>('/carts'),
      getJson<{ count: number }>('/wishlists/count'),
    ])
      .then(([cart, wishlist]) => {
        setCartCount(cart.totalItems || 0)
        setWishlistCount(wishlist.count || 0)
      })
      .catch(() => {
        setCartCount(0)
        setWishlistCount(0)
      })
  }, [user])

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = search.trim()

    if (!query) {
      return
    }

    setMenuOpen(false)
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <div className="announcement">
        Complimentary delivery on orders over ₹999
        <span>•</span>
        Curated shopping, made simple
      </div>

      <header className="site-header">
        <Link className="brand" to="/" onClick={closeMenu}>
          <span className="brand-mark">S</span>
          <span>
            smart<span>cart</span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link to="/products">Collections</Link>
          <Link to="/products?sort=newest">New in</Link>
          <Link to="/products?sort=ratingHighToLow">Top rated</Link>
          <Link to="/products?discountPercentage=20">Offers</Link>
        </nav>

        <div className="header-actions">
          <form className="header-search" onSubmit={submitSearch}>
            <span aria-hidden="true">⌕</span>
            <input
              aria-label="Search products"
              placeholder="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </form>

          <Link className="icon-button account-button" to="/account" aria-label="Account">
            {user ? (user.fullname || user.username || '♙').slice(0, 1).toUpperCase() : '♙'}
          </Link>

          <Link className="icon-button badge-button" to="/wishlist" aria-label="Wishlist">
            ♡
            {wishlistCount > 0 && <b>{wishlistCount}</b>}
          </Link>

          <Link className="cart-button" to="/cart" aria-label="Shopping bag">
            <span>Bag</span>
            <b>{cartCount}</b>
          </Link>

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? '×' : '☰'}
          </button>
        </div>

        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <Link to="/products" onClick={closeMenu}>Collections</Link>
            <Link to="/products?sort=newest" onClick={closeMenu}>New in</Link>
            <Link to="/products?sort=ratingHighToLow" onClick={closeMenu}>Top rated</Link>
            <Link to="/products?discountPercentage=20" onClick={closeMenu}>Offers</Link>
          </nav>
        )}
      </header>
    </>
  )
}
