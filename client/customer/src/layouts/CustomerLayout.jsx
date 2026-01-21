import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-slate-900 dark:text-gray-200 transition-colors duration-300">
      
      {/* Header / Navbar placeholder */}
     <Navbar/>

      {/* Main content */}
      <main className="p-6">
        <Outlet />
      </main>

      {/* Footer placeholder */}
      <footer className="h-14 border-t border-gray-200 dark:border-slate-700
                         flex items-center justify-center text-sm
                         bg-white dark:bg-slate-800">
        © SmartCart
      </footer>
    </div>
  );
};

export default CustomerLayout;
