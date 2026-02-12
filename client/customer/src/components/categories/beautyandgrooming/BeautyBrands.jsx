import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// A sleek and modern "Top Brands" section for the beauty and grooming category, featuring a clean grid layout of brand logos with subtle hover effects, a bold header with gradient text, and a stylish call-to-action button at the bottom. The design emphasizes a premium and curated selection of brands, using a light color palette with soft shadows to create an inviting and luxurious feel.
const brands = [
  { name: "Garnier", slug: "garnier", logo: "https://i.pinimg.com/1200x/9a/0d/81/9a0d8188b493c166ed9fc55b0d82386b.jpg" },
  { name: "Mamaearth", slug: "mamaearth", logo: "https://i.pinimg.com/1200x/aa/37/80/aa3780a243c6317f45ad1281e168410f.jpg" },
  { name: "Nykaa", slug: "nykaa", logo: "https://i.pinimg.com/736x/f0/19/a0/f019a0715d2b981ddeca7f823c7ed212.jpg" },
  { name: "MAC", slug: "mac", logo: "https://i.pinimg.com/736x/98/7e/48/987e48e9e62181bc81d2e468fb310bd2.jpg" },
  
];

// A visually appealing "Top Brands" section for the beauty and grooming category, featuring a clean grid layout of brand logos with subtle hover effects, a bold header with gradient text, and a stylish call-to-action button at the bottom. The design emphasizes a premium and curated selection of brands, using a light color palette with soft shadows to create an inviting and luxurious feel.
const BeautyTopBrands = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      
      {/* LIGHT BACKGROUND GLOW (Original Palette) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-purple-200/30 blur-[140px]" />
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
              Premium <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Beauty Partners
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-500 font-medium max-w-sm md:text-right"
          >
            Curated selection of the world's most trusted beauty and grooming brands.
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
                  hover:shadow-[0_25px_50px_rgba(147,51,234,0.15)]
                "
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="
                    h-8 md:h-10 w-auto max-w-[80%] object-contain
                    grayscale opacity-60
                    group-hover:grayscale-0
                    group-hover:opacity-100
                    group-hover:scale-110
                    transition-all duration-500
                  "
                />

                {/* Hover text */}
                <span className="absolute bottom-4 text-[10px] font-black tracking-widest text-purple-600 uppercase opacity-0 group-hover:opacity-100 transition">
                  Shop Brand
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
                Discover More Glow
              </h3>
              <p className="text-gray-400">
                Explore 50+ premium skincare and makeup brands.
              </p>
            </div>

            <Link
              to="/brands"
              className="
                px-10 py-4 rounded-2xl
                 text-purple-600 font-black bg-white
                hover:bg-purple-600 hover:text-white
                transition-all shadow-lg
              "
            >
              BROWSE ALL BRANDS
            </Link>
          </div>

          {/* CTA Glow */}
          <div className="absolute -top-24 -right-24 h-72 w-72 bg-purple-500/20 rounded-full blur-3xl" />
        </motion.div>

      </div>
    </section>
  );
};

export default BeautyTopBrands;