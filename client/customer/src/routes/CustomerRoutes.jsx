import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerLayout from "../layout/CustomerLayout";
import Home from "../pages/Home/Home";
import Categories from "../pages/Categories/Categories";
import Men from "../pages/Categories/Men";
import Women from "../pages/Categories/Women";
import Beauty from "../pages/Categories/Beauty";
import Kids from "../pages/Categories/Kids";
import Accessories from "../pages/Categories/Accessories";
import HomeLiving from "../pages/Categories/HomeLiving";
import Electronics from "../pages/Categories/Electronics";
import Gifts from "../pages/Categories/Gifts";
import Groceries from "../pages/Categories/Groceries";

const CustomerRoutes = () => {
  return (
    
      <>
      <Routes>
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/men" element={<Men />} />
          <Route path="/categories/women" element={<Women />} />
          <Route path="/categories/beauty" element={<Beauty />} />
          <Route path="/categories/kids" element={<Kids />} />
          <Route path="/categories/accessories" element={<Accessories />} />
          <Route path="/categories/home-living" element={<HomeLiving />} />
          <Route path="/categories/electronics" element={<Electronics />} />
          <Route path="/categories/gifts" element={<Gifts />} />
          <Route path="/categories/groceries" element={<Groceries />} />



        </Route>
      </Routes>
      </>
    
  );
};

export default CustomerRoutes;
