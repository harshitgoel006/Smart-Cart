import { useEffect, useState, useRef } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthProvider";
import { getJson } from "../../../services/apiClient";
import type { Cart } from "../../../types";
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Package,
  Bell,
  LogOut,
  ArrowRight,
} from "lucide-react";

const fallbackCategoryLinks = [
  { label: "Men", slug: "men" },
  { label: "Women", slug: "women" },
  { label: "Electronics", slug: "electronics" },
  { label: "Home & Living", slug: "home-living" },
  { label: "Beauty", slug: "beauty" },
  { label: "Sports", slug: "sports" },
  { label: "Books", slug: "books" },
  { label: "Toys", slug: "toys" },
  { label: "Kids", slug: "kids" },
  { label: "Accessories", slug: "accessories" },
];

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [categoryLinks, setCategoryLinks] = useState(fallbackCategoryLinks);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setCategoriesOpen(false);
      }
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) {
      setCartCount(0);
      setWishlistCount(0);
      return;
    }

    Promise.all([
      getJson<Cart>("/carts"),
      getJson<{ count: number }>("/wishlists/count"),
    ])
      .then(([cart, wishlist]) => {
        setCartCount(cart.totalItems || 0);
        setWishlistCount(wishlist.count || 0);
      })
      .catch(() => {
        setCartCount(0);
        setWishlistCount(0);
      });
  }, [user]);

  useEffect(() => {
    getJson<Array<{ name: string; slug: string; parent?: string | null }>>(
      "/categories",
    )
      .then((categories) => {
        const topLevelCategories = categories
          .filter((category) => !category.parent)
          .slice(0, 10)
          .map((category) => ({ label: category.name, slug: category.slug }));

        if (topLevelCategories.length) {
          setCategoryLinks(topLevelCategories);
        }
      })
      .catch(() => setCategoryLinks(fallbackCategoryLinks));
  }, []);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();

    if (!query) {
      return;
    }

    closeMenus();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const closeMenus = () => {
    setMenuOpen(false);
    setCategoriesOpen(false);
    setAccountOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeMenus();
  };

  const displayName = user
    ? (user.fullname || user.username || "User").split(" ")[0]
    : "User";

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="site-header">
      <div className="announcement">
        <Sparkles size={13} className="announcement-sparkle" />
        <span>Free shipping on orders above ₹999</span>
        <b>•</b>
        <span>Easy 7 days return</span>
        <b>•</b>
        <span>
          Extra 10% off on your first order with code <strong>SMART10</strong>
        </span>
      </div>

      <div className="utility-bar">
        <div />
        <nav aria-label="Utility navigation">
          <Link to="/register">Become a Seller</Link>
          <span>•</span>
          <Link to="/orders">Track Order</Link>
          <span>•</span>
          <a href="mailto:smartcart025@gmail.com">Help &amp; Support</a>
        </nav>
      </div>

      <div className="main-navbar">
        <Link className="brand-badge-wrapper" to="/" onClick={closeMenus}>
          <div className="brand-logo-box">
            <ShoppingBag size={20} className="brand-logo-icon" />
          </div>
          <div className="brand-copy">
            <strong>
              Smart<span>Cart</span>
            </strong>
            <small>Shop Smarter. Live Better.</small>
          </div>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link
            className={
              isActive("/") && location.pathname === "/" ? "active" : ""
            }
            to="/"
          >
            Home
          </Link>
          <Link
            className={
              isActive("/products") &&
              !location.search.includes("discountPercentage") &&
              !location.search.includes("sort=newest")
                ? "active"
                : ""
            }
            to="/products"
          >
            Shop
          </Link>

          <div className="nav-dropdown" ref={dropdownRef}>
            <button
              type="button"
              className="nav-dropdown__trigger"
              onClick={() => setCategoriesOpen((current) => !current)}
              aria-expanded={categoriesOpen}
            >
              Categories{" "}
              <ChevronDown
                size={14}
                className={`dropdown-chevron ${categoriesOpen ? "open" : ""}`}
              />
            </button>

            {categoriesOpen && (
              <div className="nav-dropdown__menu animate-fade-in">
                {categoryLinks.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/categories/${category.slug}`}
                    className="dropdown-item-link"
                    onClick={closeMenus}
                  >
                    {category.label}
                  </Link>
                ))}
                <Link
                  className="nav-dropdown__all"
                  to="/products"
                  onClick={closeMenus}
                >
                  View all categories <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>

          <Link
            className={
              location.search.includes("discountPercentage=20") ? "active" : ""
            }
            to="/products?discountPercentage=20"
          >
            Deals
          </Link>
          <Link
            className={`nav-link-nowrap ${location.search.includes("sort=newest") ? "active" : ""}`}
            to="/products?sort=newest"
          >
            New Arrivals
          </Link>
        </nav>

        <div className="header-actions">
          <form className="header-search" onSubmit={submitSearch}>
            <Search size={16} className="search-icon-prefix" />
            <input
              aria-label="Search products"
              placeholder="Search for products, brands and more..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="submit" aria-label="Search">
              <Search size={15} />
            </button>
          </form>

          <Link className="header-action" to="/wishlist" aria-label="Wishlist">
            <span className="header-action__icon">
              <Heart size={20} />
            </span>
            <span className="header-action__label">Wishlist</span>
            {wishlistCount > 0 && <b>{wishlistCount}</b>}
          </Link>

          <Link className="header-action" to="/cart" aria-label="Cart">
            <span className="header-action__icon">
              <ShoppingBag size={20} />
            </span>
            <span className="header-action__label">Cart</span>
            <b>{cartCount}</b>
          </Link>

          <div className="account-menu" ref={accountRef}>
            <button
              type="button"
              className="header-action account-menu__trigger"
              onClick={() => setAccountOpen((current) => !current)}
              aria-expanded={accountOpen}
            >
              <span className="header-action__icon">
                <UserIcon size={20} />
              </span>
              <span className="header-action__label">{displayName}</span>
              <ChevronDown
                size={14}
                className={`dropdown-chevron ${accountOpen ? "open" : ""}`}
              />
            </button>

            {accountOpen && (
              <div className="account-menu__dropdown animate-fade-in">
                <Link to={user ? "/account" : "/login"} onClick={closeMenus}>
                  <UserIcon size={14} /> {user ? "My Account" : "Sign in"}
                </Link>
                <Link to="/orders" onClick={closeMenus}>
                  <Package size={14} /> My Orders
                </Link>
                <Link to="/wishlist" onClick={closeMenus}>
                  <Heart size={14} /> Wishlist
                </Link>
                <Link to="/notifications" onClick={closeMenus}>
                  <Bell size={14} /> Notifications
                </Link>
                {user && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="logout-btn"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="mobile-nav animate-fade-in"
          aria-label="Mobile navigation"
        >
          <Link to="/" onClick={closeMenus}>
            Home
          </Link>
          <Link to="/products" onClick={closeMenus}>
            Shop
          </Link>
          <Link to="/products?discountPercentage=20" onClick={closeMenus}>
            Deals
          </Link>
          <Link to="/products?sort=newest" onClick={closeMenus}>
            New Arrivals
          </Link>
          <div className="mobile-nav__categories">
            <span>Categories</span>
            {categoryLinks.map((category) => (
              <Link
                key={category.slug}
                to={`/categories/${category.slug}`}
                onClick={closeMenus}
              >
                {category.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
