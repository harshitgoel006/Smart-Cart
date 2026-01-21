import { Routes, Route } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout";

// Pages
import Home from "../pages/Home/Home";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import VerifyOtp from "../pages/Auth/VerifyOtp";

import Categories from "../pages/Categories/Categories";

import ProductList from "../pages/Products/ProductList";
import ProductDetail from "../pages/Products/ProductDetail";

import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";

import MyOrders from "../pages/Orders/MyOrders";
import OrderDetail from "../pages/Orders/OrderDetail";

import Profile from "../pages/Profile/Profile";
import Wishlist from "../pages/Wishlist/Wishlist";

import Notifications from "../pages/Notifications/Notifications";
import Escalation from "../pages/Support/Escalation";

const CustomerRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<Home />} />

        {/* Auth */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="verify-otp" element={<VerifyOtp />} />

        {/* Categories */}
        <Route path="categories" element={<Categories />} />

        {/* Products */}
        <Route path="products" element={<ProductList />} />
        <Route path="product/:id" element={<ProductDetail />} />

        {/* Cart & Checkout */}
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />

        {/* Orders */}
        <Route path="orders" element={<MyOrders />} />
        <Route path="orders/:id" element={<OrderDetail />} />

        {/* Account */}
        <Route path="profile" element={<Profile />} />
        <Route path="wishlist" element={<Wishlist />} />

        {/* Notifications & Support */}
        <Route path="notifications" element={<Notifications />} />
        <Route path="support" element={<Escalation />} />
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;
