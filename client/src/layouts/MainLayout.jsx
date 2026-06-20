import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import ScrollToTop from "../components/common/ScrollToTop";

const MainLayout = () => {
  return (
    <div className="flex flex-col gap-10">
      <ScrollToTop />

      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
      
  );
};

export default MainLayout;
