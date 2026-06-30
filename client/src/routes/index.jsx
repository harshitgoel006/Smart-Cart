import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import HomePage from "../pages/home/HomePage";
import ProductsPage from "../pages/products/ProductsPage";
import CategoriesPage from "../pages/categories/CategoriesPage";
import AiPage from "../pages/ai/AiPage";

import ProfilePage from "../pages/profile/ProfilePage";
import OrdersPage from "../pages/orders/OrdersPage";
import WishlistPage from "../pages/wishlist/WishlistPage";
import AddressesPage from "../pages/addresses/AddressesPage";
import SettingsPage from "../pages/settings/SettingsPage";
import CategoryPage from "../pages/categories/CategoryPage";

import CartPage from "../pages/cart/CartPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },

      {
        path: "products",
        element: <ProductsPage />,
      },

      {
        path: "categories",
        element: <CategoriesPage />,
      },

      {
        path: "categories/:slug",
        element: <CategoryPage />,
      },

      {
        path: "ai",
        element: <AiPage />,
      },

      {
        path: "profile",
        element: <ProfilePage />,
      },

      {
        path: "orders",
        element: <OrdersPage />,
      },

      {
        path: "wishlist",
        element: <WishlistPage />,
      },

      {
        path: "addresses",
        element: <AddressesPage />,
      },

      {
        path: "settings",
        element: <SettingsPage />,
      },

      {
        path: "cart",
        element: <CartPage />,
      },
    ],
  },
]);

export default router;
