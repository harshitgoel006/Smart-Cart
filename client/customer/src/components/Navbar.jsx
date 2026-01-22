import { NavLink, Link } from "react-router-dom";
import {
  FiSearch,
  FiBell,
  FiUser,
  FiLogOut,
  FiSettings,
  FiHeart,
  FiMapPin,
  FiPackage,
  FiStar,
  FiCreditCard,
  FiTag,
  FiHelpCircle
} from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkStyles = ({ isActive }) =>
    `relative text-[15px] font-semibold transition-colors
     ${isActive ? "text-purple-600" : "text-gray-600 hover:text-purple-600"}`;

  return (
    <>
      {/* Top gradient line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500" />

      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-8">

          {/* LOGO SECTION */}
<Link to="/" className="flex items-center gap-3 group transition-all duration-300">
  {/* Icon Container with subtle rotation and better shadow */}
  <div className="relative">
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500 
                    flex items-center justify-center shadow-lg shadow-purple-200 
                    group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out">
      <HiOutlineShoppingBag className="text-white text-2xl drop-shadow-md" />
    </div>
    {/* Decorative soft glow behind icon on hover */}
    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  </div>

  {/* Typography with tightened tracking for a premium look */}
  <div className="flex flex-col">
    <span className="text-2xl font-black tracking-tighter leading-none flex items-center gap-1">
      <span className="text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
        SMART
      </span>
      <span className="text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
        CART
      </span>
    </span>
   
  </div>
</Link>

          {/* NAV LINKS */}
          <nav className="hidden lg:flex gap-8">
            <NavLink to="/" className={navLinkStyles}>Home</NavLink>
            <NavLink to="/try-ai" className={navLinkStyles}>Try AI</NavLink>
            <NavLink to="/categories" className={navLinkStyles}>Categories</NavLink>
          </nav>

          {/* SEARCH */}
          <div className="flex-1 hidden md:block">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search for products..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-100
                focus:ring-4 focus:ring-purple-100 outline-none"
              />
            </div>
          </div>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-2 relative">

            {/* Cart */}
          <button className="p-2.5 rounded-full text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-all relative group">
            <HiOutlineShoppingBag className="text-2xl group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] flex items-center justify-center">
              3
            </span>
          </button>

            {/* Notification */}
            <button className="p-2.5 rounded-full text-gray-600 hover:bg-gray-100 hover:text-purple-600 transition-all relative">
            <FiBell className="text-xl" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

            {/* PROFILE */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="p-1.5 rounded-full hover:bg-purple-50 transition"
              >
                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                  <FiUser className="text-purple-600 text-lg" />
                </div>
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border overflow-hidden">

                  {/* USER */}
                  <div className="px-5 py-4 border-b">
                    <p className="font-bold text-gray-900">Harshit Goel</p>
                    <Link to="/profile" className="text-sm text-purple-600 font-semibold">
                      View profile
                    </Link>
                  </div>

                  {/* MENU */}
                  <div className="py-2 text-sm">
                    <Item to="/orders" icon={<FiPackage />} text="My Orders" />
                    <Item to="/reviews" icon={<FiStar />} text="My Reviews" />
                    <Item to="/wishlist" icon={<FiHeart />} text="Wishlist" />
                    <Item to="/address" icon={<FiMapPin />} text="My Address" />

                    <Divider />

                    <Item to="/settings" icon={<FiSettings />} text="Settings" />
                    <Item to="/notifications" icon={<FiBell />} text="Notification Preferences" />
                    <Item to="/payments" icon={<FiCreditCard />} text="Saved Payment Methods" />
                    <Item to="/offers" icon={<FiTag />} text="My Coupons & Offers" />

                    <Divider />

                    <Item to="/support" icon={<FiHelpCircle />} text="Help & Support" />
                    <Item to="/logout" icon={<FiLogOut />} text="Logout" danger />
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>
    </>
  );
};

const Item = ({ to, icon, text, danger }) => (
  <Link
    to={to}
    className={`px-5 py-2.5 flex items-center gap-3 transition
      ${danger
        ? "text-red-600 hover:bg-red-50"
        : "hover:bg-purple-50 hover:text-purple-700"}`}
  >
    <span className="text-lg">{icon}</span>
    <span className="font-medium">{text}</span>
  </Link>
);

const Divider = () => <div className="my-1 border-t" />;

export default Navbar;
