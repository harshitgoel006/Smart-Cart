import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerLayout from "../layout/CustomerLayout";
import Home from "../pages/Home/Home";
import Categories from "../pages/Categories/Categories";
import Men from "../pages/Categories/Men";

const CustomerRoutes = () => {
  return (
    
      <>
      <Routes>
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/men" element={<Men />} />

        </Route>
      </Routes>
      </>
    
  );
};

export default CustomerRoutes;
