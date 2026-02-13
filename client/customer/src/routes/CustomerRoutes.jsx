import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerLayout from "../layout/CustomerLayout";
import Home from "../pages/Home/Home";
import Category from "../pages/Category/Categories";
import CategoryPage from "../pages/Category/CategoryPage";
import ProductListing from "../pages/Products/ProductListing";


const CustomerRoutes = () => {
  return (
    
      <>
      <Routes>
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/categories/*" element={<CategoryPage />} />
          <Route path="/products" element={<ProductListing />} />



        </Route>
      </Routes>
      </>
    
  );
};

export default CustomerRoutes;
