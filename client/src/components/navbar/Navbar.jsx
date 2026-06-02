import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, ChevronDown } from "lucide-react";
import { navigationLinks } from "../../constants/navigation";
import { profileMenu } from "../../constants/profileMenu";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const glassStyle = {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(167, 139, 250, 0.15)",
  };

  return (
    <header className="sticky top-0 z-50 w-full" style={glassStyle}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        
        {/* Logo - Bold & Elegant */}
        <Link to="/" className="text-3xl font-extrabold tracking-tighter text-slate-900">
          Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">Cart</span>
        </Link>

        {/* Navigation - Minimalist */}
        <nav className="hidden md:flex items-center gap-10">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.path}
              className={({ isActive }) =>
                `text-[13px] font-semibold uppercase tracking-widest transition-colors duration-300 ${
                  isActive ? "text-violet-600" : "text-slate-500 hover:text-slate-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          
          {/* Search Bar - Extended & Rectangular */}
          <div className="hidden md:flex items-center gap-3 border border-slate-200 bg-white/50 px-4 py-2.5 w-80 rounded-lg focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-700" 
            />
          </div>

          {/* Action Icons */}
          {[
            { icon: <Heart size={20} />, path: "/wishlist" },
            { icon: <ShoppingCart size={20} />, path: "/cart", badge: "2" },
          ].map((item, i) => (
            <Link key={i} to={item.path} className="relative p-2 text-slate-600 hover:text-violet-600 transition-colors">
              {item.icon}
              {item.badge && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[9px] text-white font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)} 
              className="flex items-center gap-2 pl-3 pr-2 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
            >
              <User size={18} className="text-slate-700" />
              <ChevronDown size={14} className={`text-slate-500 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-100 bg-white/95 backdrop-blur-xl p-1 shadow-xl animate-in fade-in zoom-in duration-200">
                {profileMenu.map((item) => (
                  <Link key={item.label} to={item.path} onClick={() => setIsProfileOpen(false)} className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-violet-50 hover:text-violet-700 rounded-lg transition-all">
                    {item.label}
                  </Link>
                ))}
                <button className="w-full mt-1 px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 rounded-lg transition-all">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;