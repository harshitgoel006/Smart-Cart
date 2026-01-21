import { Routes, Route } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout";

// temporary placeholder pages (abhi file nahi bani hain)
const Home = () => <h2>Home Page</h2>;
const Products = () => <h2>Products Page</h2>;
const Cart = () => <h2>Cart Page</h2>;
const Orders = () => <h2>My Orders Page</h2>;

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;
