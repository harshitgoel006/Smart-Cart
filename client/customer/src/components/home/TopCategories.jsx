import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const categories = [
    { 
        name: "Electronics", 
        slug: "electronics", 
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=600&auto=format&fit=crop", 
        color: "from-blue-500/20" 
    },
    {
  name: "Fashion",
  slug: "fashion",
  image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=600&auto=format&fit=crop",
  color: "from-pink-500/20",
},
    { 
        name: "Groceries", 
        slug: "groceries", 
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop", 
        color: "from-green-500/20" 
    },
    { 
        name: "Home & Kitchen", 
        slug: "home-living", 
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop", 
        color: "from-orange-500/20" 
    },
    { 
        name: "Beauty", 
        slug: "beauty", 
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop", 
        color: "from-purple-500/20" 
    },
    { 
        name: "Sports", 
        slug: "sports", 
        image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop", 
        color: "from-red-500/20" 
    },
    {
  name: "Kids & Toys",
  slug: "kids",
  image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=600&auto=format&fit=crop",
  color: "from-yellow-500/20",
},

    { 
        name: "Accessories", 
        slug: "accessories", 
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop", 
        color: "from-cyan-500/20" 
    },
];



const TopCategories = () => {
  return (
    <section className="
  relative
  py-20
  bg-gradient-to-b from-purple-50/60 via-white to-pink-50/60
  overflow-hidden
">
    <div className="pointer-events-none absolute inset-0">
    <div className="
      absolute -top-24 left-1/2
      h-96 w-96
      -translate-x-1/2
      rounded-full
      bg-purple-300/20
      blur-3xl
    " />
  </div>

      <div className=" relative max-w-7xl mx-auto px-6">
        
        {/* HEADER SECTION */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
  <div>
    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
      Shop by{" "}
      <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
        Category
      </span>
    </h2>
    <p className="text-gray-500 mt-2 font-medium">
      Curated collections for your lifestyle
    </p>
  </div>

  {/* SEE ALL */}
  <Link
    to="/categories"
    className="
      group inline-flex items-center gap-2
      text-sm font-semibold text-purple-600
      hover:text-purple-700 transition
    "
  >
    See all categories
    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
  </Link>
</div>


        {/* CATEGORIES GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <div key={cat.slug}>
              <Link
                to={`/categories/${cat.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gray-100 transition-all duration-500 ease-out 
                           /* HOVER EFFECTS */
                           hover:-translate-y-3 
                           hover:shadow-[0_30px_60px_-15px_rgba(147,51,234,0.35)]"
              >
                {/* 1. Image Zoom */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* 2. Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity" />

                {/* 3. Shadow/Glow Internal Highlight */}
                <div className="absolute inset-0 border-[1px] border-white/0 group-hover:border-white/20 rounded-[2.5rem] transition-all duration-500" />

                {/* 4. Text Content */}
                <div className="absolute bottom-8 left-8 right-8 z-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[9px] font-bold tracking-[0.2em] text-white uppercase mb-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    Explore
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight drop-shadow-lg">
                    {cat.name}
                  </h3>
                </div>
                
                {/* 5. Bottom Gradient Glow (The "Shadow" extension) */}
                <div className="absolute -bottom-2 inset-x-0 h-10 bg-gradient-to-t from-purple-500/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCategories;
