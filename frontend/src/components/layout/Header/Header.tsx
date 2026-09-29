import { useEffect, useState, useRef } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthProvider";
import { getJson } from "../../../services/apiClient";
import type { Cart } from "../../../types";
import { useSiteSettings } from "../../../app/providers/SiteSettingsProvider";
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
  ShieldCheck,
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

const defaultSearchSuggestions = [
  { label: "New arrivals", query: "new arrivals", href: "/products?sort=newest" },
  { label: "Top rated picks", query: "top rated", href: "/products?sort=ratingHighToLow" },
  { label: "Deals under ₹999", query: "deals", href: "/products?discountPercentage=20" },
  { label: "Everyday electronics", query: "electronics", href: "/search?q=electronics" },
  { label: "Home essentials", query: "home essentials", href: "/search?q=home%20essentials" },
];

function AdminHeader({ displayName, onLogout }: { displayName: string; onLogout: () => void }) {
  const location = useLocation();
  return <header className="site-header admin-site-header">
    <div className="main-navbar">
      <Link className="brand-badge-wrapper" to="/admin">
        <div className="brand-logo-box"><ShoppingBag size={20} className="brand-logo-icon" /></div>
        <div className="brand-copy"><strong>Smart<span>Cart</span></strong><small>Admin workspace</small></div>
      </Link>
      <nav className="admin-header-nav" aria-label="Admin navigation">
        <Link className={location.pathname === "/admin" ? "active" : ""} to="/admin"><ShieldCheck size={16} /> Control room</Link>
        <Link to="/"><ArrowRight size={15} /> View storefront</Link>
      </nav>
      <div className="admin-header-account"><Link className={`admin-profile-link ${location.pathname === "/admin/profile" ? "is-active" : ""}`} to="/admin/profile"><UserIcon size={18} /><span>{displayName}</span></Link><button type="button" onClick={onLogout}><LogOut size={15} /> Sign out</button></div>
    </div>
  </header>
}

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading, logout } = useAuth();
  const siteSettings = useSiteSettings();
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoryLinks, setCategoryLinks] = useState(fallbackCategoryLinks);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

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
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // AuthProvider restores the session asynchronously on a full page load.
    // Do not clear badges while that hydration is still in progress.
    if (authLoading) return;

    if (!user) {
      setCartCount(0);
      setWishlistCount(0);
      return;
    }

    const refreshCounts = async () => {
      // Keep these requests independent. A temporary failure in wishlist
      // must not hide a valid cart badge (and vice versa).
      const [cartResult, wishlistResult] = await Promise.allSettled([
        getJson<Cart>("/carts"),
        getJson<{ count: number }>("/wishlists/count"),
      ]);

      if (cartResult.status === "fulfilled") {
        // Derive the badge from line items so a stale cached totalItems value
        // can never show a phantom item in the navbar.
        const cart = cartResult.value;
        const itemCount = Array.isArray(cart.items)
          ? cart.items.reduce(
              (total, item) => total + Math.max(0, Number(item.quantity) || 0),
              0,
            )
          : Math.max(0, Number(cart.totalItems) || 0);
        setCartCount(itemCount);
      }

      if (wishlistResult.status === "fulfilled") {
        setWishlistCount(Math.max(0, Number(wishlistResult.value.count) || 0));
      }
    };

    void refreshCounts();

    window.addEventListener("smartcart:cart-updated", refreshCounts);
    window.addEventListener("smartcart:wishlist-updated", refreshCounts);
    return () => {
      window.removeEventListener("smartcart:cart-updated", refreshCounts);
      window.removeEventListener("smartcart:wishlist-updated", refreshCounts);
    };
  }, [authLoading, user]);

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
    setSearchOpen(false);
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

  return user?.role === "admin" && location.pathname.startsWith("/admin") ? <AdminHeader displayName={user.fullname || user.email} onLogout={() => void handleLogout()} /> : (
    <header className="site-header">
      {siteSettings.announcement?.enabled !== false && <div className="announcement">
        <Sparkles size={13} className="announcement-sparkle" />
        <span>{siteSettings.announcement?.text || "Free shipping on orders above ₹999"}</span>
        <b>•</b>
        <span>Easy 7 days return</span>
        <b>•</b>
        <span>
          Extra 10% off on your first order with code <strong>{siteSettings.announcement?.code || "SMART10"}</strong>
        </span>
      </div>}

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
              {siteSettings.brand?.logoUrl ? <img src={siteSettings.brand.logoUrl} alt="SmartCart" /> : <ShoppingBag size={20} className="brand-logo-icon" />}
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
          <div className="header-search-wrap" ref={searchRef}>
          <form className="header-search" onSubmit={submitSearch}>
            <Search size={16} className="search-icon-prefix" />
            <input
              aria-label="Search products"
              placeholder="Search for products, brands and more..."
              value={search}
              onFocus={() => setSearchOpen(true)}
              onChange={(event) => { setSearch(event.target.value); setSearchOpen(true) }}
            />
            <button type="submit" aria-label="Search">
              <Search size={15} />
            </button>
          </form>
          {searchOpen && <div className="header-search__suggestions"><span className="header-search__suggestions-title">{search.trim() ? 'Try searching for' : 'Popular searches'}</span>{defaultSearchSuggestions.filter((item) => !search.trim() || item.label.toLowerCase().includes(search.toLowerCase()) || item.query.includes(search.toLowerCase())).map((item) => <Link key={item.label} to={item.href} onClick={() => setSearchOpen(false)}><Search size={14} /><span>{item.label}</span><ArrowRight size={14} /></Link>)}</div>}
          </div>

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
            {cartCount > 0 && <b>{cartCount}</b>}
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
                {user?.role === "admin" && <Link to="/admin" onClick={closeMenus}>
                  <ShieldCheck size={14} /> Admin dashboard
                </Link>}
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
