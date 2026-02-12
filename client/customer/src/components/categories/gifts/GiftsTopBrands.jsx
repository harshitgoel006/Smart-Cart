import { Link } from "react-router-dom";
import { motion } from "framer-motion";


// This is the data for the GiftsTopBrands component showcasing premium gifting partners with a modern design, smooth animations, and enhanced user experience

const brands = [
  { name: "IGP", slug: "igp", logo: "https://etimg.etb2bimg.com/photo/101282226.cms" },
  { name: "FNP", slug: "fnp", logo: "https://play-lh.googleusercontent.com/5AobDqCU-TbarD6OtDTDf5TVf-sY1ApObTxn_KB8EK6d3Ye-_pXPnwFAX52OWH-fjVqI" },
  { name: "Archies", slug: "archies", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr-zP0LjPtC1vCM3Dhj-h0-w11e6LOA8dqIQ&s" },
  { name: "Mini So", slug: "miniso", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRorwPxe9yKhCYtm1t8p6lO9NFdbWOdSPF2cg&s" },
  
];


// This is the GiftsTopBrands component showcasing premium gifting partners with a modern design, smooth animations, and enhanced user experience

const GiftsTopBrands = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      
      {/* LIGHT BACKGROUND GLOW */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-rose-200/30 blur-[140px]" />
        <div className="absolute top-1/2 right-1/4 h-[420px] w-[420px] rounded-full bg-purple-300/25 blur-[140px]" />
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
              <span className="bg-gradient-to-r from-rose-600 to-purple-500 bg-clip-text text-transparent">
                Gifting Partners
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-500 font-medium max-w-sm md:text-right"
          >
            Delivering smiles through the world's most iconic and heart-warming brands.
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
                  hover:shadow-[0_25px_50px_rgba(225,29,72,0.15)]
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
                <span className="absolute bottom-4 text-[10px] font-black tracking-widest text-rose-600 uppercase opacity-0 group-hover:opacity-100 transition">
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
                Looking for a specific brand?
              </h3>
              <p className="text-gray-400">
                Discover 50+ specialized gifting labels on SmartCart.
              </p>
            </div>

            <Link
              to="/brands?category=gifts"
              className="
                px-10 py-4 rounded-2xl
                 text-rose-600 font-black bg-white
                hover:bg-rose-600 hover:text-white
                transition-all shadow-lg
              "
            >
              BROWSE ALL BRANDS
            </Link>
          </div>

          {/* CTA Glow */}
          <div className="absolute -top-24 -right-24 h-72 w-72 bg-rose-500/20 rounded-full blur-3xl" />
        </motion.div>

      </div>
    </section>
  );
};

export default GiftsTopBrands;