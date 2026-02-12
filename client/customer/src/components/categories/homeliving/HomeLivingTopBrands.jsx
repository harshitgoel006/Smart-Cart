import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// HomeLivingTopBrands component showcasing premium home design brands with a modern, interactive grid layout, featuring brand logos, hover effects, and a call-to-action to explore all brands in the home & living category.

const brands = [
  { name: "IKEA", slug: "ikea", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Ikea_logo.svg" },
  { name: "Philips", slug: "philips", logo: "https://images.philips.com/is/image/PhilipsConsumer/Philips_Wordmark-ALI-global" },
  { name: "HomeCentre", slug: "homecentre", logo: "https://zsquaremall.com/application/uploads/stores/1545380932_66143.jpg" },
  { name: "Urban Ladder", slug: "urban-ladder", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA28-FcmP8FVL042v-oW7jsfylisgBVeI9zw&s" },
];

const HomeLivingTopBrands = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      
      {/* LIGHT BACKGROUND GLOW (EMERALD & TEAL) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-emerald-100/40 blur-[140px]" />
        <div className="absolute top-1/2 right-1/4 h-[420px] w-[420px] rounded-full bg-teal-100/30 blur-[140px]" />
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
              Premium Home <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Design Partners
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-500 font-medium max-w-sm md:text-right"
          >
            Bring home excellence with curated brands that redefine modern living and comfort.
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
                  border border-emerald-50
                  transition-all duration-500
                  hover:shadow-[0_25px_50px_rgba(16,185,129,0.15)]
                "
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="
                    h-8 w-auto object-contain
                    grayscale opacity-60
                    group-hover:grayscale-0
                    group-hover:opacity-100
                    group-hover:scale-110
                    transition-all duration-500
                  "
                />

                {/* Hover text */}
                <span className="absolute bottom-4 text-[10px] font-black tracking-widest text-emerald-600 uppercase opacity-0 group-hover:opacity-100 transition">
                  Explore Gallery
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
          className="mt-20 relative overflow-hidden rounded-[3rem] bg-[#020d08] p-10 shadow-2xl"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">
                Seeking a specific style?
              </h3>
              <p className="text-gray-400">
                Discover furniture and decor from 100+ global interior experts.
              </p>
            </div>

            <Link
              to="/brands"
              className="
                px-10 py-4 rounded-2xl
                text-emerald-600 font-black bg-white
                hover:bg-emerald-600 hover:text-white
                transition-all shadow-lg
              "
            >
              BROWSE ALL BRANDS
            </Link>
          </div>

          {/* CTA Glow */}
          <div className="absolute -top-24 -right-24 h-72 w-72 bg-emerald-500/20 rounded-full blur-3xl" />
        </motion.div>

      </div>
    </section>
  );
};

export default HomeLivingTopBrands;