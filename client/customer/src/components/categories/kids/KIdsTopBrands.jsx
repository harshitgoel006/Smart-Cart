import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Sample brands data for the Kids Top Brands section

const brands = [
  { name: "Hopscotch", slug: "hopscotch", logo: "https://i.pinimg.com/736x/6d/8e/e4/6d8ee4635fe1fd54e3e5c60b34836e46.jpg" },
  { name: "FirstCry", slug: "firstcry", logo: "https://i.pinimg.com/1200x/ca/a8/ff/caa8ff69f2134a8471e49ee0b7c9a418.jpg" },
  { name: "PatPat", slug: "patpat", logo: "https://i.pinimg.com/736x/0a/79/73/0a7973e21ad5a18ed7b5e15cb83b453d.jpg" },
  { name: "GAP Kids", slug: "gap-kids", logo: "https://i.pinimg.com/736x/3e/24/35/3e2435b1d5fc92c24be40ca86a74a94b.jpg" },
];

// Kids Top Brands Component - Showcasing a curated selection of premium kids' brands with a modern, interactive design to drive brand exploration and engagement.

const KidsTopBrands = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      
      {/* LIGHT BACKGROUND GLOW (Warm Orange/Pink for Kids) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-purple-200/40 blur-[140px]" />
        <div className="absolute top-1/2 right-1/4 h-[420px] w-[420px] rounded-full bg-pink-300/25 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
              Premium Kids' <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Global Partners
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-500 font-medium max-w-sm md:text-right"
          >
            Curated styles from the world's leading labels for your little ones' comfort and joy.
          </motion.p>
        </div>

        {/* BRAND GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
            >
              <Link
                to={`/brands/${brand.slug}`}
                className="
                  group relative flex items-center justify-center
                  h-32 rounded-[2.5rem]
                  bg-white/80 backdrop-blur
                  border border-gray-100
                  transition-all duration-500
                  hover:shadow-[0_25px_50px_rgba(249,115,22,0.15)]
                "
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="
                    h-10 w-auto object-contain
                    grayscale opacity-60
                    group-hover:grayscale-0
                    group-hover:opacity-100
                    group-hover:scale-110
                    transition-all duration-500
                  "
                />

                {/* Hover text */}
                <span className="absolute bottom-4 text-[10px] font-black tracking-widest text-purple-600 uppercase opacity-0 group-hover:opacity-100 transition">
                  Explore Brand
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 relative overflow-hidden rounded-[3rem] bg-gray-900 p-10 shadow-2xl"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">
                Looking for more?
              </h3>
              <p className="text-gray-400">
                Discover over 50+ specialized kids' brands for every age.
              </p>
            </div>

            <Link
              to="/brands?category=kids"
              className="
                px-10 py-4 rounded-2xl
                 text-purple-600 font-black bg-white
                hover:bg-purple-600 hover:text-white
                transition-all shadow-lg
              "
            >
              VIEW ALL KIDS BRANDS
            </Link>
          </div>

          {/* CTA Glow */}
          <div className="absolute -top-24 -right-24 h-72 w-72 bg-purple-500/20 rounded-full blur-3xl" />
        </motion.div>

      </div>
    </section>
  );
};

export default KidsTopBrands;