import { Link } from "react-router-dom";
import { motion } from "framer-motion";


// This is a static array of top fashion brands. In a real application, this data would likely come from an API or database.

const brands = [
  { name: "Nike", slug: "nike", logo: "https://cdn.simpleicons.org/nike/000000" },
  { name: "Adidas", slug: "adidas", logo: "https://cdn.simpleicons.org/adidas/000000" },
  { name: "Puma", slug: "puma", logo: "https://cdn.simpleicons.org/puma/000000" },
  { name: "Zara", slug: "zara", logo: "https://cdn.simpleicons.org/zara/000000" },
  { name: "H&M", slug: "hm", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/1200px-H%26M-Logo.svg.png" },
  { name: "Levi's", slug: "levis", logo: "https://i.pinimg.com/1200x/3a/2a/97/3a2a979ee06c68907450795bbe66d32c.jpg" },
  { name: "Calvin Klein", slug: "calvinklein", logo: "https://i.pinimg.com/736x/7d/01/46/7d01464413d127551c979f7d1170aa1d.jpg" },
  { name: "Ralph Lauren", slug: "ralphlauren", logo: "https://images.seeklogo.com/logo-png/16/1/polo-ralph-lauren-logo-png_seeklogo-168430.png" },
];


// The FashionTopBrands component is a dynamic showcase of leading fashion labels, featuring an interactive grid of brand logos with smooth animations and a compelling call-to-action to explore the full collection.

const FashionTopBrands = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      
      {/* LIGHT BACKGROUND GLOW */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-200/40 blur-[150px]" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 right-1/4 h-[500px] w-[500px] rounded-full bg-rose-200/30 blur-[150px]" 
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[10px] font-black tracking-[0.5em] text-rose-500 uppercase mb-4">The Brand Vault</p>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">
              Icons of <br />
              <span className="bg-gradient-to-r from-purple-600 via-rose-500 to-orange-500 bg-clip-text text-transparent italic">
                Modern Fashion
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-500 font-medium max-w-sm md:text-right text-sm leading-relaxed"
          >
            Curated partnership with 100+ global labels to bring you the latest drops and timeless classics.
          </motion.p>
        </div>

        {/* BRAND GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 lg:gap-10">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <Link
                to={`/brands/${brand.slug}`}
                className="
                  group relative flex items-center justify-center
                  h-40 rounded-[3rem]
                  bg-white/40 backdrop-blur-md
                  border border-white/60
                  transition-all duration-500
                  hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]
                "
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="
                    h-8 md:h-10 w-auto object-contain
                    grayscale opacity-40
                    group-hover:grayscale-0
                    group-hover:opacity-100
                    group-hover:scale-110
                    transition-all duration-700
                  "
                />

                {/* Hover Indicator */}
                <div className="absolute bottom-6 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <span className="text-[9px] font-black tracking-[0.3em] text-gray-900 uppercase">
                    Discover Collection
                  </span>
                  <div className="h-[2px] w-4 bg-rose-500 mt-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM CTA - Re-styled for better focus */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 relative overflow-hidden rounded-[3.5rem] bg-gray-950 p-12 md:p-16 shadow-3xl text-center md:text-left"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                Missed Your Favorite Label?
              </h3>
              <p className="text-gray-400 text-lg">
                Our inventory updates every hour with exclusive drops from across the globe.
              </p>
            </div>

            <Link
              to="/brands"
              className="
                group flex items-center gap-4 px-12 py-6 rounded-full
                bg-white text-black font-black text-xs tracking-[0.2em]
                hover:bg-rose-600 hover:text-white
                transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]
              "
            >
              BROWSE ALL LABELS
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            </Link>
          </div>

          {/* Abstract background accents for CTA */}
          <div className="absolute -top-24 -right-24 h-80 w-80 bg-rose-600/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 bg-purple-600/10 rounded-full blur-[100px]" />
        </motion.div>

      </div>
    </section>
  );
};

export default FashionTopBrands;