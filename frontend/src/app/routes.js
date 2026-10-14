import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from 'react-router-dom';
import { AccountPage } from '../pages/Account/AccountPage';
import { CatalogPage } from '../pages/Catalog/CatalogPage';
import { CartPage } from '../pages/Cart/CartPage';
import { CheckoutPage } from '../pages/Checkout/CheckoutPage';
import { ForgotPasswordPage } from '../pages/Auth/ForgotPasswordPage';
import { HomePage } from '../pages/Home/HomePage';
import { LoginPage } from '../pages/Auth/LoginPage';
import { NotificationsPage } from '../features/notifications/NotificationsPage';
import { OrderDetailPage, OrdersPage } from '../pages/Orders/OrdersPage';
import { ProductDetailRoute } from '../pages/ProductDetail/ProductDetailRoute';
import { RegisterPage } from '../pages/Auth/RegisterPage';
import { SimpleAccountPage } from '../components/ui/EmptyState/SimpleAccountPage';
import { WishlistPage } from '../pages/Wishlist/WishlistPage';
import { AIShoppingPage } from '../pages/AIShopping/AIShoppingPage';
import { CategoriesPage } from '../pages/Categories/CategoriesPage';
import { AdminPage } from '../pages/Admin/AdminPage';
import { AdminProfilePage } from '../pages/Admin/AdminProfilePage';
import { SellerPage } from '../pages/Seller/SellerPage';
import { SellerToolsPage } from '../pages/Seller/SellerToolsPage';
export function AppRoutes() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/products", element: _jsx(CatalogPage, {}) }), _jsx(Route, { path: "/search", element: _jsx(CatalogPage, {}) }), _jsx(Route, { path: "/categories", element: _jsx(CategoriesPage, {}) }), _jsx(Route, { path: "/categories/:slug", element: _jsx(CategoriesPage, {}) }), _jsx(Route, { path: "/products/:id", element: _jsx(ProductDetailRoute, {}) }), _jsx(Route, { path: "/cart", element: _jsx(CartPage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/forgot-password", element: _jsx(ForgotPasswordPage, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: "/wishlist", element: _jsx(WishlistPage, {}) }), _jsx(Route, { path: "/account", element: _jsx(AccountPage, {}) }), _jsx(Route, { path: "/checkout", element: _jsx(CheckoutPage, {}) }), _jsx(Route, { path: "/orders", element: _jsx(OrdersPage, {}) }), _jsx(Route, { path: "/orders/:id", element: _jsx(OrderDetailPage, {}) }), _jsx(Route, { path: "/orders/:id/tracking", element: _jsx(OrderDetailPage, {}) }), _jsx(Route, { path: "/notifications", element: _jsx(NotificationsPage, {}) }), _jsx(Route, { path: "/ai-shopping", element: _jsx(AIShoppingPage, {}) }), _jsx(Route, { path: "/admin", element: _jsx(AdminPage, {}) }), _jsx(Route, { path: "/admin/profile", element: _jsx(AdminProfilePage, {}) }), _jsx(Route, { path: "/seller", element: _jsx(SellerPage, {}) }), _jsx(Route, { path: "/seller/tools", element: _jsx(SellerToolsPage, {}) }), _jsx(Route, { path: "*", element: _jsx(SimpleAccountPage, { title: "Page not found", text: "This SmartCart page does not exist.", link: "/", linkText: "Return home" }) })] }));
}
