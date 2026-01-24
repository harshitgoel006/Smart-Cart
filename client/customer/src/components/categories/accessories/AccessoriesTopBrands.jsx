import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const brands = [
  { name: "Fossil", slug: "fossil", logo: "https://i.pinimg.com/1200x/d0/d0/6f/d0d06fdb787d5764ce2e6b10ae8dfcdf.jpg" },
  { name: "Ray-Ban", slug: "ray-ban", logo: "https://i.pinimg.com/736x/d2/b1/a6/d2b1a649c89ec040e1c67d6281422568.jpg" },
  { name: "Wildcraft", slug: "wildcraft", logo: "https://upload.wikimedia.org/wikipedia/en/3/3d/Wildcraft_logo.png" },
  { name: "Casio", slug: "casio", logo: "https://i.pinimg.com/736x/6a/e9/aa/6ae9aa8a8f2a1c309e03235fb3471271.jpg" },
];

const AccessoriesTopBrands = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      
      {/* AMBIENT BACKGROUND GLOW (GOLD/ROSE THEME) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-amber-100/40 blur-[140px]" />
        <div className="absolute top-1/2 right-1/4 h-[420px] w-[420px] rounded-full bg-rose-200/30 blur-[140px]" />
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
              The Luxury <br />
              <span className="bg-gradient-to-r from-amber-600 to-rose-500 bg-clip-text text-transparent">
                Label Collective
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-500 font-medium max-w-sm md:text-right"
          >
            Authentic craftsmanship from the most prestigious accessory houses worldwide.
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
                  hover:shadow-[0_25px_50px_rgba(251,113,133,0.15)]
                "
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="
                    h-8 md:h-10 w-auto max-w-[70%] object-contain
                    grayscale opacity-60
                    group-hover:grayscale-0
                    group-hover:opacity-100
                    group-hover:scale-110
                    transition-all duration-500
                  "
                />

                {/* Hover text */}
                <span className="absolute bottom-4 text-[10px] font-black tracking-widest text-rose-500 uppercase opacity-0 group-hover:opacity-100 transition">
                  Explore Vault
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
          className="mt-20 relative overflow-hidden rounded-[3rem] bg-[#020617] p-10 shadow-2xl"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">
                Hunting for a specific label?
              </h3>
              <p className="text-gray-400">
                Discover 50+ specialized accessory brands in our curated directory.
              </p>
            </div>

            <Link
              to="/brands"
              className="
                px-10 py-4 rounded-2xl
                 text-rose-600 font-black bg-white
                hover:bg-rose-600 hover:text-white
                transition-all shadow-lg
              "
            >
              ALL ACCESSORY BRANDS
            </Link>
          </div>

          {/* CTA Glow */}
          <div className="absolute -top-24 -right-24 h-72 w-72 bg-rose-500/20 rounded-full blur-3xl" />
        </motion.div>

      </div>
    </section>
  );
};

export default AccessoriesTopBrands;