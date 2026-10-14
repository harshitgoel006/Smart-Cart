import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthProvider";
import { getJson } from "../../../services/apiClient";
import { useSiteSettings } from "../../../app/providers/SiteSettingsProvider";
import { ShoppingBag, Heart, User as UserIcon, Search, Menu, X, ChevronDown, Sparkles, Package, Bell, LogOut, ArrowRight, ShieldCheck, } from "lucide-react";
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
function AdminHeader({ displayName, logoUrl, onLogout }) {
    const location = useLocation();
    return _jsx("header", { className: "site-header admin-site-header", children: _jsxs("div", { className: "main-navbar", children: [_jsxs(Link, { className: "brand-badge-wrapper", to: "/admin", children: [_jsx("div", { className: "brand-logo-box", children: logoUrl ? _jsx("img", { src: logoUrl, alt: "SmartCart" }) : _jsx(ShoppingBag, { size: 20, className: "brand-logo-icon" }) }), _jsxs("div", { className: "brand-copy", children: [_jsxs("strong", { children: ["Smart", _jsx("span", { children: "Cart" })] }), _jsx("small", { children: "Admin workspace" })] })] }), _jsxs("nav", { className: "admin-header-nav", "aria-label": "Admin navigation", children: [_jsxs(Link, { className: location.pathname === "/admin" ? "active" : "", to: "/admin", children: [_jsx(ShieldCheck, { size: 16 }), " Control room"] }), _jsxs(Link, { to: "/", children: [_jsx(ArrowRight, { size: 15 }), " View storefront"] })] }), _jsxs("div", { className: "admin-header-account", children: [_jsxs(Link, { className: `admin-profile-link ${location.pathname === "/admin/profile" ? "is-active" : ""}`, to: "/admin/profile", children: [_jsx(UserIcon, { size: 18 }), _jsx("span", { children: displayName })] }), _jsxs("button", { type: "button", onClick: onLogout, children: [_jsx(LogOut, { size: 15 }), " Sign out"] })] })] }) });
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
    const dropdownRef = useRef(null);
    const accountRef = useRef(null);
    const searchRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
                setCategoriesOpen(false);
            }
            if (accountRef.current &&
                !accountRef.current.contains(event.target)) {
                setAccountOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    useEffect(() => {
        // AuthProvider restores the session asynchronously on a full page load.
        // Do not clear badges while that hydration is still in progress.
        if (authLoading)
            return;
        if (!user) {
            setCartCount(0);
            setWishlistCount(0);
            return;
        }
        const refreshCounts = async () => {
            // Keep these requests independent. A temporary failure in wishlist
            // must not hide a valid cart badge (and vice versa).
            const [cartResult, wishlistResult] = await Promise.allSettled([
                getJson("/carts"),
                getJson("/wishlists/count"),
            ]);
            if (cartResult.status === "fulfilled") {
                // Derive the badge from line items so a stale cached totalItems value
                // can never show a phantom item in the navbar.
                const cart = cartResult.value;
                const itemCount = Array.isArray(cart.items)
                    ? cart.items.reduce((total, item) => total + Math.max(0, Number(item.quantity) || 0), 0)
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
        getJson("/categories")
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
    const submitSearch = (event) => {
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
    const isActive = (path) => {
        if (path === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(path);
    };
    return user?.role === "admin" && location.pathname.startsWith("/admin") ? _jsx(AdminHeader, { displayName: user.fullname || user.email, logoUrl: siteSettings.brand?.logoUrl, onLogout: () => void handleLogout() }) : (_jsxs("header", { className: `site-header ${user?.role === 'seller' ? 'seller-site-header' : ''}`, children: [siteSettings.announcement?.enabled !== false && _jsxs("div", { className: "announcement", children: [_jsx(Sparkles, { size: 13, className: "announcement-sparkle" }), _jsx("span", { children: siteSettings.announcement?.text || "Free shipping on orders above ₹999" }), _jsx("b", { children: "\u2022" }), _jsx("span", { children: "Easy 7 days return" }), _jsx("b", { children: "\u2022" }), _jsxs("span", { children: ["Extra 10% off on your first order with code ", _jsx("strong", { children: siteSettings.announcement?.code || "SMART10" })] })] }), _jsxs("div", { className: "utility-bar", children: [_jsx("div", {}), _jsxs("nav", { "aria-label": "Utility navigation", children: [_jsx(Link, { to: "/register", children: "Become a Seller" }), _jsx("span", { children: "\u2022" }), _jsx(Link, { to: "/orders", children: "Track Order" }), _jsx("span", { children: "\u2022" }), _jsx("a", { href: "mailto:smartcart025@gmail.com", children: "Help & Support" })] })] }), _jsxs("div", { className: "main-navbar", children: [_jsxs(Link, { className: "brand-badge-wrapper", to: "/", onClick: closeMenus, children: [_jsx("div", { className: "brand-logo-box", children: siteSettings.brand?.logoUrl ? _jsx("img", { src: siteSettings.brand.logoUrl, alt: "SmartCart" }) : _jsx(ShoppingBag, { size: 20, className: "brand-logo-icon" }) }), _jsxs("div", { className: "brand-copy", children: [_jsxs("strong", { children: ["Smart", _jsx("span", { children: "Cart" })] }), _jsx("small", { children: "Shop Smarter. Live Better." })] })] }), _jsxs("nav", { className: "desktop-nav", "aria-label": "Primary navigation", children: [_jsx(Link, { className: isActive("/") && location.pathname === "/" ? "active" : "", to: "/", children: "Home" }), _jsx(Link, { className: isActive("/products") &&
                                    !location.search.includes("discountPercentage") &&
                                    !location.search.includes("sort=newest")
                                    ? "active"
                                    : "", to: "/products", children: "Shop" }), _jsxs("div", { className: "nav-dropdown", ref: dropdownRef, children: [_jsxs("button", { type: "button", className: "nav-dropdown__trigger", onClick: () => setCategoriesOpen((current) => !current), "aria-expanded": categoriesOpen, children: ["Categories", " ", _jsx(ChevronDown, { size: 14, className: `dropdown-chevron ${categoriesOpen ? "open" : ""}` })] }), categoriesOpen && (_jsxs("div", { className: "nav-dropdown__menu animate-fade-in", children: [categoryLinks.map((category) => (_jsx(Link, { to: `/categories/${category.slug}`, className: "dropdown-item-link", onClick: closeMenus, children: category.label }, category.slug))), _jsxs(Link, { className: "nav-dropdown__all", to: "/products", onClick: closeMenus, children: ["View all categories ", _jsx(ArrowRight, { size: 13 })] })] }))] }), _jsx(Link, { className: location.search.includes("discountPercentage=20") ? "active" : "", to: "/products?discountPercentage=20", children: "Deals" }), _jsx(Link, { className: `nav-link-nowrap ${location.search.includes("sort=newest") ? "active" : ""}`, to: "/products?sort=newest", children: "New Arrivals" })] }), _jsxs("div", { className: "header-actions", children: [_jsxs("div", { className: "header-search-wrap", ref: searchRef, children: [_jsxs("form", { className: "header-search", onSubmit: submitSearch, children: [_jsx(Search, { size: 16, className: "search-icon-prefix" }), _jsx("input", { "aria-label": "Search products", placeholder: "Search for products, brands and more...", value: search, onFocus: () => setSearchOpen(true), onChange: (event) => { setSearch(event.target.value); setSearchOpen(true); } }), _jsx("button", { type: "submit", "aria-label": "Search", children: _jsx(Search, { size: 15 }) })] }), searchOpen && _jsxs("div", { className: "header-search__suggestions", children: [_jsx("span", { className: "header-search__suggestions-title", children: search.trim() ? 'Try searching for' : 'Popular searches' }), defaultSearchSuggestions.filter((item) => !search.trim() || item.label.toLowerCase().includes(search.toLowerCase()) || item.query.includes(search.toLowerCase())).map((item) => _jsxs(Link, { to: item.href, onClick: () => setSearchOpen(false), children: [_jsx(Search, { size: 14 }), _jsx("span", { children: item.label }), _jsx(ArrowRight, { size: 14 })] }, item.label))] })] }), siteSettings.features?.wishlist !== false && _jsxs(Link, { className: "header-action", to: "/wishlist", "aria-label": "Wishlist", children: [_jsx("span", { className: "header-action__icon", children: _jsx(Heart, { size: 20 }) }), _jsx("span", { className: "header-action__label", children: "Wishlist" }), wishlistCount > 0 && _jsx("b", { children: wishlistCount })] }), _jsxs(Link, { className: "header-action", to: "/cart", "aria-label": "Cart", children: [_jsx("span", { className: "header-action__icon", children: _jsx(ShoppingBag, { size: 20 }) }), _jsx("span", { className: "header-action__label", children: "Cart" }), cartCount > 0 && _jsx("b", { children: cartCount })] }), _jsxs("div", { className: "account-menu", ref: accountRef, children: [_jsxs("button", { type: "button", className: "header-action account-menu__trigger", onClick: () => setAccountOpen((current) => !current), "aria-expanded": accountOpen, children: [_jsx("span", { className: "header-action__icon", children: _jsx(UserIcon, { size: 20 }) }), _jsx("span", { className: "header-action__label", children: displayName }), _jsx(ChevronDown, { size: 14, className: `dropdown-chevron ${accountOpen ? "open" : ""}` })] }), accountOpen && (_jsxs("div", { className: "account-menu__dropdown animate-fade-in", children: [_jsxs(Link, { to: user ? "/account" : "/login", onClick: closeMenus, children: [_jsx(UserIcon, { size: 14 }), " ", user ? "My Account" : "Sign in"] }), user?.role === "admin" && _jsxs(Link, { to: "/admin", onClick: closeMenus, children: [_jsx(ShieldCheck, { size: 14 }), " Admin dashboard"] }), user?.role === "seller" && _jsxs(Link, { to: "/seller", onClick: closeMenus, children: [_jsx(Package, { size: 14 }), " Seller workspace"] }), user?.role === "seller" && _jsxs(Link, { to: "/seller/tools", onClick: closeMenus, children: [_jsx(Package, { size: 14 }), " Seller controls"] }), _jsxs(Link, { to: "/orders", onClick: closeMenus, children: [_jsx(Package, { size: 14 }), " My Orders"] }), siteSettings.features?.wishlist !== false && _jsxs(Link, { to: "/wishlist", onClick: closeMenus, children: [_jsx(Heart, { size: 14 }), " Wishlist"] }), _jsxs(Link, { to: "/notifications", onClick: closeMenus, children: [_jsx(Bell, { size: 14 }), " Notifications"] }), user && (_jsxs("button", { type: "button", onClick: handleLogout, className: "logout-btn", children: [_jsx(LogOut, { size: 14 }), " Logout"] }))] }))] }), _jsx("button", { type: "button", className: "menu-toggle", onClick: () => setMenuOpen((current) => !current), "aria-label": menuOpen ? "Close menu" : "Open menu", "aria-expanded": menuOpen, children: menuOpen ? _jsx(X, { size: 24 }) : _jsx(Menu, { size: 24 }) })] })] }), menuOpen && (_jsxs("nav", { className: "mobile-nav animate-fade-in", "aria-label": "Mobile navigation", children: [_jsx(Link, { to: "/", onClick: closeMenus, children: "Home" }), _jsx(Link, { to: "/products", onClick: closeMenus, children: "Shop" }), _jsx(Link, { to: "/products?discountPercentage=20", onClick: closeMenus, children: "Deals" }), _jsx(Link, { to: "/products?sort=newest", onClick: closeMenus, children: "New Arrivals" }), _jsxs("div", { className: "mobile-nav__categories", children: [_jsx("span", { children: "Categories" }), categoryLinks.map((category) => (_jsx(Link, { to: `/categories/${category.slug}`, onClick: closeMenus, children: category.label }, category.slug)))] })] }))] }));
}
