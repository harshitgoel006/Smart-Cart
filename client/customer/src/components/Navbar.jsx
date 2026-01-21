import { ShoppingCart, User, Search } from "lucide-react";

const Navbar = () => {
  return (
    <nav
      className="
        sticky top-0 z-50
        h-16
        flex items-center
        px-6
        bg-[var(--surface)]
        border-b border-[var(--border)]
      "
    >
      {/* Left: Logo */}
      <div className="text-lg font-semibold text-[var(--text-primary)]">
        SmartCart
      </div>

      {/* Center: Search */}
      <div className="flex-1 mx-8 hidden md:flex">
        <div
          className="
            flex items-center gap-2
            w-full max-w-xl
            px-3 py-2
            rounded-md
            bg-white
            border border-[var(--border)]
            focus-within:border-[var(--accent)]
            focus-within:ring-1 focus-within:ring-[var(--accent)]
            transition
          "
        >
          <Search size={16} className="text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Search products…"
            className="
              w-full
              text-sm
              outline-none
              bg-transparent
              text-[var(--text-primary)]
              placeholder-[var(--text-secondary)]
            "
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          className="
            flex items-center gap-2
            px-3 py-2
            rounded-md
            text-sm
            text-[var(--text-secondary)]
            hover:bg-gray-100
            hover:text-[var(--text-primary)]
            transition
          "
        >
          <ShoppingCart size={16} />
          <span className="hidden sm:inline">Cart</span>
        </button>

        <button
          className="
            flex items-center gap-2
            px-3 py-2
            rounded-md
            text-sm
            text-[var(--text-secondary)]
            hover:bg-gray-100
            hover:text-[var(--text-primary)]
            transition
          "
        >
          <User size={16} />
          <span className="hidden sm:inline">Profile</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
