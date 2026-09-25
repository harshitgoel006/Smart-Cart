import { Route, Routes } from 'react-router-dom'
import { AccountPage } from '../pages/Account/AccountPage'
import { CatalogPage } from '../pages/Catalog/CatalogPage'
import { CartPage } from '../pages/Cart/CartPage'
import { CheckoutPage } from '../pages/Checkout/CheckoutPage'
import { ForgotPasswordPage } from '../pages/Auth/ForgotPasswordPage'
import { HomePage } from '../pages/Home/HomePage'
import { LoginPage } from '../pages/Auth/LoginPage'
import { NotificationsPage } from '../features/notifications/NotificationsPage'
import { OrderDetailPage, OrdersPage } from '../pages/Orders/OrdersPage'
import { ProductDetailPage } from '../pages/ProductDetail/ProductDetailPage'
import { RegisterPage } from '../pages/Auth/RegisterPage'
import { SimpleAccountPage } from '../components/ui/EmptyState/SimpleAccountPage'
import { WishlistPage } from '../pages/Wishlist/WishlistPage'
import { AIShoppingPage } from '../pages/AIShopping/AIShoppingPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<CatalogPage />} />
      <Route path="/search" element={<CatalogPage />} />
      <Route path="/categories/:slug" element={<CatalogPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/orders/:id" element={<OrderDetailPage />} />
      <Route path="/orders/:id/tracking" element={<OrderDetailPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/ai-shopping" element={<AIShoppingPage />} />
      <Route
        path="*"
        element={
          <SimpleAccountPage
            title="Page not found"
            text="This SmartCart page does not exist."
            link="/"
            linkText="Return home"
          />
        }
      />
    </Routes>
  )
}
