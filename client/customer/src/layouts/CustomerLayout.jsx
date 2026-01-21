import { Outlet } from "react-router-dom";

const CustomerLayout = () => {
  return (
    <div className="min-h-screen">
      {/* Navbar placeholder */}
      <header className="h-16 border-b flex items-center px-6">
        <h1 className="font-bold text-lg">SmartCart</h1>
      </header>

      {/* Page content */}
      <main className="p-6">
        <Outlet />
      </main>

      {/* Footer placeholder */}
      <footer className="h-14 border-t flex items-center justify-center text-sm">
        © SmartCart
      </footer>
    </div>
  );
};

export default CustomerLayout;
